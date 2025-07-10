import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { 
  FiUsers, FiBuilding, FiAlertCircle, FiCheckCircle, 
  FiXCircle, FiTrendingUp, FiPackage, FiMessageSquare 
} = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingCompanies: 0,
    activeUsers: 0,
    totalDisputes: 0,
    totalTransactions: 0
  });
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [recentDisputes, setRecentDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch pending companies
        const { data: companies, error: companiesError } = await supabase
          .from('companies_revend')
          .select('*')
          .eq('status', 'pending');

        if (companiesError) throw companiesError;

        // Fetch active users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles_revend')
          .select('*', { count: 'exact' });

        if (usersError) throw usersError;

        // Fetch recent disputes
        const { data: disputes, error: disputesError } = await supabase
          .from('disputes_revend')
          .select(`
            *,
            complainant:complainant_id(name),
            respondent:respondent_id(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (disputesError) throw disputesError;

        setStats({
          pendingCompanies: companies.length,
          activeUsers: usersCount,
          totalDisputes: disputes.length,
          totalTransactions: 0 // You'll need to implement transaction tracking
        });

        setPendingVerifications(companies);
        setRecentDisputes(disputes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleVerification = async (companyId, status) => {
    try {
      const { error } = await supabase
        .from('companies_revend')
        .update({ 
          status,
          verified_at: new Date().toISOString(),
          verified_by: user.id
        })
        .eq('id', companyId);

      if (error) throw error;

      // Refresh pending verifications
      setPendingVerifications(prev => 
        prev.filter(company => company.id !== companyId)
      );

      // Create notification for company admin
      await supabase
        .from('notifications_revend')
        .insert({
          user_id: companyId, // This should be the company admin's user ID
          title: `Company Verification ${status === 'verified' ? 'Approved' : 'Rejected'}`,
          content: `Your company verification has been ${status === 'verified' ? 'approved' : 'rejected'}.`,
          type: 'company_verification'
        });

    } catch (error) {
      console.error('Error updating company status:', error);
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Companies</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pendingCompanies}</h3>
            </div>
            <SafeIcon icon={FiBuilding} className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
            </div>
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600">Active Disputes</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalDisputes}</h3>
            </div>
            <SafeIcon icon={FiAlertCircle} className="w-8 h-8 text-orange-500" />
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
              <p className="text-sm text-gray-600">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</h3>
            </div>
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Pending Verifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Verifications</h2>
          {pendingVerifications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingVerifications.map((company) => (
                    <tr key={company.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{company.website}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(company.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerification(company.id, 'verified')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <SafeIcon icon={FiCheckCircle} className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleVerification(company.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <SafeIcon icon={FiXCircle} className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No pending verifications</p>
          )}
        </div>
      </div>

      {/* Recent Disputes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Disputes</h2>
          {recentDisputes.length > 0 ? (
            <div className="space-y-4">
              {recentDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{dispute.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dispute.status === 'open' ? 'bg-red-100 text-red-800' :
                      dispute.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {dispute.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{dispute.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      Between: {dispute.complainant?.name} and {dispute.respondent?.name}
                    </div>
                    <div>
                      {new Date(dispute.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent disputes</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;