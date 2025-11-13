'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  MdDashboard, 
  MdPeople, 
  MdSecurity, 
  MdScale,
  MdStore,
  MdTrendingUp,
  MdShoppingCart,
  MdKeyboardReturn,
  MdPointOfSale,
  MdBarChart,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';
import { FaBox, FaWarehouse } from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Dashboard',
          icon: MdDashboard,
          href: '/'
        }
      ]
    },
    {
      title: 'Data Master',
      items: [
        {
          title: 'User Management',
          icon: MdPeople,
          href: '/user'
        },
        {
          title: 'Role Management',
          icon: MdSecurity,
          href: '/role'
        },
        {
          title: 'Satuan',
          icon: MdScale,
          href: '/satuan'
        },
        {
          title: 'Barang',
          icon: FaBox,
          href: '/barang'
        },
        {
          title: 'Vendor',
          icon: MdStore,
          href: '/vendor'
        },
        {
          title: 'Margin',
          icon: MdTrendingUp,
          href: '/margin'
        }
      ]
    },
    {
      title: 'Transaksi',
      items: [
        {
          title: 'Pengadaan',
          icon: MdShoppingCart,
          href: '/pengadaan'
        },
        {
          title: 'Retur',
          icon: MdKeyboardReturn,
          href: '/retur'
        },
        {
          title: 'Penjualan',
          icon: MdPointOfSale,
          href: '/penjualan'
        }
      ]
    },
    {
      title: 'Inventory',
      items: [
        {
          title: 'Kartu Stok',
          icon: MdBarChart,
          href: '/kartu-stok'
        }
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <FaWarehouse className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-xl opacity-20 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-base font-bold text-white tracking-tight">Inventory Pro</h1>
                  <p className="text-xs text-slate-400">Management System</p>
                </div>
              </div>
            )}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110">
              {isCollapsed ? <MdChevronRight className="w-5 h-5" /> : <MdChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {menuSections.map((section, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-gradient-to-r from-slate-600 to-transparent rounded"></span>
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link key={itemIndex} href={item.href} className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg shadow-white/50"></div>}
                      <div className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${active ? 'bg-white/20 shadow-inner' : 'bg-slate-800/50 group-hover:bg-slate-700/50'}`}>
                        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                        {active && <div className="absolute inset-0 bg-white/20 rounded-lg blur-md"></div>}
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{item.title}</span>
                        </div>
                      )}
                      {!active && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-200"></div>}
                      {isCollapsed && (
                        <div className="absolute left-full ml-6 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                          {item.title}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-sm font-bold text-white">SA</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Super Admin</p>
                <p className="text-xs text-slate-400 truncate">admin@inventory.com</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
