
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
import { Bell, LogOut, User } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useSupabaseAuth();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
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
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm wajir-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-2">
            <img 
              src="/lovable-uploads/fc3c48c1-3ac9-4c40-b09b-49e47e5b91c7.png" 
              alt="Wajir County Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-primary-foreground">
              Welcome, {getUserDisplayName()}
            </h2>
            <p className="text-sm text-primary-foreground/80 font-bold">
              <span className="font-extrabold">WAJIR COUNTY GOVERNMENT</span> • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button variant="ghost" size="sm" className="relative text-primary-foreground hover:bg-primary-foreground/10">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-primary-foreground hover:bg-primary-foreground/10">
                <div className="w-6 h-6 bg-wajir-green rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{getUserDisplayName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile
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
