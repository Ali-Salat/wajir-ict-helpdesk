import { useState, useEffect } from 'react';
import { User } from '@/types';
import { UsersService } from '@/services/mongodbService';
import { useToast } from '@/hooks/use-toast';

export const useMongoUserService = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const mongoUsers = await UsersService.getAllUsers();
      
      // Transform MongoDB users to match our User type
      const transformedUsers: User[] = mongoUsers.map((user: any) => ({
        id: user._id || user.id,
        name: user.fullName || user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        title: user.title,
        isActive: user.isActive !== false, // Default to true if not specified
        skills: user.skills || [],
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users from MongoDB');
      
      // Fallback to hardcoded users if MongoDB fails
      const fallbackUsers: User[] = [
        {
          id: 'user-1',
          name: 'Ellis Alat',
          email: 'ellisalat@gmail.com',
          role: 'admin',
          department: 'ICT, Trade, Investment and Industry',
          title: 'System Administrator',
          isActive: true,
          skills: ['System Administration', 'Network Management', 'Database Management'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'user-2',
          name: 'Mohamed Shahid',
          email: 'mshahid@wajir.go.ke',
          role: 'admin',
          department: 'ICT, Trade, Investment and Industry',
          title: 'ICT Director',
          isActive: true,
          skills: ['ICT Management', 'Project Management', 'Strategic Planning'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        }
      ];
      setUsers(fallbackUsers);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: Partial<User>) => {
    try {
      setIsCreating(true);
      const newUser = await UsersService.createUser({
        fullName: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        title: userData.title,
        isActive: true,
        skills: userData.skills || [],
      });
      
      toast({
        title: "User Created",
        description: `${userData.name} has been successfully created.`,
        className: 'bg-green-50 border-green-200',
      });
      
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsUpdating(true);
      await UsersService.updateUser(userData.id!, {
        fullName: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        title: userData.title,
        isActive: userData.isActive,
        skills: userData.skills,
      });
      
      toast({
        title: "User Updated",
        description: `${userData.name} has been successfully updated.`,
        className: 'bg-green-50 border-green-200',
      });
      
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setIsDeleting(true);
      await UsersService.deleteUser(userId);
      
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
        className: 'bg-green-50 border-green-200',
      });
      
      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsDeleting(false);
    }
  };

  const refetchUsers = () => {
    fetchUsers();
  };

  return {
    users,
    isLoading,
    isFetching,
    error: error ? { message: error } : null,
    refetchUsers,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  };
};