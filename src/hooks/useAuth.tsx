
import { useSupabaseAuth } from './useSupabaseAuth';
import { useSupabaseUsers } from './useSupabaseUsers';

export const useAuth = () => {
  const { user: supabaseUser, isAuthenticated, isLoading } = useSupabaseAuth();
  const { users } = useSupabaseUsers();

  // Find the user in our users table to get role and other details
  const user = users.find(u => u.id === supabaseUser?.id);

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const canAccessAdminPanel = () => {
    return hasRole(['admin']);
  };

  const canManageUsers = () => {
    return hasRole(['admin']);
  };

  const canAssignTickets = () => {
    return hasRole(['admin', 'approver']);
  };

  const canViewAllTickets = () => {
    return hasRole(['admin', 'approver', 'technician']);
  };

  return {
    user: user || null,
    token: null,
    isAuthenticated,
    isLoading,
    hasRole,
    canAccessAdminPanel,
    canManageUsers,
    canAssignTickets,
    canViewAllTickets,
  };
};
