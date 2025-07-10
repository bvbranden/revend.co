import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiX, FiHelpCircle, FiArrowRight, FiPackage, FiShield, FiUsers, FiCode } = FiIcons;

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [showFeatureInfo, setShowFeatureInfo] = useState(null);

  const addons = [
    {
      name: 'Extra Listings',
      description: '€20 per 10 additional listings',
      icon: FiPackage,
      availableFor: ['Bronze', 'Silver', 'Gold']
    },
    {
      name: 'Escrow Service',
      description: '€50 per transaction (Bronze plan only)',
      icon: FiShield,
      availableFor: ['Bronze']
    },
    {
      name: 'Extra Team Members',
      description: '€100/year per additional user',
      icon: FiUsers,
      availableFor: ['Bronze', 'Silver', 'Gold']
    },
    {
      name: 'Custom Integrations',
      description: 'Price on request',
      icon: FiCode,
      availableFor: ['Bronze', 'Silver', 'Gold']
    }
  ];

  const plans = [
    {
      name: 'Bronze',
      description: 'Essential tools for small brokers and sellers',
      price: billingPeriod === 'monthly' ? 50 : 500,
      monthlyPrice: 50,
      yearlyPrice: 500, // 10 months instead of 12
      currency: '€',
      features: [
        { name: 'Up to 10 listings per month', included: true },
        { name: '1 team member', included: true },
        { name: 'Access to escrow service', included: false },
        { name: 'Standardised grading system', included: false },
        { name: 'Promoted listings', included: false },
        { name: 'Verified seller badge', included: false },
        { name: 'Basic listing analytics', included: true },
        { name: 'Market price estimator', included: false },
        { name: 'Dispute mediation: community only', included: true },
        { name: 'Standard email support', included: true },
        { name: 'View-only reputation system', included: true },
        { name: 'Partner integrations', included: false },
        { name: 'API access', included: false },
        { name: 'Private buyer/seller rooms', included: false },
        { name: 'Early access to new features', included: false },
        { name: 'Inclusion in featured vendor list', included: false },
        { name: 'Onboarding: self-service only', included: true },
      ],
      cta: 'Get Started',
      popular: false,
      color: 'bg-amber-50',
      buttonClass: 'bg-amber-600 hover:bg-amber-700',
    },
    {
      name: 'Silver',
      description: 'Professional tools for growing businesses',
      price: billingPeriod === 'monthly' ? 100 : 1000,
      monthlyPrice: 100,
      yearlyPrice: 1000, // 10 months instead of 12
      currency: '€',
      features: [
        { name: 'Up to 50 listings per month', included: true },
        { name: '3 team members', included: true },
        { name: 'Access to escrow service', included: true },
        { name: 'Standardised grading system', included: true },
        { name: '3 promoted listings per month', included: true },
        { name: 'Verified seller badge', included: true },
        { name: 'Advanced listing analytics', included: true },
        { name: 'Limited access to market price estimator', included: true },
        { name: 'Priority queue for dispute mediation', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Editable reputation profile', included: true },
        { name: 'Blancco integration available', included: true },
        { name: 'Limited API access', included: true },
        { name: 'Private buyer/seller rooms', included: true },
        { name: 'Beta access to new features', included: true },
        { name: 'Inclusion in featured vendor list', included: false },
        { name: 'Onboarding: group session', included: true },
      ],
      cta: 'Get Started',
      popular: true,
      color: 'bg-gray-100',
      buttonClass: 'bg-gray-700 hover:bg-gray-800',
    },
    {
      name: 'Gold',
      description: 'Enterprise-grade for high-volume traders',
      price: billingPeriod === 'monthly' ? 150 : 1500,
      monthlyPrice: 150,
      yearlyPrice: 1500, // 10 months instead of 12
      currency: '€',
      features: [
        { name: 'Unlimited listings', included: true },
        { name: 'Up to 10 team members', included: true },
        { name: 'Access to escrow service', included: true },
        { name: 'Standardised grading system', included: true },
        { name: 'Unlimited promoted listings', included: true },
        { name: 'Verified seller badge with premium label', included: true },
        { name: 'Advanced analytics with export capability', included: true },
        { name: 'Unlimited access to market price estimator', included: true },
        { name: 'Dedicated dispute mediation officer', included: true },
        { name: '24h SLA email support', included: true },
        { name: 'Score booster tools for reputation system', included: true },
        { name: 'Full partner integrations (Blancco, logistics, etc.)', included: true },
        { name: 'Full API access', included: true },
        { name: 'Private rooms with custom branding', included: true },
        { name: 'Beta access + influence on roadmap', included: true },
        { name: 'Included in featured vendor list', included: true },
        { name: 'Onboarding: 1-on-1 concierge setup', included: true },
      ],
      cta: 'Get Started',
      popular: false,
      color: 'bg-yellow-50',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    },
  ];

  const featureExplanations = {
    'Up to 10 listings per month': 'You can create and manage up to 10 equipment listings per month.',
    'Up to 50 listings per month': 'You can create and manage up to 50 equipment listings per month.',
    'Unlimited listings': 'Create and manage as many equipment listings as you need with no limits.',
    '1 team member': 'One user account for the platform.',
    '3 team members': 'Up to three user accounts with access to your company dashboard.',
    'Up to 10 team members': 'Up to ten user accounts with customizable access levels.',
    'Access to escrow service': 'Secure payment processing through our trusted escrow service.',
    'Standardised grading system': 'Use our industry-standard equipment grading system for consistent quality descriptions.',
    'Promoted listings': 'Your listings will be highlighted and shown more prominently in search results.',
    '3 promoted listings per month': 'Choose up to 3 listings per month to receive premium placement.',
    'Unlimited promoted listings': 'Promote as many listings as you want for maximum visibility.',
    'Verified seller badge': 'Gain buyer trust with a verified seller badge on your profile and listings.',
    'Verified seller badge with premium label': 'Enhanced trust indicator showing your premium status to potential buyers.',
    'Basic listing analytics': 'View basic statistics about your listings and views.',
    'Advanced listing analytics': 'Get detailed insights into performance, engagement, and conversion rates.',
    'Advanced analytics with export capability': 'Comprehensive analytics with data export for further analysis.',
    'Market price estimator': 'Tool to help you determine competitive market prices for your equipment.',
    'Limited access to market price estimator': 'Basic price estimation for common equipment categories.',
    'Unlimited access to market price estimator': 'Full access to our price estimation tool for all equipment types.',
    'Dispute mediation: community only': 'Disputes are handled through our community forum.',
    'Priority queue for dispute mediation': 'Your disputes are handled with priority by our support team.',
    'Dedicated dispute mediation officer': 'A dedicated specialist to handle any transaction disputes.',
    'Standard email support': 'Email support with 48-hour response time.',
    'Priority email support': 'Email support with 24-hour response time.',
    '24h SLA email support': 'Guaranteed 24-hour response time backed by our Service Level Agreement.',
    'View-only reputation system': 'View your reputation score and feedback.',
    'Editable reputation profile': 'Ability to customize your business profile and respond to feedback.',
    'Score booster tools for reputation system': 'Advanced tools to help improve and showcase your reputation.',
    'Partner integrations': 'Integrate with industry-standard services and tools.',
    'Blancco integration available': 'Connect with Blancco for certified data erasure reporting.',
    'Full partner integrations (Blancco, logistics, etc.)': 'Seamless integration with all our partners including Blancco, shipping providers, and more.',
    'API access': 'Connect your systems directly with our platform.',
    'Limited API access': 'Basic API endpoints for essential operations.',
    'Full API access': 'Complete API access for full platform integration with your systems.',
    'Private buyer/seller rooms': 'Private communication channels with your trading partners.',
    'Private rooms with custom branding': 'Branded private communication channels with advanced features.',
    'Early access to new features': 'Get early access to upcoming platform features.',
    'Beta access to new features': 'Test and use new features before general release.',
    'Beta access + influence on roadmap': 'Early access to new features plus the ability to influence our product roadmap.',
    'Inclusion in featured vendor list': 'Your company will be featured in our directory of recommended vendors.',
    'Onboarding: self-service only': 'Access to documentation and guides for self-setup.',
    'Onboarding: group session': 'Participate in a group onboarding session with our customer success team.',
    'Onboarding: 1-on-1 concierge setup': 'Dedicated specialist to help you set up and optimize your account.',
  };

  const handleFeatureInfoClick = (featureName) => {
    if (showFeatureInfo === featureName) {
      setShowFeatureInfo(null);
    } else {
      setShowFeatureInfo(featureName);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const getFeatureIcon = (included) => {
    return included ? (
      <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
    ) : (
      <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose the Right Plan for Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're just starting out or running a large-scale operation, we have a plan to suit your needs.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center mt-8">
            <span className={`mr-3 text-sm ${billingPeriod === 'monthly' ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 bg-gray-200"
              aria-pressed={billingPeriod === 'annual'}
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  billingPeriod === 'annual' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`ml-3 text-sm ${billingPeriod === 'annual' ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              Annual <span className="text-green-600 font-medium">(Save 2 months)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg shadow-sm border border-gray-200 overflow-hidden ${plan.popular ? 'ring-2 ring-gray-600' : ''}`}
            >
              {plan.popular && (
                <div className="bg-gray-700 text-white text-center py-1.5 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={`${plan.color} p-8`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.currency}{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{billingPeriod === 'monthly' ? 'mo' : 'year'}</span>
                  {billingPeriod === 'annual' && (
                    <span className="ml-2 text-sm text-green-600">
                      Save {plan.currency}{plan.monthlyPrice * 2} per year
                    </span>
                  )}
                </div>
                <Link
                  to={plan.name === 'Gold' ? '/contact' : '/register'}
                  className={`w-full inline-flex justify-center items-center px-4 py-3 rounded-lg text-white font-medium ${plan.buttonClass}`}
                >
                  {plan.cta}
                  <SafeIcon icon={FiArrowRight} className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white p-6 overflow-y-auto max-h-96">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start">
                      {getFeatureIcon(feature.included)}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={feature.included ? 'text-gray-900' : 'text-gray-500'}>
                            {feature.name}
                          </span>
                          <button
                            onClick={() => handleFeatureInfoClick(feature.name)}
                            className="ml-1.5 text-gray-400 hover:text-gray-600"
                          >
                            <SafeIcon icon={FiHelpCircle} className="w-4 h-4" />
                          </button>
                        </div>
                        {showFeatureInfo === feature.name && (
                          <motion.div
                            {...fadeIn}
                            className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded-md"
                          >
                            {featureExplanations[feature.name]}
                          </motion.div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-ons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Optional Add-ons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <SafeIcon icon={addon.icon} className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {addon.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {addon.description}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  Available for: {addon.availableFor.join(', ')}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be prorated for the remainder of your billing period. When you downgrade, the changes will take effect at the end of your current billing period.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial on all plans. You can explore all features of your selected plan before committing. No credit card is required to start your trial.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. If you need alternative payment options, please contact our sales team.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I get a custom plan for my business?
              </h3>
              <p className="text-gray-600">
                Absolutely! If you have specific needs or a larger team, we can create a custom plan tailored to your business requirements. Contact our sales team to discuss custom solutions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center bg-gray-800 text-white rounded-xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of ITAD companies and brokers who trust revend.co for their equipment trading needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;