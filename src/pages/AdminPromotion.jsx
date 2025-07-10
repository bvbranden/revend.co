import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiUser, FiSearch, FiCheck, FiAlertCircle } = FiIcons;

const AdminPromotion = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles_revend')
        .select('id, name, email, role')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', email)
        .single();
      
      if (userError) {
        if (userError.code === 'PGRST116') {
          setError(`No user found with email: ${email}`);
        } else {
          throw userError;
        }
        return;
      }
      
      // Call our function to promote user
      const { data, error } = await supabase
        .rpc('promote_to_admin', { email_to_promote: email });
      
      if (error) throw error;
      
      setSuccess(data || `User ${email} promoted to admin successfully!`);
      fetchUsers();
    } catch (err) {
      console.error('Error promoting user:', err);
      setError(err.message || 'Failed to promote user');
    } finally {
      setLoading(false);
    }
  };

  const registerAndPromote = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Register a new user
      const password = 'Admin@123'; // Default password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Admin User',
            role: 'admin',
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData?.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles_revend')
          .insert({
            id: authData.user.id,
            name: 'Admin User',
            role: 'admin',
            is_company_admin: true,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          });
          
        if (profileError) throw profileError;
        
        setSuccess(`Admin user created: ${email} with password: ${password}`);
        fetchUsers();
      }
    } catch (err) {
      console.error('Error creating admin:', err);
      setError(err.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Promotion Tool</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 mr-2 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2 text-green-500" />
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={promoteUser} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="pt-6 flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading || !email}
              >
                Promote to Admin
              </button>
              <button
                type="button"
                onClick={registerAndPromote}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading || !email}
              >
                Register & Promote
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Use "Promote to Admin" for existing users, or "Register & Promote" to create a new admin user.
            Default password for new users is "Admin@123".
          </p>
        </form>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium mb-4">Current Users</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <SafeIcon icon={FiUser} className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPromotion;