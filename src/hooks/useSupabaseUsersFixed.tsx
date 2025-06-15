
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
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }

        console.log('Fetched users successfully:', data);
        return data.map(mapSupabaseUser);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Attempting to delete user:', userId);
      
      // First check if user is protected
      const userToDelete = users.find(u => u.id === userId);
      if (userToDelete && (userToDelete.email === 'ellisalat@gmail.com' || userToDelete.email === 'mshahid@wajir.go.ke')) {
        throw new Error('Cannot delete protected admin users');
      }

      try {
        // Delete from users table
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) {
          console.error('Error deleting user:', error);
          throw error;
        }

        console.log('User deleted successfully');
        return { success: true };
      } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
      }
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

      try {
        // Generate a unique ID for the user
        const userId = crypto.randomUUID();

        // Create user profile directly in users table
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
        return { 
          success: true, 
          userId,
          user: data
        };
      } catch (error) {
        console.error('Failed to create user profile:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      toast({
        title: 'User Profile Created',
        description: `User profile created successfully. The user can sign up with their email to access the system.`,
        duration: 8000,
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

      try {
        // Update user profile
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
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
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
