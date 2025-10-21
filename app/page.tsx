export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="bg-yellow-300 border-2 border-black p-6">
          <h1 className="text-3xl font-bold text-black mb-2 uppercase">
            Dashboard Overview
          </h1>
          <p className="text-base font-medium text-gray-700">Super Admin Control Panel</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Total Users</div>
          <div className="text-black text-2xl font-bold">1,234</div>
        </div>

        <div className="bg-pink-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Inventory Items</div>
          <div className="text-black text-2xl font-bold">5,678</div>
        </div>

        <div className="bg-blue-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Total Orders</div>
          <div className="text-black text-2xl font-bold">892</div>
        </div>

        <div className="bg-green-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Revenue</div>
          <div className="text-black text-2xl font-bold">$125K</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="bg-white border-2 border-black p-6">
          <h3 className="text-lg font-bold text-black mb-4 uppercase">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-100 border-2 border-black p-3 cursor-pointer">
              <div className="text-center">
                <div className="w-8 h-8 bg-red-300 border border-black mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm">➕</span>
                </div>
                <p className="font-bold text-xs uppercase">Add User</p>
              </div>
            </div>
            
            <div className="bg-yellow-100 border-2 border-black p-3 cursor-pointer">
              <div className="text-center">
                <div className="w-8 h-8 bg-yellow-300 border border-black mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm">📦</span>
                </div>
                <p className="font-bold text-xs uppercase">New Item</p>
              </div>
            </div>
            
            <div className="bg-blue-100 border-2 border-black p-3 cursor-pointer">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-300 border border-black mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm">📊</span>
                </div>
                <p className="font-bold text-xs uppercase">View Report</p>
              </div>
            </div>
            
            <div className="bg-green-100 border-2 border-black p-3 cursor-pointer">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-300 border border-black mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm">⚙️</span>
                </div>
                <p className="font-bold text-xs uppercase">Settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="text-xl font-black text-black mb-4 uppercase">Recent Activity</h3>
          <div className="space-y-3">
            <div className="bg-gray-100 border-2 border-black p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-400 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="text-xs font-black">�</span>
                </div>
                <div>
                  <p className="font-bold text-sm">New user registered</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 border-2 border-black p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="text-xs font-black">�</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Inventory updated</p>
                  <p className="text-xs text-gray-600">15 minutes ago</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 border-2 border-black p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-400 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="text-xs font-black">💰</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Sale completed</p>
                  <p className="text-xs text-gray-600">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white border-2 border-black p-4">
          <h3 className="text-base font-bold text-black mb-3 uppercase">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Database</span>
              <div className="bg-green-300 border border-black px-2 py-1">
                <span className="text-xs font-bold">ONLINE</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">API Server</span>
              <div className="bg-green-300 border border-black px-2 py-1">
                <span className="text-xs font-bold">ONLINE</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Backup System</span>
              <div className="bg-yellow-300 border border-black px-2 py-1">
                <span className="text-xs font-bold">RUNNING</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Security</span>
              <div className="bg-green-300 border border-black px-2 py-1">
                <span className="text-xs font-bold">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}