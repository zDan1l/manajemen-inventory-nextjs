'use client';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/app/lib/type';
import { LinkButton } from './components/LinkButton';
import { Alert } from './components/Alert';
import { Card, CardBody } from './components/Card';
import { FaUsers, FaBox, FaStore, FaChartLine, FaUserPlus, FaBoxOpen, FaPlusSquare, FaPercentage, FaArrowUp, FaArrowDown, FaClock, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { MdRefresh, MdTrendingUp, MdDashboard, MdWarning, MdSwapHoriz } from 'react-icons/md';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBarangs: 0,
    totalVendors: 0,
    totalMargins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockActivities, setStockActivities] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard');
      const data = await response.json();

      if (response.ok) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalBarangs: data.totalBarangs || 0,
          totalVendors: data.totalVendors || 0,
          totalMargins: data.totalMargins || 0
        });
      } else {
        setError(data.error || 'Failed to load dashboard statistics');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardActivities = async () => {
    try {
      setLoadingActivities(true);
      const response = await fetch('/api/dashboard/activities');
      const data = await response.json();
      
      if (response.ok) {
        setStockActivities(data.stockActivities || []);
        setRecentTransactions(data.recentTransactions || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchDashboardActivities();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="w-6 h-6" />, 
      gradient: 'from-[#00A69F] to-[#0D9488]',
      bgColor: 'bg-gradient-to-br from-teal-50 to-white',
      iconColor: 'text-[#00A69F]',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Barang',
      value: stats.totalBarangs,
      icon: <FaBox className="w-6 h-6" />,
      gradient: 'from-[#06B6D4] to-[#0891B2]',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-white',
      iconColor: 'text-[#06B6D4]',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: <FaStore className="w-6 h-6" />,
      gradient: 'from-[#0D9488] to-[#115E59]',
      bgColor: 'bg-gradient-to-br from-teal-50 to-white',
      iconColor: 'text-[#0D9488]',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Total Margins',
      value: stats.totalMargins,
      icon: <FaChartLine className="w-6 h-6" />,
      gradient: 'from-[#14B8A6] to-[#0D9488]',
      bgColor: 'bg-gradient-to-br from-teal-50 to-white',
      iconColor: 'text-[#14B8A6]',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const quickActions = [
    { 
      title: 'Add User', 
      href: '/user/add', 
      icon: <FaUserPlus className="w-5 h-5" />, 
      color: 'bg-teal-50 hover:bg-teal-100 border-[#00A69F] text-[#0D9488]' 
    },
    { 
      title: 'Add Barang', 
      href: '/barang/add', 
      icon: <FaBoxOpen className="w-5 h-5" />, 
      color: 'bg-cyan-50 hover:bg-cyan-100 border-[#06B6D4] text-[#0891B2]' 
    },
    { 
      title: 'Add Vendor', 
      href: '/vendor/add', 
      icon: <FaPlusSquare className="w-5 h-5" />, 
      color: 'bg-teal-50 hover:bg-teal-100 border-[#0D9488] text-[#115E59]' 
    },
    { 
      title: 'Add Margin', 
      href: '/margin/add', 
      icon: <FaPercentage className="w-5 h-5" />, 
      color: 'bg-teal-50 hover:bg-teal-100 border-[#14B8A6] text-[#0D9488]' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/20 to-cyan-50/20">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Welcome Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00A69F] via-[#0D9488] to-[#06B6D4] p-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MdDashboard className="w-8 h-8 text-white/90" />
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
              </div>
              <p className="text-teal-100 text-base">Welcome back! Here's what's happening with your business today.</p>
              <div className="flex items-center gap-2 text-sm text-teal-100/80 mt-3">
                <FaClock className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            <button
              onClick={fetchDashboardStats}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-medium text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <MdRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" title="Error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Cards with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {card.icon}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.gradient} blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    card.changeType === 'increase' 
                      ? 'bg-teal-50 text-[#0D9488] border border-teal-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {card.changeType === 'increase' ? (
                      <FaArrowUp className="w-3 h-3" />
                    ) : (
                      <FaArrowDown className="w-3 h-3" />
                    )}
                    {card.change}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? (
                      <span className="inline-block w-24 h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse bg-[length:200%_100%]"></span>
                    ) : (
                      <span className="bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {card.value.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>

                {/* Trend Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MdTrendingUp className="w-4 h-4" />
                    <span>vs last month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-500 mt-1">Shortcuts to common tasks</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <LinkButton
                  key={index}
                  href={action.href}
                  variant="outline"
                  className={`${action.color} border-2 justify-center gap-3 py-4 text-center hover:shadow-lg transition-all hover:-translate-y-1`}
                  icon={action.icon}
                >
                  <span className="font-semibold">{action.title}</span>
                </LinkButton>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* System Info & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Activity Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A69F] to-[#0D9488] flex items-center justify-center text-white shadow-lg">
                <MdSwapHoriz className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Stock Activities</h3>
                <p className="text-sm text-gray-500">Recent stock movements</p>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {loadingActivities ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl animate-pulse">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : stockActivities.length > 0 ? (
                stockActivities.map((activity, idx) => {
                  const isIncoming = activity.masuk > 0;
                  const amount = isIncoming ? activity.masuk : activity.keluar;
                  
                  return (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      isIncoming 
                        ? 'bg-gradient-to-r from-teal-50/50 to-transparent border-teal-100 hover:border-[#00A69F]' 
                        : 'bg-gradient-to-r from-red-50/50 to-transparent border-red-100 hover:border-red-300'
                    }`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isIncoming ? 'bg-teal-100' : 'bg-orange-100'
                        }`}>
                          {isIncoming ? (
                            <FaArrowLeft className={`w-4 h-4 ${isIncoming ? 'text-[#00A69F]' : 'text-orange-600'}`} />
                          ) : (
                            <FaArrowRight className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{activity.nama_barang}</p>
                          <p className="text-xs text-gray-500">{activity.jenis_text} • {amount} {activity.nama_satuan}</p>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-xs font-medium text-gray-500">Stock</p>
                        <p className="text-sm font-bold text-gray-900">{activity.current_stock}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaBox className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">No stock activities yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center text-white shadow-lg">
                <FaStore className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Pengadaan</h3>
                <p className="text-sm text-gray-500">Latest procurement orders</p>
              </div>
            </div>
            <div className="space-y-3">
              {loadingActivities ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((trans, idx) => {
                  const statusColors: any = {
                    'P': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Processing' },
                    'S': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Partial' },
                    'L': { bg: 'bg-green-100', text: 'text-green-700', label: 'Complete' },
                    'B': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
                  };
                  const statusStyle = statusColors[trans.status] || statusColors['P'];
                  
                  return (
                    <div key={idx} className="p-4 bg-gradient-to-r from-cyan-50/50 to-transparent rounded-xl border border-cyan-100 hover:border-[#06B6D4] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">
                          PO #{trans.idpengadaan}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{trans.nama_vendor}</p>
                      <p className="text-xs text-gray-500 mb-2">by {trans.username}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#00A69F]">
                          Rp {trans.total_nilai.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(trans.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaStore className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
