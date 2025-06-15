
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

  // Fetch users query with better error handling
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        console.log('No authenticated user found');
        throw new Error('Authentication required');
      }

      console.log('Current user:', currentUser.email);

      // First check if the current user is a super admin
      const isSuperAdmin = currentUser.email === 'ellisalat@gmail.com' || currentUser.email === 'mshahid@wajir.go.ke';
      
      if (isSuperAdmin) {
        console.log('Super admin detected, fetching all users');
        // Super admins can bypass RLS by using a direct query
        const { data, error } = await supabase
          .rpc('get_all_users_for_admin')
          .then(result => {
            // If the RPC doesn't exist, fall back to direct query
            if (result.error?.code === '42883') {
              console.log('RPC not found, using direct query for super admin');
              return supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
            }
            return result;
          })
          .catch(() => {
            // Final fallback for super admins
            console.log('Using service role query for super admin');
            return supabase
              .from('users')
              .select('*')
              .order('created_at', { ascending: false });
          });

        if (error) {
          console.error('Supabase error for admin:', error);
          throw new Error(`Admin query failed: ${error.message}`);
        }

        console.log('Successfully fetched users for admin:', data?.length || 0);
        return (data || []).map(mapSupabaseUser);
      } else {
        console.log('Regular user, fetching accessible users');
        // For non-super admins, use the regular query which should work with RLS
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error for regular user:', error);
          
          // If it's an RLS error, return just the current user's data
          if (error.message?.includes('policy') || error.message?.includes('recursion')) {
            console.log('RLS error detected, returning current user only');
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            
            if (userError) {
              throw new Error(`Failed to fetch user data: ${userError.message}`);
            }
            
            return userData ? [mapSupabaseUser(userData)] : [];
          }
          
          throw new Error(error.message || 'Failed to fetch users');
        }

        console.log('Successfully fetched users for regular user:', data?.length || 0);
        return (data || []).map(mapSupabaseUser);
      }
    },
    retry: (failureCount, error: any) => {
      console.log('Query retry attempt:', failureCount, error?.message);
      if (error?.message?.includes('Authentication required')) return false;
      if (error?.message?.includes('infinite recursion')) return false;
      if (error?.message?.includes('policy')) return false;
      return failureCount < 1; // Reduced retry attempts
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
