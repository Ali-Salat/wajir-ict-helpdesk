
import { useSupabaseAuth } from './useSupabaseAuth';
import { useSupabaseUsers } from './useSupabaseUsers';

export const useAuth = () => {
  const { user: supabaseUser, isAuthenticated, isLoading } = useSupabaseAuth();
  const { users } = useSupabaseUsers();

  // Find the user in our users table to get role and other details
  const user = users.find(u => u.id === supabaseUser?.id);

  // Check if user is super user - ellisalat@gmail.com has all privileges
  const isSuperUser = supabaseUser?.email === 'ellisalat@gmail.com';

  const hasRole = (roles: string | string[]) => {
    // Super user has all roles automatically
    if (isSuperUser) return true;
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const canAccessAdminPanel = () => {
    return isSuperUser || hasRole(['admin']);
  };

  const canManageUsers = () => {
    return isSuperUser || hasRole(['admin']);
  };

  const canAssignTickets = () => {
    return isSuperUser || hasRole(['admin', 'approver']);
  };

  const canViewAllTickets = () => {
    return isSuperUser || hasRole(['admin', 'approver', 'technician']);
  };

  const canManageSystem = () => {
    return isSuperUser || hasRole(['admin']);
  };

  const canCreateTickets = () => {
    return true; // All authenticated users can create tickets
  };

  const canEditTickets = () => {
    return isSuperUser || hasRole(['admin', 'technician']);
  };

  const canDeleteTickets = () => {
    return isSuperUser || hasRole(['admin']);
  };

  return {
    user: user || null,
    supabaseUser,
    token: null,
    isAuthenticated,
    isLoading,
    isSuperUser,
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
