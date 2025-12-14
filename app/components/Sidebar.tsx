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
          title: 'Penerimaan',
          icon: FaWarehouse,
          href: '/penerimaan'
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
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0F172A] text-slate-300 transition-all duration-300 z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}
      aria-label="Main sidebar"
    >
      <div className="flex flex-col h-full">

        <div className="h-1 bg-gradient-to-r from-[#00A69F] to-[#06B6D4]"></div>

        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0F172A] ring-1 ring-[#00A69F]/20">
              <FaWarehouse className="w-6 h-6 text-[#00A69F]" aria-hidden />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-semibold text-white">Inventory Pro</h1>
                <p className="text-xs text-slate-400">Management</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-2 rounded-md bg-transparent hover:bg-slate-800/40 text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A69F]/30"
          >
            {isCollapsed ? <MdChevronRight className="w-5 h-5" /> : <MdChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar" role="navigation">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx} className="">
              {!isCollapsed && (
                <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">{section.title}</div>
              )}
              <div className="space-y-1 mt-1">
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors duration-150 ${
                        active
                          ? 'bg-transparent text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                      aria-current={active ? 'page' : undefined}
                      title={isCollapsed ? item.title : undefined}
                    >

                      <span className={`inline-block w-1.5 h-8 rounded-r-full mr-1 ${active ? 'bg-[#00A69F]' : 'bg-transparent group-hover:bg-[#00A69F]/30'}`} aria-hidden />

                      <div className={`flex items-center justify-center w-10 h-10 rounded-md ${active ? 'bg-[#00A69F]/10' : 'bg-transparent'} text-slate-200`}>
                        <Icon className={`w-5 h-5 ${active ? 'text-[#00A69F]' : 'text-slate-300 group-hover:text-white'}`} />
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-300'}`}>{item.title}</div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/40 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-[#0F172A] ring-1 ring-[#00A69F]/20 flex items-center justify-center text-white font-semibold">SA</div>
            {!isCollapsed && (
              <div className="flex-1">
                <div className="text-sm font-medium text-white truncate">Super Admin</div>
                <div className="text-xs text-slate-400 truncate">admin@inventory.com</div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }
        `}</style>
      </div>
    </aside>
  );
};

export default Sidebar;