
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
    { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'التذاكر', href: '/tickets', icon: Ticket, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'المستخدمون', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'قاعدة المعرفة', href: '/knowledge-base', icon: BookOpen, roles: ['admin', 'approver', 'technician', 'requester'] },
    { name: 'التحليلات', href: '/analytics', icon: BarChart3, roles: ['admin', 'approver'] },
    { name: 'سجل التدقيق', href: '/audit-logs', icon: FileText, roles: ['admin'] },
    { name: 'الإعدادات', href: '/settings', icon: Settings, roles: ['admin', 'approver', 'technician', 'requester'] },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/6e5b8a89-5ba8-4c1a-a94b-e1ae5b8b7c45.png" 
            alt="شعار مقاطعة واجير"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-blue-800">مكتب المساعدة التقنية</h1>
            <p className="text-xs text-gray-600">حكومة مقاطعة واجير</p>
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
                <item.icon className="ml-3 h-5 w-5" />
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
