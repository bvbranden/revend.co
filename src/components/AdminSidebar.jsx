import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiHome, 
  FiUsers, 
  FiBuilding, 
  FiDollarSign, 
  FiShield, 
  FiSettings,
  FiBarChart3 
} = FiIcons;

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/analytics', icon: FiBarChart3, label: 'Analytics' },
    { path: '/admin/users', icon: FiUsers, label: 'User Management' },
    { path: '/admin/companies', icon: FiBuilding, label: 'Company Verification' },
    { path: '/admin/transactions', icon: FiDollarSign, label: 'Transactions' },
    { path: '/admin/security', icon: FiShield, label: 'Security' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen fixed left-0 top-16 z-40">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;