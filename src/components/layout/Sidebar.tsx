
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Settings,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { user, isSuperUser, canManageUsers, canViewAllTickets } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'Tickets', href: '/tickets', icon: Ticket, show: true },
    { name: 'Users', href: '/users', icon: Users, show: canManageUsers() },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen, show: true },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, show: canViewAllTickets() },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText, show: canViewAllTickets() },
    { name: 'Settings', href: '/settings', icon: Settings, show: true },
  ].filter(item => item.show);

  const wajirLinks = [
    { name: 'Wajir County Website', url: 'https://wajir.go.ke', external: true },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 border-r border-blue-700 h-screen shadow-lg">
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-2">
            <img 
              src="/lovable-uploads/0235ab6a-0d67-467b-92bc-7a11d4edf9ec.png" 
              alt="Wajir County Coat of Arms"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "https://wajir.go.ke/wp-content/uploads/2021/03/coat-of-arms.png";
              }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">ICT Help Desk</h1>
            <p className="text-xs text-blue-200 font-semibold">
              WAJIR COUNTY GOVERNMENT
            </p>
            {isSuperUser && (
              <p className="text-xs text-yellow-300 font-bold">SUPER USER</p>
            )}
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
                      ? 'bg-blue-600 text-white shadow-md border border-blue-500'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-4 border-t border-blue-700">
          <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider px-4 mb-3">
            County Resources
          </h3>
          <ul className="space-y-1">
            {wajirLinks.map((link) => (
              <li key={link.name}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-blue-100 hover:text-white hover:bg-blue-700 text-sm px-4 py-2"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {link.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {user && (
          <div className="mt-8 pt-4 border-t border-blue-700 px-4">
            <div className="text-xs text-blue-300">
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-blue-200">{user.email}</p>
              <p className="text-blue-300 capitalize">{user.role}</p>
              {user.department && (
                <p className="text-blue-300">{user.department}</p>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
