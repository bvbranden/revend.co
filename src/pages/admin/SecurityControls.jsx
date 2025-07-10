import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { 
  FiShield, FiAlertTriangle, FiFlag, FiEye, FiLock, 
  FiUnlock, FiX, FiCheck, FiActivity, FiSettings 
} = FiIcons;

const SecurityControls = () => {
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    autoFlagEnabled: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requireEmailVerification: true,
    enableTwoFactor: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Mock data for flagged content
      const mockFlaggedContent = [
        {
          id: '1',
          type: 'listing',
          title: 'Suspicious laptop listing',
          description: 'Multiple identical listings from same user',
          reporter: 'System',
          status: 'pending',
          created_at: new Date().toISOString(),
          severity: 'medium'
        },
        {
          id: '2',
          type: 'message',
          title: 'Inappropriate message content',
          description: 'User reported inappropriate language',
          reporter: 'John Doe',
          status: 'reviewed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          severity: 'low'
        }
      ];

      // Mock security logs
      const mockSecurityLogs = [
        {
          id: '1',
          action: 'Failed login attempt',
          user: 'suspicious.user@example.com',
          ip: '192.168.1.100',
          timestamp: new Date().toISOString(),
          severity: 'high'
        },
        {
          id: '2',
          action: 'Account suspended',
          user: 'admin@revend.co',
          details: 'User account suspended for policy violation',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'medium'
        }
      ];

      // Mock suspicious activity
      const mockSuspiciousActivity = [
        {
          id: '1',
          type: 'multiple_accounts',
          description: 'Same IP address used for multiple new accounts',
          count: 5,
          ip: '192.168.1.100',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'price_anomaly',
          description: 'Listing price significantly below market value',
          listing_id: 'listing-123',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      setFlaggedContent(mockFlaggedContent);
      setSecurityLogs(mockSecurityLogs);
      setSuspiciousActivity(mockSuspiciousActivity);
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlaggedContentAction = async (id, action) => {
    try {
      // Update flagged content status
      setFlaggedContent(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: action } : item
        )
      );

      // In a real app, you would update the database here
      console.log(`Flagged content ${id} ${action}`);
    } catch (error) {
      console.error('Error handling flagged content:', error);
    }
  };

  const updateSecuritySettings = async (settings) => {
    try {
      setSecuritySettings(settings);
      // In a real app, you would save to database
      console.log('Security settings updated:', settings);
    } catch (error) {
      console.error('Error updating security settings:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Controls</h1>
        <p className="text-gray-600">Monitor and manage platform security</p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged Content</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {flaggedContent.filter(item => item.status === 'pending').length}
              </h3>
            </div>
            <SafeIcon icon={FiFlag} className="w-8 h-8 text-red-500" />
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
              <p className="text-sm text-gray-600">Security Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {securityLogs.filter(log => log.severity === 'high').length}
              </h3>
            </div>
            <SafeIcon icon={FiAlertTriangle} className="w-8 h-8 text-orange-500" />
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
              <p className="text-sm text-gray-600">Suspicious Activity</p>
              <h3 className="text-2xl font-bold text-gray-900">{suspiciousActivity.length}</h3>
            </div>
            <SafeIcon icon={FiActivity} className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Flagged Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Flagged Content</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {flaggedContent.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>Reported by: {item.reporter}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.severity === 'high' ? 'bg-red-100 text-red-800' :
                      item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  
                  {item.status === 'pending' && (
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleFlaggedContentAction(item.id, 'approved')}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        <SafeIcon icon={FiCheck} className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleFlaggedContentAction(item.id, 'rejected')}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        <SafeIcon icon={FiX} className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Auto-Flag Suspicious Content</h3>
                  <p className="text-sm text-gray-600">Automatically flag potentially harmful content</p>
                </div>
                <button
                  onClick={() => updateSecuritySettings({
                    ...securitySettings,
                    autoFlagEnabled: !securitySettings.autoFlagEnabled
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    securitySettings.autoFlagEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      securitySettings.autoFlagEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => updateSecuritySettings({
                    ...securitySettings,
                    maxLoginAttempts: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => updateSecuritySettings({
                    ...securitySettings,
                    sessionTimeout: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Require Email Verification</h3>
                  <p className="text-sm text-gray-600">Users must verify email before accessing platform</p>
                </div>
                <button
                  onClick={() => updateSecuritySettings({
                    ...securitySettings,
                    requireEmailVerification: !securitySettings.requireEmailVerification
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    securitySettings.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      securitySettings.requireEmailVerification ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Security Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User/IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.action}</div>
                    {log.details && (
                      <div className="text-sm text-gray-500">{log.details}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.user}</div>
                    {log.ip && (
                      <div className="text-sm text-gray-500">{log.ip}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.severity === 'high' ? 'bg-red-100 text-red-800' :
                      log.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityControls;