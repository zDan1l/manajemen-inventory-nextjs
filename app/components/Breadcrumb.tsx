'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathArray = pathname.split('/').filter(path => path);

  const breadcrumbMap: { [key: string]: string } = {
    user: 'User Management',
    role: 'Role Management',
    satuan: 'Satuan Management',
    barang: 'Barang Management',
    vendor: 'Vendor Management',
    margin: 'Margin Management',
    add: 'Add New',
    edit: 'Edit'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
      <nav className="flex items-center space-x-2 flex-wrap">
        <Link href="/">
          <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] px-4 py-1.5 rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200">
            <span className="font-semibold text-sm text-white flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </span>
          </div>
        </Link>
        
        {pathArray.map((path, index) => {
          const href = '/' + pathArray.slice(0, index + 1).join('/');
          const isLast = index === pathArray.length - 1;
          const displayName = breadcrumbMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
          
          return (
            <div key={href} className="flex items-center space-x-2">
              <span className="text-gray-400 font-medium">/</span>
              {isLast ? (
                <div className="bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 px-4 py-1.5 rounded-lg">
                  <span className="font-semibold text-sm text-gray-800">{displayName}</span>
                </div>
              ) : (
                <Link href={href}>
                  <div className="bg-gray-100 px-4 py-1.5 rounded-lg hover:bg-gray-200 hover:shadow-sm transition-all duration-200">
                    <span className="font-medium text-sm text-gray-700">{displayName}</span>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;