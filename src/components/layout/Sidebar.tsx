
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Settings 
} from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Sidebar = () => {
  const { user } = useSupabaseAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen shadow-sm">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/78d372ae-dd0e-4d1d-a648-9cfad21eba95.png" 
            alt="Wajir County Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-wajir-green">IT Help Desk</h1>
            <p className="text-xs text-muted-foreground">Wajir County Government</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 pb-4 mt-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
