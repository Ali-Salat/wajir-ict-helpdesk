
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

// Map Supabase user data to our User type
const mapSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  name: supabaseUser.name,
  role: supabaseUser.role,
  department: supabaseUser.department,
  title: supabaseUser.title || undefined,
  skills: [], // Skills not stored in Supabase yet
  isActive: true, // Default to active
  createdAt: supabaseUser.created_at,
  updatedAt: supabaseUser.updated_at,
});

export const useSupabaseUsersFixed = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['supabase-users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Fetched users:', data);
      return data.map(mapSupabaseUser);
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const deleteUser = async (userId: string) => {
    try {
      console.log('Attempting to delete user:', userId);
      
      // First delete from our users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) {
        console.error('Error deleting from users table:', userError);
        throw userError;
      }

      console.log('Successfully deleted user from users table');
      
      // Invalidate and refetch the users query
      await queryClient.invalidateQueries({ queryKey: ['supabase-users'] });
      
      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  };

  const refetchUsers = () => {
    refetch();
  };

  return {
    users,
    isLoading,
    error,
    refetchUsers,
    deleteUser,
  };
};
