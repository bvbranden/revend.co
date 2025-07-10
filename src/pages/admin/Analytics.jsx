import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiTrendingUp, FiDollarSign, FiUsers, FiShoppingBag } = FiIcons;

// Simple date formatter function instead of using date-fns
const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    avgOrderValue: 0,
    activeUsers: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState({
    revenue: [],
    users: [],
    transactions: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const mockData = generateMockData(days);
      
      setMetrics({
        totalRevenue: mockData.totalRevenue,
        avgOrderValue: mockData.avgOrderValue,
        activeUsers: mockData.activeUsers,
        conversionRate: mockData.conversionRate
      });

      setChartData({
        revenue: mockData.revenueData,
        users: mockData.userData,
        transactions: mockData.transactionData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (days) => {
    const revenueData = [];
    const userData = [];
    const transactionData = [];
    let totalRevenue = 0;
    let totalTransactions = 0;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      const dailyRevenue = Math.floor(Math.random() * 50000) + 10000;
      const dailyUsers = Math.floor(Math.random() * 500) + 100;
      const dailyTransactions = Math.floor(Math.random() * 50) + 10;

      totalRevenue += dailyRevenue;
      totalTransactions += dailyTransactions;

      revenueData.push([formatDate(date), dailyRevenue]);
      userData.push([formatDate(date), dailyUsers]);
      transactionData.push([formatDate(date), dailyTransactions]);
    }

    return {
      revenueData,
      userData,
      transactionData,
      totalRevenue,
      avgOrderValue: Math.floor(totalRevenue / totalTransactions),
      activeUsers: Math.floor(Math.random() * 5000) + 1000,
      conversionRate: ((totalTransactions / (Math.random() * 10000 + 5000)) * 100).toFixed(1)
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your marketplace performance and metrics</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Last {range === '7d' ? '7' : range === '30d' ? '30' : '90'} days
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${metrics.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.1}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${metrics.avgOrderValue.toLocaleString()}
              </h3>
            </div>
            <SafeIcon icon={FiShoppingBag} className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.2}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {metrics.activeUsers.toLocaleString()}
              </h3>
            </div>
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.3}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {metrics.conversionRate}%
              </h3>
            </div>
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Basic Stats Display instead of Charts */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chartData.revenue.map((data, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${data[1].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">User Activity</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chartData.users.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data[0]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data[1].toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction Volume</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chartData.transactions.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data[0]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data[1].toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;