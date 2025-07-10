import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiAlertCircle, FiInfo } = FiIcons;

const DirectLogin = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if already signed in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setMessage('Already signed in! Redirecting to admin dashboard...');
          setTimeout(() => {
            navigate('/admin');
          }, 2000);
          return;
        }

        // Try to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@revend.co',
          password: 'Admin@123'
        });

        if (signInError) {
          if (signInError.message.includes('Database error')) {
            // This is likely due to missing tables
            setError('Database setup required. Please see instructions below.');
            setShowInstructions(true);
          } else {
            // Try creating a new admin account
            try {
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: 'admin@revend.co',
                password: 'Admin@123',
                options: {
                  data: {
                    name: 'Admin User',
                    role: 'admin'
                  }
                }
              });

              if (signUpError) {
                setError(signUpError.message);
              } else {
                setMessage('Admin account created! You may need to verify the email before logging in.');
              }
            } catch (err) {
              setError('Error creating account: ' + err.message);
            }
          }
        } else {
          setMessage('Signed in successfully! Redirecting to admin dashboard...');
          setTimeout(() => {
            navigate('/admin');
          }, 2000);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const manualLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@revend.co',
        password: 'Admin@123'
      });
      
      if (error) throw error;
      
      setMessage('Signed in successfully! Redirecting to admin dashboard...');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">revend.co</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Setup</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 mr-2 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Setting up admin account...</p>
          </div>
        ) : (
          <>
            {!message && (
              <form onSubmit={manualLogin} className="mt-8 space-y-6">
                <div className="text-center">
                  <p className="mb-4 text-gray-600">
                    Admin Credentials:<br />
                    Email: admin@revend.co<br />
                    Password: Admin@123
                  </p>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                  </button>
                </div>
              </form>
            )}
            
            {showInstructions && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center text-blue-600 mb-3">
                  <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2" />
                  <h3 className="font-medium">Setup Instructions</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  You need to create the required database tables first.
                </p>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Go to the Supabase dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Create the following tables:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>profiles_revend</li>
                      <li>companies_revend</li>
                      <li>products_revend</li>
                      <li>messages_revend</li>
                      <li>notifications_revend</li>
                    </ul>
                  </li>
                  <li>Return to this page and try again</li>
                </ol>
                <div className="mt-4">
                  <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
                    Go to Homepage
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DirectLogin;