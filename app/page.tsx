'use client';
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/app/lib/type';
import { LinkButton } from './components/LinkButton';
import { Alert } from './components/Alert';
import { Card, CardBody } from './components/Card';
import { FaUsers, FaBox, FaStore, FaChartLine, FaUserPlus, FaBoxOpen, FaPlusSquare, FaPercentage } from 'react-icons/fa';

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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="w-6 h-6" />, 
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-white',
      iconColor: 'text-blue-600',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Barang',
      value: stats.totalBarangs,
      icon: <FaBox className="w-6 h-6" />,
      gradient: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-white',
      iconColor: 'text-emerald-600',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: <FaStore className="w-6 h-6" />,
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-white',
      iconColor: 'text-purple-600',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Total Margins',
      value: stats.totalMargins,
      icon: <FaChartLine className="w-6 h-6" />,
      gradient: 'from-amber-400 to-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-white',
      iconColor: 'text-amber-600',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const quickActions = [
    { 
      title: 'Add User', 
      href: '/user/add', 
      icon: <FaUserPlus className="w-5 h-5" />, 
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700' 
    },
    { 
      title: 'Add Barang', 
      href: '/barang/add', 
      icon: <FaBoxOpen className="w-5 h-5" />, 
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700' 
    },
    { 
      title: 'Add Vendor', 
      href: '/vendor/add', 
      icon: <FaPlusSquare className="w-5 h-5" />, 
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700' 
    },
    { 
      title: 'Add Margin', 
      href: '/margin/add', 
      icon: <FaPercentage className="w-5 h-5" />, 
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center ${card.iconColor}`}>
                {card.icon}
              </div>
              <div className={`text-xs font-medium ${card.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'} flex items-center gap-1`}>
                {card.changeType === 'increase' ? '↑' : '↓'}
                {card.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  card.value.toLocaleString()
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <LinkButton
                key={index}
                href={action.href}
                variant="outline"
                className={`${action.color} border justify-start gap-2`}
                icon={action.icon}
              >
                {action.title}
              </LinkButton>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Server</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <span className="w-1.5 h-1.5 bg-success-500 rounded-full"></span>
                  Running
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-900">2 hours ago</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Stock updated</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">New transaction</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
