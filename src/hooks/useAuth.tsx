
import { useSupabaseAuth } from './useSupabaseAuth';
import { useUserService } from './useUserService';

export const useAuth = () => {
  const { user: supabaseUser, isAuthenticated, isLoading, signOut, signIn, signUp, resetPassword } = useSupabaseAuth();
  const { users } = useUserService();

  // Find the user in our users table to get role and other details
  const user = users.find(u => u.email === supabaseUser?.email);

  // Check if user is super user - ellisalat@gmail.com and mshahid@wajir.go.ke have all privileges
  const isSuperUser = supabaseUser?.email === 'ellisalat@gmail.com' || supabaseUser?.email === 'mshahid@wajir.go.ke';

  // Check if user is admin - includes super users and specific admin emails
  const isAdmin = isSuperUser || (user?.role === 'admin');

  const hasRole = (roles: string | string[]) => {
    // Super user has all roles automatically
    if (isSuperUser) return true;
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const canAccessAdminPanel = () => {
    return isAdmin;
  };

  const canManageUsers = () => {
    return isAdmin;
  };

  const canAssignTickets = () => {
    return isAdmin || hasRole(['approver', 'technician']);
  };

  const canViewAllTickets = () => {
    return isAdmin || hasRole(['approver', 'technician']);
  };

  const canManageSystem = () => {
    return isAdmin;
  };

  const canCreateTickets = () => {
    return true; // All authenticated users can create tickets
  };

  const canEditTickets = () => {
    return isAdmin || hasRole(['technician']);
  };

  const canDeleteTickets = () => {
    return isAdmin;
  };

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return {
    user: user || null,
    supabaseUser,
    token: null,
    isAuthenticated,
    isLoading,
    isSuperUser,
    isAdmin,
    hasRole,
    canAccessAdminPanel,
    canManageUsers,
    canAssignTickets,
    canViewAllTickets,
    canManageSystem,
    canCreateTickets,
    canEditTickets,
    canDeleteTickets,
    signIn,
    signUp,
    logout,
    resetPassword,
  };
};
