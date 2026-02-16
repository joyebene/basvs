"use client";


import { usePathname, useRouter } from 'next/navigation';
import {
  XMarkIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: HomeIcon,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: CheckCircleIcon,
    label: 'Cast Your Vote',
    href: '/vote',
  },
  {
    icon: ChartBarIcon,
    label: 'View Results',
    href: '/results',
  },
  {
    icon: UserIcon,
    label: 'Profile',
    href: '/profile',
  },
];

export default function DashboardSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 sm:z-10 w-64 bg-[#FFFFFF] shadow-lg transform min-h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          border-r border-gray-200
          flex flex-col
        `}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            {<XMarkIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 md:pt-28 pb-8 flex flex-col">
          <ul className="space-y-2 pb-20">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => {
                      router.push(item.href);
                      onClose();
                    }}
                    className={`
                      flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors duration-200
                      ${isActive
                        ? 'bg-[#f4ebeb] text-[#660000] border border-[#8c5d5d]'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-[#8B0000]' : 'text-gray-400'}`} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Logout at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200 h-full flex flex-col justify-end">
            <button
              onClick={() => router.push('/auth/login')}
              className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-500" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}