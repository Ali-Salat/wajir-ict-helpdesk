
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
          
          {/* Enhanced Professional Footer */}
          <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-t border-slate-700 text-slate-300 py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo and Description */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg p-2">
                      <img 
                        src="/lovable-uploads/37b18ab6-301e-4fea-860d-a70e3041499a.png" 
                        alt="Wajir County Logo"
                        className="w-full h-full object-contain filter brightness-0 invert"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Wajir County Government</h3>
                      <p className="text-sm text-blue-200">ICT Help Desk System</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Professional IT support platform designed to streamline technical assistance and enhance service delivery across all county departments with advanced ticket management and real-time support capabilities.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>🌍 Serving Wajir County</span>
                    <span>•</span>
                    <span>⚡ 24/7 System Monitoring</span>
                    <span>•</span>
                    <span>🔒 Secure & Compliant</span>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4 border-b border-slate-700 pb-2">Quick Access</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">📋</span>Submit Ticket</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">📚</span>Knowledge Base</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">📊</span>System Status</a></li>
                    <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="mr-2">⚙️</span>User Settings</a></li>
                  </ul>
                </div>
                
                {/* Support Information */}
                <div>
                  <h4 className="text-white font-semibold mb-4 border-b border-slate-700 pb-2">Support Center</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-center"><span className="mr-2">📧</span>ict@wajir.go.ke</li>
                    <li className="flex items-center"><span className="mr-2">📞</span>+254 xxx xxx xxx</li>
                    <li className="flex items-center"><span className="mr-2">🕒</span>Mon - Fri: 8:00 AM - 5:00 PM</li>
                    <li className="flex items-center"><span className="mr-2">📍</span>County Headquarters</li>
                    <li className="flex items-center"><span className="mr-2">🆘</span>Emergency: 24/7 Available</li>
                  </ul>
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-sm text-slate-500">
                    © 2024 Wajir County Government. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <span>🏛️ Government of Kenya</span>
                    <span>•</span>
                    <span>🔐 ISO 27001 Compliant</span>
                  </div>
                </div>
                
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Privacy Policy</a>
                  <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Terms of Service</a>
                  <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Data Protection</a>
                  <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Accessibility</a>
                </div>
              </div>
              
              {/* System Status Indicator */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 text-xs text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-700/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All Systems Operational</span>
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
