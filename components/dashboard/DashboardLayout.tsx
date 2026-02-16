"use client";

import { ReactNode, useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './DashboardSidebar';
import {
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Button from '../shared/button';

interface DashboardLayoutProps {
  children: ReactNode;
  student?: { matricNumber: string; name: string };
}

export default function DashboardLayout({ children, student = { matricNumber: 'CSC2023001', name: 'John Doe' } }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check token and logout if not present
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("faith");
    
    if (!token) {
      router.replace("/auth/login");
    }
    }, [router]);

console.log("joy");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-[#FFFFFF] shadow-sm border-b border-gray-200 px-4 p-3 sm:p-4 flex items-center justify-between md:pl-4 fixed top-0 left-0 right-0 z-50">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          {<Bars3Icon className="w-8 h-8 text-[#8B0000]" />}
        </button>

        {/* Welcome */}
        <div className="flex-1 md:ml-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-end md:text-start">
            Welcome back, {student.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#660000] text-end md:text-start">Matric: {student.matricNumber}</p>
        </div>

        {/* Desktop logout */}
        <div>
          <Button
            onClick={() => router.push('/auth/login')}
            className="hidden md:flex items-center gap-2 px-3 text-sm"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Logout
          </Button>
        </div>

      </header>

      <div className="flex pt-22">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className="flex-1 p-6 md:ml-0 overflow-auto md:pl-70">{children}</main>
      </div>
    </div>
  );
}