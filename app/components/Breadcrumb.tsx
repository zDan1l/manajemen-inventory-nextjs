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
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 mb-6">
      <nav className="flex items-center space-x-2">
        <Link href="/">
          <div className="bg-blue-300 border-2 border-black px-3 py-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
            <span className="font-black text-sm uppercase">🏠 Dashboard</span>
          </div>
        </Link>
        
        {pathArray.map((path, index) => {
          const href = '/' + pathArray.slice(0, index + 1).join('/');
          const isLast = index === pathArray.length - 1;
          const displayName = breadcrumbMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
          
          return (
            <div key={href} className="flex items-center space-x-2">
              <span className="font-black text-lg">→</span>
              {isLast ? (
                <div className="bg-yellow-300 border-2 border-black px-3 py-1">
                  <span className="font-black text-sm uppercase">{displayName}</span>
                </div>
              ) : (
                <Link href={href}>
                  <div className="bg-gray-200 border-2 border-black px-3 py-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200">
                    <span className="font-black text-sm uppercase">{displayName}</span>
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