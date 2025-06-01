
import { useSupabaseAuth } from './useSupabaseAuth';
import { useSupabaseUsers } from './useSupabaseUsers';

export const useAuth = () => {
  const { user: supabaseUser, isAuthenticated, isLoading } = useSupabaseAuth();
  const { users } = useSupabaseUsers();

  // Find the user in our users table to get role and other details
  const user = users.find(u => u.id === supabaseUser?.id);

  // Check if user is super user
  const isSuperUser = user?.email === 'ellisalat@gmail.com';

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    // Super user has all roles
    if (isSuperUser) return true;
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
    return isSuperUser;
  };

  return {
    user: user || null,
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
  };
};
