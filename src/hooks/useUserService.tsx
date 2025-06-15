import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Map Supabase profile data to our User type
const mapSupabaseProfile = (supabaseProfile: any): User => ({
  id: supabaseProfile.id,
  email: supabaseProfile.email, // Use the new email field from profiles
  name: supabaseProfile.full_name || 'Unknown User',
  role: supabaseProfile.role || 'requester',
  department: supabaseProfile.department || 'Unknown Department',
  title: undefined,
  skills: supabaseProfile.skills || [],
  isActive: supabaseProfile.is_active !== false,
  createdAt: supabaseProfile.created_at,
  updatedAt: supabaseProfile.updated_at,
});

export const useUserService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch profiles query with better error handling
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching profiles from Supabase...');
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        console.log('No authenticated user found');
        throw new Error('Authentication required');
      }

      console.log('Fetching profiles for user:', currentUser.email);

      // RLS policies now handle all permission logic, simplifying the query.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching profiles:', error);
        throw new Error(error.message || 'Failed to fetch profiles');
      }

      console.log('Successfully fetched profiles:', data?.length || 0);
      return (data || []).map(mapSupabaseProfile);
    },
    retry: (failureCount, error: any) => {
      console.log('Query retry attempt:', failureCount, error?.message);
      if (error?.message?.includes('Authentication required')) return false;
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    meta: {
      errorMessage: 'Failed to load users. Please check your permissions.',
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      name: string;
      role: 'admin' | 'approver' | 'technician' | 'requester';
      department: string;
      title?: string;
    }) => {
      const userId = crypto.randomUUID();

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userData.name,
          role: userData.role,
          department: userData.department,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User created successfully.',
        className: 'bg-green-50 border-green-200',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.name,
          role: userData.role,
          department: userData.department,
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully.',
        className: 'bg-blue-50 border-blue-200',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const user = usersQuery.data?.find(u => u.id === userId);
      
      if (user && (user.email === 'ellisalat@gmail.com' || user.email === 'mshahid@wajir.go.ke')) {
        throw new Error('Cannot delete protected admin users.');
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error("Error deleting user profile:", error);
        throw error;
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully.',
        className: 'bg-red-50 border-red-200',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete user. This might be a protected user or a database issue.',
        variant: 'destructive',
      });
    }
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isFetching: usersQuery.isFetching,
    error: usersQuery.error,
    refetchUsers: usersQuery.refetch,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
