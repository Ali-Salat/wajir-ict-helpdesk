
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback users data in case of database issues
  const fallbackUsers: User[] = [
    {
      id: '1',
      email: 'ellisalat@gmail.com',
      name: 'Ellis Alat',
      role: 'admin',
      department: 'ICT',
      skills: ['System Administration', 'Network Management', 'Database Administration'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'mshahid@wajir.go.ke',
      name: 'Mohamed Shahid',
      role: 'admin',
      department: 'ICT',
      skills: ['System Administration', 'Project Management', 'Cybersecurity'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      email: 'xireysalat@gmail.com',
      name: 'Xirey Salat',
      role: 'technician',
      department: 'ICT',
      skills: ['Hardware Troubleshooting', 'Software Installation', 'Network Configuration'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      email: 'yussuf@wajir.go.ke',
      name: 'Yussuf Abdullahi',
      role: 'technician',
      department: 'ICT',
      skills: ['Email Systems', 'Phone Systems', 'Mobile Device Management'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '5',
      email: 'abdille@wajir.go.ke',
      name: 'Abdille Osman',
      role: 'approver',
      department: 'ICT',
      skills: ['Team Management', 'Quality Assurance', 'Process Improvement'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '6',
      email: 'mabdisalaam@wajir.go.ke',
      name: 'Mohamed Abdisalaam',
      role: 'technician',
      department: 'ICT',
      skills: ['Network Configuration', 'Server Management', 'Backup & Recovery'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch from database, but fallback to local data if there are issues
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database error, using fallback users:', error);
        setUsers(fallbackUsers);
        setError('Using offline user data due to database connection issues');
        return;
      }

      if (data && data.length > 0) {
        const transformedUsers: User[] = data.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as 'admin' | 'approver' | 'technician' | 'requester',
          department: user.department,
          skills: user.title ? user.title.split(', ') : [],
          isActive: true,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        }));
        setUsers(transformedUsers);
      } else {
        // No users in database, use fallback
        setUsers(fallbackUsers);
      }
    } catch (error: any) {
      console.warn('Error fetching users, using fallback:', error);
      setUsers(fallbackUsers);
      setError('Using offline user data');
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
