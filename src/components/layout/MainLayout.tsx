
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>
        <footer className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-t border-slate-700 dark:border-slate-600 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">
              <span className="font-bold tracking-wide">WAJIR COUNTY GOVERNMENT</span>
              <span className="mx-2">•</span>
              <span className="text-blue-200 dark:text-blue-300 font-medium">ICT Help Desk System</span>
            </div>
            <div className="text-white text-sm font-medium">
              © 2025 Wajir County Government. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
