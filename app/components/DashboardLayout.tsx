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
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}    
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Bar */}
        <TopBar />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb - only show on non-dashboard pages */}
          {!isDashboard && <Breadcrumb />}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;