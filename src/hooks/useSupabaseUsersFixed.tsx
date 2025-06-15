
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

export const useSupabaseUsersFixed = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { 
    data: users = [], 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['supabase-users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      
      try {
        // Check authentication first
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('Current authenticated user:', currentUser?.email);

        if (!currentUser) {
          console.error('No authenticated user found');
          throw new Error('Not authenticated');
        }

        // Fetch users with proper error handling
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching users:', error);
          throw error;
        }

        console.log('Successfully fetched users:', data?.length || 0, 'users');
        
        if (!data || data.length === 0) {
          console.warn('No users found in database');
          return [];
        }

        return data.map(mapSupabaseUser);
      } catch (error: any) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry auth errors
      if (error?.message?.includes('Not authenticated')) {
        return false;
      }
      // Don't retry RLS policy errors
      if (error?.code === '42P17' || error?.message?.includes('infinite recursion')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Attempting to delete user:', userId);
      
      const userToDelete = users.find(u => u.id === userId);
      if (userToDelete && (userToDelete.email === 'ellisalat@gmail.com' || userToDelete.email === 'mshahid@wajir.go.ke')) {
        throw new Error('Cannot delete protected admin users');
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "User Deleted",
        description: "User has been successfully removed from the system.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      console.error('Delete user error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || 'An unexpected error occurred while deleting the user.',
        variant: "destructive",
      });
    }
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
      console.log('Creating user profile with data:', userData);

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
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      console.log('User profile created successfully:', data);
      return { success: true, userId, user: data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: 'User Profile Created',
        description: 'User profile created successfully.',
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error('Create user error:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User> & { id: string }) => {
      console.log('Updating user with data:', userData);

      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          role: userData.role,
          department: userData.department,
          title: userData.title,
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      console.log('User updated successfully:', data);
      return { success: true, user: data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Update user error:', error);
      toast({
        title: "Update Failed",
        description: error.message || 'An unexpected error occurred while updating the user.',
        variant: "destructive",
      });
    }
  });

  const refetchUsers = () => {
    refetch();
  };

  return {
    users,
    isLoading,
    isFetching,
    error,
    refetchUsers,
    deleteUser: deleteUserMutation.mutateAsync,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
  };
};
