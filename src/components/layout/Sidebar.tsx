
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Home,
  Ticket,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user, hasRole } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard', roles: ['admin', 'approver', 'technician', 'requester'] },
    { to: '/tickets', icon: Ticket, label: 'Tickets', roles: ['admin', 'approver', 'technician', 'requester'] },
    { to: '/users', icon: Users, label: 'Users', roles: ['admin'] },
    { to: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base', roles: ['admin', 'approver', 'technician', 'requester'] },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'approver'] },
    { to: '/audit-logs', icon: FileText, label: 'Audit Logs', roles: ['admin'] },
    { to: '/settings', icon: Settings, label: 'Settings', roles: ['admin', 'approver', 'technician', 'requester'] },
  ];

  const filteredNavItems = navItems.filter(item => hasRole(item.roles));

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Wajir Help Desk</h1>
        <p className="text-sm text-gray-600">{user?.department || 'County Government'}</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
