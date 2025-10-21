'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '🏠',
      href: '/',
      color: 'bg-blue-400'
    },
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
    },
    {
      title: 'Pengadaan',
      icon: '📠',
      href: '/pengadaan',
      color: 'bg-pink-400'
    },
    {
      title: 'Penerimaan',
      icon: '📥',
      href: '/penerimaan',
      color: 'bg-pink-400'
    },
    {
      title: 'Retur',
      icon: '📤',
      href: '/retur',
      color: 'bg-pink-400'
    },
    {
      title: 'Penjualan',
      icon: '🛒',
      href: '/penjualan',
      color: 'bg-pink-400'
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r-2 border-black flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b-2 border-black flex-shrink-0">
        <div className="bg-yellow-300 border-2 border-black p-4">
          <h1 className="text-xl font-bold text-black uppercase tracking-tight">
            Inventory
          </h1>
          <p className="text-sm font-medium text-gray-700">Super Admin</p>
        </div>
      </div>

      {/* Admin Info */}
      <div className="p-6 border-b-2 border-black flex-shrink-0">
        <div className="bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-300 border-2 border-black flex items-center justify-center">
              <span className="text-lg">👨‍💼</span>
            </div>
            <div>
              <p className="font-bold text-black text-sm">Admin</p>
              <p className="font-medium text-gray-600 text-xs">Controller</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={index}>
                <Link href={item.href}>
                  <div className={`
                    p-3 border-2 border-black
                    ${isActive 
                      ? `${item.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]` 
                      : 'bg-white'
                    }
                  `}>
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 border border-black flex items-center justify-center
                        ${isActive ? 'bg-white' : item.color}
                      `}>
                        <span className="text-sm">{item.icon}</span>
                      </div>
                      <span className={`
                        font-bold text-sm uppercase
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
      </nav>

      {/* Footer - Always at bottom */}
      <div className="p-4 flex-shrink-0">
        <div className="bg-green-200 border-2 border-black p-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-400 border border-black flex items-center justify-center">
              <span className="text-xs">●</span>
            </div>
            <p className="text-xs font-bold text-black uppercase">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;