'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Breadcrumb from './Breadcrumb';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const isDashboard = pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed position */}    
      <Sidebar />
      
      {/* Main Content Area - With left margin for sidebar */}
      <div className="ml-64 transition-all duration-300">
        {/* Top Bar */}
        <TopBar />
        
        {/* Page Content */}
        <main className="p-6">
          {/* Breadcrumb - only show on non-dashboard pages */}
          {!isDashboard && <Breadcrumb />}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;