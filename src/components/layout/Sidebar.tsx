
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
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'Tickets', href: '/tickets', icon: Ticket, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'approver'] },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText, roles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'approver', 'technician', 'requester'] },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/b82dd6de-7a50-48ff-884a-07b73a15eed4.png" 
            alt="Wajir County Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-blue-800">IT Help Desk</h1>
            <p className="text-xs text-gray-600">Wajir County Government</p>
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
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
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
