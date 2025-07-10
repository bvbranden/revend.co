import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { 
  FiDollarSign, FiTrendingUp, FiTrendingDown, FiCalendar, 
  FiSearch, FiDownload, FiEye, FiAlertCircle 
} = FiIcons;

const TransactionTracking = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalTransactions: 0,
    averageValue: 0,
    monthlyGrowth: 0
  });
  const [dateRange, setDateRange] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [dateRange]);

  const fetchTransactions = async () => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      // This is a mock query - you'll need to create a transactions table
      const { data, error } = await supabase
        .from('transactions_revend')
        .select(`
          *,
          buyer:buyer_id(name, company),
          seller:seller_id(name, company),
          product:product_id(title, image)
        `)
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Mock data for demonstration
      const mockTransactions = [
        {
          id: '1',
          amount: 15000,
          status: 'completed',
          buyer: { name: 'John Doe', company: 'Tech Corp' },
          seller: { name: 'Jane Smith', company: 'Hardware Inc' },
          product: { title: 'Dell OptiPlex 7090', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop' },
          created_at: new Date().toISOString(),
          quantity: 50
        },
        {
          id: '2',
          amount: 8500,
          status: 'pending',
          buyer: { name: 'Mike Johnson', company: 'Data Solutions' },
          seller: { name: 'Sarah Wilson', company: 'Refurb Pro' },
          product: { title: 'HP EliteBook 840', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop' },
          created_at: new Date(Date.now() - 86400000).toISOString(),
          quantity: 25
        }
      ];

      setTransactions(data || mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Set mock data on error
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats calculation
      const mockStats = {
        totalVolume: 250000,
        totalTransactions: 45,
        averageValue: 5555,
        monthlyGrowth: 12.5
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Transaction ID', 'Buyer', 'Seller', 'Product', 'Amount', 'Status'],
      ...transactions.map(t => [
        new Date(t.created_at).toLocaleDateString(),
        t.id,
        t.buyer?.name || 'N/A',
        t.seller?.name || 'N/A',
        t.product?.title || 'N/A',
        `$${t.amount.toLocaleString()}`,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Tracking</h1>
        <p className="text-gray-600">Monitor and analyze platform transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${stats.totalVolume.toLocaleString()}
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
              <p className="text-sm text-gray-600">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</h3>
            </div>
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Average Value</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${stats.averageValue.toLocaleString()}
              </h3>
            </div>
            <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-purple-500" />
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
              <p className="text-sm text-gray-600">Monthly Growth</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth}%
              </h3>
            </div>
            <SafeIcon 
              icon={stats.monthlyGrowth > 0 ? FiTrendingUp : FiTrendingDown} 
              className={`w-8 h-8 ${stats.monthlyGrowth > 0 ? 'text-green-500' : 'text-red-500'}`} 
            />
          </div>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>

          <button
            onClick={exportTransactions}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export CSV
          </button>

          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredTransactions.length} transactions
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={transaction.product?.image}
                        alt={transaction.product?.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.product?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {transaction.quantity}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.buyer?.name}</div>
                    <div className="text-sm text-gray-500">{transaction.buyer?.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.seller?.name}</div>
                    <div className="text-sm text-gray-500">{transaction.seller?.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <SafeIcon icon={FiEye} className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiAlertCircle} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or date range</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTracking;