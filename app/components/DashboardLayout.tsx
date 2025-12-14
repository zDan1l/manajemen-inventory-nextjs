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
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Sidebar />

      <div className="ml-64 transition-all duration-300">

        <TopBar />

        <main className="p-6">

          {!isDashboard && <Breadcrumb />}

          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;