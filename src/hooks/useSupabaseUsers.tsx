
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
      name: 'Ali Salat',
      role: 'admin',
      department: 'ICT, Trade, Investment and Industry',
      skills: ['System Administration', 'Network Management', 'Database Administration'],
      isActive: true,
      createdAt: '2025-05-01T00:00:00Z',
      updatedAt: '2025-05-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'mshahid@wajir.go.ke',
      name: 'Mohamed Shahid',
      role: 'admin',
      department: 'ICT, Trade, Investment and Industry',
      skills: ['System Administration', 'Project Management', 'Cybersecurity'],
      isActive: true,
      createdAt: '2025-05-02T00:00:00Z',
      updatedAt: '2025-05-02T00:00:00Z',
    },
    {
      id: '3',
      email: 'xireysalat@gmail.com',
      name: 'Xirey Salat',
      role: 'technician',
      department: 'ICT, Trade, Investment and Industry',
      skills: ['Hardware Troubleshooting', 'Software Installation', 'Network Configuration'],
      isActive: true,
      createdAt: '2025-05-03T00:00:00Z',
      updatedAt: '2025-05-03T00:00:00Z',
    },
    {
      id: '4',
      email: 'yussuf@wajir.go.ke',
      name: 'Yussuf Abdullahi',
      role: 'technician',
      department: 'ICT, Trade, Investment and Industry',
      skills: ['Email Systems', 'Phone Systems', 'Mobile Device Management'],
      isActive: true,
      createdAt: '2025-05-04T00:00:00Z',
      updatedAt: '2025-05-04T00:00:00Z',
    },
    {
      id: '5',
      email: 'abdille@wajir.go.ke',
      name: 'Abdille Osman',
      role: 'approver',
      department: 'ICT, Trade, Investment and Industry',
      skills: ['Team Management', 'Quality Assurance', 'Process Improvement'],
      isActive: true,
      createdAt: '2025-05-05T00:00:00Z',
      updatedAt: '2025-05-05T00:00:00Z',
    },
    {
      id: '6',
      email: 'mabdisalaam@wajir.go.ke',
      name: 'Mohamed Abdisalaam',
      role: 'technician',
      department: 'ICT, Trade, Investment and Industry',
      skills: ['Network Configuration', 'Server Management', 'Backup & Recovery'],
      isActive: true,
      createdAt: '2025-05-06T00:00:00Z',
      updatedAt: '2025-05-06T00:00:00Z',
    },
  ];

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database error, using fallback users:', error);
        setUsers(fallbackUsers);
        setError('Using offline user data due to database connection issues');
        return;
      }

      if (data && data.length > 0) {
        const transformedUsers: User[] = data.map(profile => ({
          id: profile.id,
          email: profile.email, // Email is now stored in profiles
          name: profile.full_name || 'Unknown User',
          role: profile.role as 'admin' | 'approver' | 'technician' | 'requester',
          department: profile.department || 'Unknown Department',
          skills: profile.skills || [],
          isActive: profile.is_active !== false,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        }));
        setUsers(transformedUsers);
      } else {
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
