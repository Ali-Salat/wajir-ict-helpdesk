
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-800 font-medium">Loading ICT Help Desk...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
          
          {/* Professional Footer */}
          <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 py-4">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/37b18ab6-301e-4fea-860d-a70e3041499a.png" 
                        alt="Wajir County Logo"
                        className="w-4 h-4 object-contain filter brightness-0 invert"
                      />
                    </div>
                    <span className="text-sm font-medium">Wajir County ICT Help Desk</span>
                  </div>
                  <span className="text-xs">•</span>
                  <span className="text-xs">Professional IT Support Platform</span>
                </div>
                
                <div className="flex items-center space-x-6 text-xs">
                  <span>© 2024 Wajir County Government</span>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a>
                  <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
