
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 border-t border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">
              <span className="font-semibold">Wajir County Government</span>
              <span className="mx-2">•</span>
              <span className="text-blue-200">ICT Help Desk System</span>
            </div>
            <div className="text-white text-sm">
              © 2025 Wajir County. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
