import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import supabase from '../lib/supabase';

const { FiUser, FiEdit, FiPackage, FiMessageCircle, FiStar, FiTrendingUp, FiCheck, FiAlertCircle } = FiIcons;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const userProducts = products.filter(product => product.seller === user.company);

  const stats = [
    { label: 'Active Listings', value: userProducts.length, icon: FiPackage },
    { label: 'Total Sales', value: '12', icon: FiTrendingUp },
    { label: 'Rating', value: '4.8', icon: FiStar },
    { label: 'Messages', value: '5', icon: FiMessageCircle }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'listings', label: 'My Listings' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles_revend')
        .update({
          name: profileData.name,
          company: profileData.company,
          role: profileData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      if (updateProfile) {
        updateProfile({
          ...user,
          name: profileData.name,
          company: profileData.company,
          role: profileData.role
        });
      }

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + '/#/reset-password',
      });

      if (error) throw error;
      setSuccessMessage('Password reset link sent to your email!');
    } catch (err) {
      console.error('Error resetting password:', err);
      setErrorMessage(err.message || 'Failed to send reset password email');
    } finally {
      setIsLoading(false);
    }
  };

  const ProfileForm = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary"
          disabled={isLoading}
        >
          <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <SafeIcon icon={FiAlertCircle} className="w-5 h-5 mr-2 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              className="form-input disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled={true} // Email is always disabled
              className="form-input disabled:bg-gray-50"
            />
          </div>
        </div>
        <div>
          <label className="form-label">Company</label>
          <input
            type="text"
            name="company"
            value={profileData.company}
            onChange={handleInputChange}
            disabled={!isEditing || isLoading}
            className="form-input disabled:bg-gray-50"
          />
        </div>
        <div>
          <label className="form-label">Role</label>
          <select
            name="role"
            value={profileData.role}
            onChange={handleInputChange}
            disabled={!isEditing || isLoading}
            className="form-input disabled:bg-gray-50"
          >
            <option value="user">User</option>
            <option value="broker">Broker</option>
            <option value="itad">ITAD Company</option>
            <option value="reseller">Reseller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {isEditing && (
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        <button
          onClick={handleResetPassword}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          disabled={isLoading}
        >
          <SafeIcon icon={FiIcons.FiLock} className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : 'Reset Password'}
        </button>
        <p className="mt-2 text-sm text-gray-500">
          You'll receive an email with instructions to reset your password.
        </p>
      </div>
    </div>
  );

  const ListingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Listings</h2>
        {userProducts.length > 0 ? (
          <div className="space-y-4">
            {userProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.title}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-sm font-medium text-green-600">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                    <button className="btn-secondary text-sm">Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiPackage} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No listings yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notify-messages"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notify-messages" className="ml-2 text-gray-700">
              New messages
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notify-listings"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notify-listings" className="ml-2 text-gray-700">
              Listing interest
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notify-transactions"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notify-transactions" className="ml-2 text-gray-700">
              Transaction updates
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Delete Account
        </button>
        <p className="mt-2 text-sm text-gray-500">
          This will permanently delete your account and all your data.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-lg text-gray-600">{user.company}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <ProfileForm />}
          {activeTab === 'listings' && <ListingsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;