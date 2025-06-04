
import React from 'react';
import { Bell, User, LogOut, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Header = () => {
  const { user, supabaseUser, isSuperUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        description: 'You have been signed out of your account',
      });
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (supabaseUser?.user_metadata?.full_name) return supabaseUser.user_metadata.full_name;
    if (supabaseUser?.email) return supabaseUser.email.split('@')[0];
    return 'User';
  };

  const getUserRole = () => {
    if (isSuperUser) return 'Super Administrator';
    if (user?.role === 'admin') return 'Administrator';
    if (user?.role === 'approver') return 'Supervisor';
    if (user?.role === 'technician') return 'Technician';
    return 'End User';
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm professional-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider uppercase">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              WAJIR COUNTY GOVERNMENT
            </span>
            <span className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mt-1">
              ICT HELP DESK SYSTEM
            </span>
          </h1>
          {isSuperUser && (
            <Badge variant="destructive" className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600 shadow-lg">
              <Shield className="w-3 h-3 mr-1" />
              SUPER USER
            </Badge>
          )}
          {isAdmin && !isSuperUser && (
            <Badge variant="destructive" className="bg-red-500 text-white shadow-lg">
              <Shield className="w-3 h-3 mr-1" />
              ADMIN
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getUserRole()}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{supabaseUser?.email}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{getUserRole()}</p>
                {user?.department && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.department}</p>
                )}
              </div>
              
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              
              <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
