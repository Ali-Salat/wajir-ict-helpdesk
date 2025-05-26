
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../store/store';
import { initializeAuth } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

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
    user,
    token,
    isAuthenticated,
    isLoading,
    hasRole,
    canAccessAdminPanel,
    canManageUsers,
    canAssignTickets,
    canViewAllTickets,
  };
};
