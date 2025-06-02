
import { useSupabaseAuth } from './useSupabaseAuth';
import { useSupabaseUsers } from './useSupabaseUsers';

export const useAuth = () => {
  const { user: supabaseUser, isAuthenticated, isLoading } = useSupabaseAuth();
  const { users } = useSupabaseUsers();

  // Find the user in our users table to get role and other details
  const user = users.find(u => u.id === supabaseUser?.id);

  // Check if user is super user - ellisalat@gmail.com has all privileges
  const isSuperUser = supabaseUser?.email === 'ellisalat@gmail.com';

  // Check if user is admin - includes super user and specific admin emails
  const isAdmin = isSuperUser || supabaseUser?.email === 'mshahid@wajir.go.ke';

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
  };
};
