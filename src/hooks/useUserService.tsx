
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Map Supabase user data to our User type
const mapSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  name: supabaseUser.name,
  role: supabaseUser.role,
  department: supabaseUser.department,
  title: supabaseUser.title || undefined,
  skills: supabaseUser.skills || [],
  isActive: supabaseUser.is_active !== false,
  createdAt: supabaseUser.created_at,
  updatedAt: supabaseUser.updated_at,
});

export const useUserService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch users query
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to fetch users');
      }

      return (data || []).map(mapSupabaseUser);
    },
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Authentication required')) return false;
      if (error?.message?.includes('infinite recursion')) return false;
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          department: userData.department,
          title: userData.title || null,
          is_active: true,
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
        .from('users')
        .update({
          name: userData.name,
          role: userData.role,
          department: userData.department,
          title: userData.title,
          is_active: userData.isActive,
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
        throw new Error('Cannot delete protected admin users');
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
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
        description: error.message || 'Failed to delete user',
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
