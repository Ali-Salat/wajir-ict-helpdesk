
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
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Wajir County ICT Help Desk
          </h2>
          {isSuperUser && (
            <Badge variant="destructive" className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
              <Shield className="w-3 h-3 mr-1" />
              SUPER USER
            </Badge>
          )}
          {isAdmin && !isSuperUser && (
            <Badge variant="destructive" className="bg-red-500 text-white">
              <Shield className="w-3 h-3 mr-1" />
              ADMIN
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500">{getUserRole()}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-500">{supabaseUser?.email}</p>
                <p className="text-xs text-blue-600 font-medium">{getUserRole()}</p>
                {user?.department && (
                  <p className="text-xs text-gray-500">{user.department}</p>
                )}
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
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
