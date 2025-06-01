
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedUsers: User[] = data.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        skills: user.title ? user.title.split(', ') : [],
        isActive: true,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));

      setUsers(transformedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetchUsers: fetchUsers,
  };
};
