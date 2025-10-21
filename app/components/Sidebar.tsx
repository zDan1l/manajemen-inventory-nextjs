'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Dashboard',
          icon: '🏠',
          href: '/',
          color: 'bg-blue-400'
        }
      ]
    },
    {
      title: 'Data Master',
      items: [
        {
          title: 'User Management',
          icon: '👥',
          href: '/user',
          color: 'bg-red-400'
        },
        {
          title: 'Role Management',
          icon: '🛡️',
          href: '/role',
          color: 'bg-green-400'
        },
        {
          title: 'Satuan',
          icon: '📦',
          href: '/satuan',
          color: 'bg-orange-400'
        },
        {
          title: 'Barang',
          icon: '🛍️',
          href: '/barang',
          color: 'bg-yellow-400'
        },
        {
          title: 'Vendor',
          icon: '🏪',
          href: '/vendor',
          color: 'bg-purple-400'
        },
        {
          title: 'Margin',
          icon: '📈',
          href: '/margin',
          color: 'bg-pink-400'
        }
      ]
    },
    {
      title: 'Transaksi',
      items: [
        {
          title: 'Pengadaan',
          icon: '�',
          href: '/pengadaan',
          color: 'bg-indigo-400'
        },
        {
          title: 'Penerimaan',
          icon: '📥',
          href: '/penerimaan',
          color: 'bg-cyan-400'
        },
        {
          title: 'Retur',
          icon: '📤',
          href: '/retur',
          color: 'bg-gray-400'
        },
        {
          title: 'Penjualan',
          icon: '🛒',
          href: '/penjualan',
          color: 'bg-emerald-400'
        }
      ]
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r-2 border-black flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b-2 border-black flex-shrink-0">
        <div className="bg-yellow-300 border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-xl font-bold text-black uppercase tracking-tight">
            Sales CRUD
          </h1>
          <p className="text-sm font-medium text-gray-700 mt-1">Management System</p>
        </div>
      </div>

      {/* Admin Info */}
      <div className="p-6 border-b-2 border-black flex-shrink-0">
        <div className="bg-gray-50 border-2 border-gray-300 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-lg">👨‍💼</span>
            </div>
            <div>
              <p className="font-bold text-black text-sm">Super Admin</p>
              <p className="font-medium text-gray-600 text-xs uppercase tracking-wide">System Controller</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Section Header */}
              <div className="mb-3">
                <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider px-2">
                  {section.title}
                </h3>
                <div className="mt-1 h-px bg-gray-300"></div>
              </div>
              
              {/* Section Items */}
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={itemIndex}>
                      <Link href={item.href}>
                        <div className={`
                          p-3 border-2 border-black transition-all duration-200
                          ${isActive 
                            ? `${item.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform translate-x-1` 
                            : 'bg-white hover:bg-gray-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          }
                        `}>
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-8 h-8 border border-black flex items-center justify-center transition-colors duration-200
                              ${isActive ? 'bg-white' : item.color}
                            `}>
                              <span className="text-sm">{item.icon}</span>
                            </div>
                            <span className={`
                              font-bold text-sm uppercase tracking-tight
                              ${isActive ? 'text-black' : 'text-gray-700'}
                            `}>
                              {item.title}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer - Always at bottom */}
      <div className="p-4 flex-shrink-0 border-t-2 border-black">
        <div className="bg-green-200 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-400 border border-black flex items-center justify-center">
                <span className="text-xs">●</span>
              </div>
              <p className="text-xs font-bold text-black uppercase">System Online</p>
            </div>
            <div className="text-xs font-medium text-gray-600">
              v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;