import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import supabase from '../../lib/supabase';

const { FiFile, FiDownload, FiCheckCircle, FiXCircle } = FiIcons;

const CompanyVerification = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('companies_revend')
          .select(`
            *,
            admin:verified_by(name),
            profiles:profiles_revend(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        setCompany(data);
        setDocuments(data.verification_documents || []);
      } catch (error) {
        console.error('Error fetching company details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  const handleVerification = async (status) => {
    try {
      const { error } = await supabase
        .from('companies_revend')
        .update({
          status,
          verified_at: new Date().toISOString(),
          verified_by: user.id,
          verification_notes: notes
        })
        .eq('id', id);

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications_revend')
        .insert({
          user_id: company.profiles[0].id, // Notify company admin
          title: `Company Verification ${status === 'verified' ? 'Approved' : 'Rejected'}`,
          content: status === 'verified' 
            ? 'Your company has been verified successfully.'
            : `Your company verification was rejected. Reason: ${notes}`,
          type: 'company_verification'
        });

      // Refresh company data
      setCompany(prev => ({ ...prev, status }));
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-500 text-center">Company not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Company Verification</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              company.status === 'verified' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {company.status}
            </span>
          </div>

          {/* Company Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="text-gray-900">{company.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="text-gray-900">{company.website}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted On</p>
                <p className="text-gray-900">
                  {new Date(company.created_at).toLocaleDateString()}
                </p>
              </div>
              {company.verified_at && (
                <div>
                  <p className="text-sm text-gray-500">Verified On</p>
                  <p className="text-gray-900">
                    {new Date(company.verified_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Documents */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Documents</h2>
            <div className="grid grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiFile} className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{doc.name}</span>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <SafeIcon icon={FiDownload} className="w-5 h-5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Actions */}
          {company.status === 'pending' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Decision</h2>
              <div className="space-y-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add verification notes..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVerification('verified')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <SafeIcon icon={FiCheckCircle} className="w-5 h-5 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification('rejected')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <SafeIcon icon={FiXCircle} className="w-5 h-5 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyVerification;