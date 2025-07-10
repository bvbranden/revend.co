import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiAlertCircle } = FiIcons;

const DirectLogin = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const signInAdmin = async () => {
      try {
        setIsLoading(true);
        
        // Try to sign in with admin credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'admin@revend.co',
          password: 'Admin@123'
        });

        if (signInError) {
          // If sign in fails, create the admin account
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

          if (signUpError) throw signUpError;

          setMessage('Admin account created! Please check your email to verify your account.');
        } else {
          setMessage('Signed in successfully! Redirecting to admin dashboard...');
          // Redirect after successful sign in
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

    signInAdmin();
  }, [navigate]);

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
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 mr-2 text-red-500" />
            <span>{error}</span>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Setting up admin account...</p>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
            <p className="mt-4 text-gray-600">
              Admin Email: admin@revend.co<br />
              Password: Admin@123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectLogin;