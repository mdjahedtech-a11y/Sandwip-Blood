import React from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-24 md:pb-0">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <BottomNav />
      <Toaster position="top-center" />
      <footer className="hidden md:block bg-white border-t border-gray-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sandwip Blood Donor BD. All rights reserved.</p>
          <p className="mt-1">Saving lives, one drop at a time.</p>
          <p className="mt-2 text-xs">
            <a href="/admin" className="text-gray-400 hover:text-gray-600">Admin Access</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
