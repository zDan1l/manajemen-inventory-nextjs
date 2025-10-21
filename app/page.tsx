'use client';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalUsers: number;
  totalBarangs: number;
  totalVendors: number;
  totalMargins: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBarangs: 0,
    totalVendors: 0,
    totalMargins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch data from all endpoints
      const [usersRes, barangsRes, vendorsRes, marginsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/barangs'),
        fetch('/api/vendors'),
        fetch('/api/margins')
      ]);

      // Parse all responses
      const [usersData, barangsData, vendorsData, marginsData] = await Promise.all([
        usersRes.json(),
        barangsRes.json(),
        vendorsRes.json(),
        marginsRes.json()
      ]);

      // Update stats with actual counts
      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalBarangs: Array.isArray(barangsData) ? barangsData.length : 0,
        totalVendors: Array.isArray(vendorsData) ? vendorsData.length : 0,
        totalMargins: Array.isArray(marginsData) ? marginsData.length : 0
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="bg-yellow-300 border-2 border-black p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2 uppercase">
                Dashboard Overview
              </h1>
              <p className="text-base font-medium text-gray-700">Super Admin Control Panel</p>
            </div>
            <button
              onClick={fetchDashboardStats}
              disabled={loading}
              className="px-4 py-2 bg-black border-2 border-black text-white font-bold uppercase text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-200 border-2 border-black p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-red-800 font-medium">{error}</span>
            <button
              onClick={fetchDashboardStats}
              className="px-3 py-1 bg-red-500 border border-black text-white font-bold text-xs uppercase"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Total Users</div>
          <div className="text-black text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
            ) : error ? (
              <span className="text-red-600 text-sm">Error</span>
            ) : (
              stats.totalUsers.toLocaleString()
            )}
          </div>
        </div>

        <div className="bg-pink-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Total Barang</div>
          <div className="text-black text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
            ) : error ? (
              <span className="text-red-600 text-sm">Error</span>
            ) : (
              stats.totalBarangs.toLocaleString()
            )}
          </div>
        </div>

        <div className="bg-blue-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Total Vendors</div>
          <div className="text-black text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
            ) : error ? (
              <span className="text-red-600 text-sm">Error</span>
            ) : (
              stats.totalVendors.toLocaleString()
            )}
          </div>
        </div>

        <div className="bg-green-200 border-2 border-black p-4">
          <div className="text-black text-sm font-bold mb-1 uppercase">Total Margins</div>
          <div className="text-black text-2xl font-bold">
            {loading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
            ) : error ? (
              <span className="text-red-600 text-sm">Error</span>
            ) : (
              stats.totalMargins.toLocaleString()
            )}
          </div>
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
    </div>
  );
}