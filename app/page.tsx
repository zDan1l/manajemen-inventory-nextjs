import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-pink-300 rounded-full opacity-20"></div>
      <div className="absolute top-1/3 left-10 w-24 h-24 bg-blue-300 rounded-full opacity-20"></div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <h1 className="text-5xl md:text-6xl font-black text-black mb-4 tracking-tight">
              INVENTORY
            </h1>
            <h2 className="text-3xl md:text-4xl font-black text-gray-700">
              MANAGEMENT SYSTEM
            </h2>
            <div className="mt-6 flex gap-2">
              <div className="w-8 h-8 bg-red-400 border-2 border-black"></div>
              <div className="w-8 h-8 bg-yellow-400 border-2 border-black"></div>
              <div className="w-8 h-8 bg-blue-400 border-2 border-black"></div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-yellow-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-1 hover:-rotate-1 transition-transform duration-300">
            <div className="text-black text-lg font-black mb-2 uppercase">Total Users</div>
            <div className="text-black text-4xl font-black">1,234+</div>
            <div className="mt-3 flex gap-1">
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-black"></div>
            </div>
          </div>

          <div className="bg-pink-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 transform -rotate-1 hover:rotate-1 transition-transform duration-300">
            <div className="text-black text-lg font-black mb-2 uppercase">Inventory Items</div>
            <div className="text-black text-4xl font-black">5,678+</div>
            <div className="mt-3 flex gap-1">
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-black"></div>
            </div>
          </div>

          <div className="bg-blue-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-1 hover:-rotate-1 transition-transform duration-300">
            <div className="text-black text-lg font-black mb-2 uppercase">Total Orders</div>
            <div className="text-black text-4xl font-black">892+</div>
            <div className="mt-3 flex gap-1">
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-black"></div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* User Management */}
          <Link href="/user" className="group">
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-400 border-3 border-black flex items-center justify-center">
                  <span className="text-black text-xl font-black">👥</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-black text-xl font-black uppercase">User</h3>
                  <p className="text-gray-700 font-bold">Management</p>
                </div>
              </div>
              <div className="w-full h-3 bg-red-400 border-2 border-black"></div>
            </div>
          </Link>

          {/* Role Management */}
          <Link href="/role" className="group">
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-400 border-3 border-black flex items-center justify-center">
                  <span className="text-black text-xl font-black">🛡️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-black text-xl font-black uppercase">Role</h3>
                  <p className="text-gray-700 font-bold">Management</p>
                </div>
              </div>
              <div className="w-full h-3 bg-green-400 border-2 border-black"></div>
            </div>
          </Link>

          {/* Role Management */}
          <Link href="/satuan" className="group">
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-400 border-3 border-black flex items-center justify-center">
                  <span className="text-black text-xl font-black">📦</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-black text-xl font-black uppercase">Satuan</h3>
                  <p className="text-gray-700 font-bold">Management</p>
                </div>
              </div>
              <div className="w-full h-3 bg-orange-400 border-2 border-black"></div>
            </div>
          </Link>

          {/* Inventory */}
          <Link href="/barang" className="group">
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-400 border-3 border-black flex items-center justify-center">
                  <span className="text-black text-xl font-black">🛍️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-black text-xl font-black uppercase">Barang</h3>
                  <p className="text-gray-700 font-bold">Control</p>
                </div>
              </div>
              <div className="w-full h-3 bg-yellow-400 border-2 border-black"></div>
            </div>
          </Link>

          {/* vendor */}
          <Link href="/vendor" className="group">
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-400 border-3 border-black flex items-center justify-center">
                  <span className="text-black text-xl font-black">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-black text-xl font-black uppercase">Vendor</h3>
                  <p className="text-gray-700 font-bold">Outsourcing</p>
                </div>
              </div>
              <div className="w-full h-3 bg-purple-400 border-2 border-black"></div>
            </div>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-orange-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-400 border-2 border-black flex items-center justify-center">
                <span className="text-black text-sm font-black">⚡</span>
              </div>
              <h4 className="text-black text-lg font-black uppercase">Real-time Tracking</h4>
            </div>
            <p className="text-gray-800 font-medium">Monitor inventory levels with instant updates and notifications.</p>
          </div>

          <div className="bg-blue-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 transform -rotate-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-400 border-2 border-black flex items-center justify-center">
                <span className="text-black text-sm font-black">🔒</span>
              </div>
              <h4 className="text-black text-lg font-black uppercase">Secure Access</h4>
            </div>
            <p className="text-gray-800 font-medium">Role-based access control ensures data security and authorization.</p>
          </div>

          <div className="bg-pink-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-pink-400 border-2 border-black flex items-center justify-center">
                <span className="text-black text-sm font-black">📈</span>
              </div>
              <h4 className="text-black text-lg font-black uppercase">Advanced Analytics</h4>
            </div>
            <p className="text-gray-800 font-medium">Get insights with comprehensive reports and data visualization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}