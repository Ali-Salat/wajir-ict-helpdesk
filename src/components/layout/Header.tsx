
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
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-800 dark:via-blue-800 dark:to-indigo-800 border-b border-slate-700 dark:border-slate-600 px-6 py-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                WAJIR COUNTY GOVERNMENT
              </span>
            </h1>
            <span className="text-lg font-bold text-blue-200 dark:text-blue-300 mt-1 tracking-wide">
              ICT HELP DESK SYSTEM
            </span>
          </div>
          {isSuperUser && (
            <Badge variant="destructive" className="bg-yellow-600 text-yellow-100 hover:bg-yellow-700 shadow-lg border border-yellow-500">
              <Shield className="w-3 h-3 mr-1" />
              SUPER USER
            </Badge>
          )}
          {isAdmin && !isSuperUser && (
            <Badge variant="destructive" className="bg-red-600 text-red-100 hover:bg-red-700 shadow-lg border border-red-500">
              <Shield className="w-3 h-3 mr-1" />
              ADMIN
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="relative">
            <div className="p-2 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
              <Bell className="h-5 w-5 text-white drop-shadow-sm" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse font-semibold">
                3
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10 dark:hover:bg-white/5 transition-all border border-white/20 dark:border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-white drop-shadow-sm">{getUserDisplayName()}</p>
                  <p className="text-xs text-blue-200 dark:text-blue-300">{getUserRole()}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{supabaseUser?.email}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{getUserRole()}</p>
                {user?.department && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.department}</p>
                )}
              </div>
              
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              
              <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
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
