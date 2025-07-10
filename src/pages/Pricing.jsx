import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiX, FiHelpCircle, FiArrowRight } = FiIcons;

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [showFeatureInfo, setShowFeatureInfo] = useState(null);

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for small brokers just getting started',
      price: billingPeriod === 'monthly' ? 49 : 470,
      features: [
        { name: 'Up to 25 active listings', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Company verification', included: false },
        { name: 'Priority placement', included: false },
        { name: 'API access', included: false },
      ],
      cta: 'Get Started',
      popular: false,
      color: 'bg-gray-100',
      buttonClass: 'bg-gray-600 hover:bg-gray-700',
    },
    {
      name: 'Business',
      description: 'For growing ITAD companies and brokers',
      price: billingPeriod === 'monthly' ? 99 : 950,
      features: [
        { name: 'Up to 100 active listings', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Company verification', included: true },
        { name: 'Priority placement', included: true },
        { name: 'API access', included: false },
      ],
      cta: 'Get Started',
      popular: true,
      color: 'bg-blue-50',
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Enterprise',
      description: 'For large volume dealers and enterprises',
      price: billingPeriod === 'monthly' ? 249 : 2390,
      features: [
        { name: 'Unlimited listings', included: true },
        { name: 'Custom analytics & reporting', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Company verification+', included: true },
        { name: 'Premium placement', included: true },
        { name: 'API access', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'bg-purple-50',
      buttonClass: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  const featureExplanations = {
    'Up to 25 active listings': 'You can have a maximum of 25 equipment listings active at any time.',
    'Up to 100 active listings': 'You can have a maximum of 100 equipment listings active at any time.',
    'Unlimited listings': 'Post as many equipment listings as you need with no limits.',
    'Basic analytics': 'View simple statistics about your listings and views.',
    'Advanced analytics': 'Get detailed insights into performance, engagement, and conversion rates.',
    'Custom analytics & reporting': 'Receive tailored reports and analytics dashboards specific to your business needs.',
    'Email support': 'Get help via email with a response within 48 hours.',
    'Priority email support': 'Receive faster email support with a response within 24 hours.',
    'Dedicated account manager': 'A personal account manager to help optimize your selling strategy.',
    'Company verification': 'Get a verified badge to increase trust with potential buyers.',
    'Company verification+': 'Enhanced verification with background checks and financial verification.',
    'Priority placement': 'Your listings appear higher in search results and category pages.',
    'Premium placement': 'Your listings appear at the top of search results and featured sections.',
    'API access': 'Integrate your systems directly with our platform via our API.',
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your business. All plans come with a 14-day free trial.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center mt-8">
            <span className={`mr-3 text-sm ${billingPeriod === 'monthly' ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200"
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
              Annual <span className="text-green-600 font-medium">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg shadow-sm border border-gray-200 overflow-hidden ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-1.5 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className={`${plan.color} p-8`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-1">/{billingPeriod === 'monthly' ? 'mo' : 'year'}</span>
                </div>
                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className={`w-full inline-flex justify-center items-center px-4 py-3 rounded-lg text-white font-medium ${plan.buttonClass}`}
                >
                  {plan.cta}
                  <SafeIcon icon={FiArrowRight} className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start">
                      {feature.included ? (
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      ) : (
                        <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      )}
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
                How does the 14-day free trial work?
              </h3>
              <p className="text-gray-600">
                You'll get full access to all features of your selected plan for 14 days, without being charged. If you decide to continue, we'll bill you at the end of the trial. You can cancel anytime before the trial ends without being charged.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer invoice payment options.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a discount for annual billing?
              </h3>
              <p className="text-gray-600">
                Yes, you save 20% when you choose annual billing compared to monthly billing. The discount is automatically applied when you select the annual option.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center bg-blue-600 text-white rounded-xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of ITAD companies and brokers who trust revend.co for their equipment trading needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
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