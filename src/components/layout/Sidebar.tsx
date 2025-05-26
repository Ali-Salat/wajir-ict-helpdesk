
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
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { hasRole } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'Tickets', href: '/tickets', icon: Ticket, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'approver'] },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText, roles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'approver', 'technician', 'requester'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles as string[])
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">Wajir Help Desk</h1>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
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
