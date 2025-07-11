import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {
  FiUserPlus,
  FiUpload,
  FiEye,
  FiCheck,
  FiShield,
  FiUsers,
  FiDollarSign,
  FiGlobe,
  FiSettings,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
  FiStar,
  FiHelpCircle
} = FiIcons;

const HowItWorks = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      number: "01",
      icon: FiUserPlus,
      title: "Create your account",
      description: "Sign up in minutes and get verified as a buyer or seller. No delays, no friction.",
      color: "blue"
    },
    {
      number: "02", 
      icon: FiUpload,
      title: "Upload your IT stock",
      description: "List refurbished or new equipment via form or spreadsheet. You stay in control of pricing and visibility.",
      color: "green"
    },
    {
      number: "03",
      icon: FiEye,
      title: "Publish your listing", 
      description: "Set your fixed price and decide whether to accept offers. Clear, professional presentation for buyers.",
      color: "purple"
    },
    {
      number: "04",
      icon: FiCheck,
      title: "Close the deal",
      description: "Accept an offer or sell at your listed price. Arrange invoicing and shipping directly.",
      color: "orange"
    }
  ];

  const benefits = [
    {
      icon: FiDollarSign,
      title: "No commission fees",
      description: "Keep 100% of your profit"
    },
    {
      icon: FiShield,
      title: "Trusted B2B network",
      description: "Verified companies only"
    },
    {
      icon: FiUsers,
      title: "Offer-based negotiation",
      description: "Accept or counter offers"
    },
    {
      icon: FiSettings,
      title: "Full control over listings",
      description: "You set the terms"
    },
    {
      icon: FiGlobe,
      title: "Global access, local control",
      description: "Worldwide reach, your rules"
    },
    {
      icon: FiAward,
      title: "Verified company accounts only",
      description: "Professional network"
    }
  ];

  const faqs = [
    {
      question: "Can I join as an individual?",
      answer: "ReVend is designed for businesses and professionals in the IT equipment industry. You'll need to represent a company or operate as a registered business to join our platform."
    },
    {
      question: "How do I get verified?",
      answer: "After signing up, you'll submit your business documentation. Our verification team reviews your application within 24-48 hours. Once approved, you can start listing and buying immediately."
    },
    {
      question: "Can I list bulk inventory?",
      answer: "Absolutely! ReVend supports both individual items and bulk inventory listings. You can upload via spreadsheet or use our batch listing forms for large quantities."
    },
    {
      question: "How does pricing work?",
      answer: "You set your own prices. Choose between fixed pricing or accept offers. There are no commission fees - you keep 100% of your sale price."
    },
    {
      question: "What does ReVend cost?",
      answer: "ReVend operates on a subscription model with different tiers based on your listing volume and features needed. No commission fees are charged on sales."
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simplified Header - Just logo and CTA */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">revend.co</span>
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            {...fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Sell and source IT equipment, fast and direct — here's how it works
          </motion.h1>
          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Join the professional B2B marketplace where ITAD companies and brokers trade equipment efficiently. 
            No commissions, no middlemen, just direct deals.
          </motion.p>
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Create free account
              <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Four simple steps to start trading
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get up and running in minutes, not days. Our streamlined process gets you trading immediately.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative"
              >
                {/* Step connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-px h-24 bg-gray-300 transform translate-x-8 lg:translate-x-16"></div>
                )}
                
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-16 h-16 bg-${step.color}-100 rounded-xl flex items-center justify-center`}>
                      <SafeIcon icon={step.icon} className={`w-8 h-8 text-${step.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className={`inline-block px-3 py-1 bg-${step.color}-100 text-${step.color}-700 rounded-full text-sm font-medium mb-3`}>
                        Step {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/register"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start now - it's free
              <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why professionals choose ReVend
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for the IT equipment industry, with features that matter to your business.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={benefit.icon} className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <SafeIcon key={i} icon={FiStar} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8">
              "ReVend has transformed how we source and sell IT equipment. The direct access to verified buyers and sellers has increased our margins by 30%."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face"
                alt="Michael Chen"
                className="w-12 h-12 rounded-full"
              />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Michael Chen</div>
                <div className="text-gray-600">CEO, TechRefresh Solutions</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know to get started
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="border border-gray-200 rounded-lg"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  <SafeIcon
                    icon={openFaq === index ? FiChevronUp : FiChevronDown}
                    className="w-5 h-5 text-gray-500"
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to sell smarter? Join ReVend and list your first item today.
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of IT professionals who trust ReVend for their equipment trading needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Create free account
                <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                <SafeIcon icon={FiHelpCircle} className="mr-2 w-5 h-5" />
                Need help?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold">revend.co</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm">
            <p>© 2025 revend.co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;