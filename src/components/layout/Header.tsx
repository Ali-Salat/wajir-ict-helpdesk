
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, User, Crown } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useAuth } from '@/hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useSupabaseAuth();
  const { isSuperUser } = useAuth();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: 'Logout Error',
          description: 'An error occurred during logout',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Logged out successfully',
          description: 'See you soon!',
        });
        navigate('/auth');
      }
    } catch (error) {
      console.error('Logout exception:', error);
      toast({
        title: 'Logout Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const getUserDisplayName = () => {
    if (user?.email === 'ellisalat@gmail.com') {
      return 'Ali Salat';
    }
    if (user?.email === 'yussuf@wajir.go.ke') {
      return 'Yussuf Abdullahi';
    }
    if (user?.email === 'abdille@wajir.go.ke') {
      return 'Abdille Osman';
    }
    if (user?.email === 'mabdisalaam@wajir.go.ke') {
      return 'Mohamed Abdisalaam';
    }
    if (user?.email === 'mshahid@wajir.go.ke') {
      return 'Mohamed Shahid';
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserRole = () => {
    if (user?.email === 'ellisalat@gmail.com') return 'System Super Administrator';
    if (user?.email === 'mshahid@wajir.go.ke') return 'System Administrator';
    if (user?.email === 'yussuf@wajir.go.ke') return 'IT Technician';
    if (user?.email === 'mabdisalaam@wajir.go.ke') return 'IT Technician';
    if (user?.email === 'abdille@wajir.go.ke') return 'IT Supervisor';
    if (user?.email?.includes('admin')) return 'System Administrator';
    if (user?.email?.includes('tech')) return 'IT Technician';
    if (user?.email?.includes('supervisor')) return 'IT Supervisor';
    return 'End User';
  };

  const getProfileImage = () => {
    if (user?.email === 'ellisalat@gmail.com') {
      return '/lovable-uploads/ellis-profile.jpg';
    }
    return null;
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 border-b border-slate-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-white">
                Welcome, {getUserDisplayName()}
              </h2>
              {isSuperUser && (
                <div className="flex items-center space-x-1">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400">
                    SUPER USER
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 text-sm text-blue-100">
              <span className="font-medium text-yellow-200">{getUserRole()}</span>
              <span className="hidden md:inline">•</span>
              <span className="font-bold">WAJIR COUNTY GOVERNMENT</span>
              <span className="hidden md:inline">•</span>
              <span className="text-blue-200">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10 border border-white/20">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-3 text-white hover:bg-white/10 border border-white/20 px-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md overflow-hidden border-2 border-white/30">
                  {getProfileImage() ? (
                    <img 
                      src={getProfileImage()} 
                      alt={getUserDisplayName()}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{getUserDisplayName()}</div>
                  <div className="text-xs text-blue-200">{getUserRole()}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
