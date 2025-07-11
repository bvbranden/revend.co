import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';

const { FiArrowRight, FiShield, FiTrendingUp, FiUsers, FiGlobe, FiDollarSign, FiChevronLeft, FiChevronRight, FiEye, FiCpu, FiExternalLink, FiClock, FiPercent, FiUpload, FiLock, FiUnlock, FiBarChart3, FiMessageCircle } = FiIcons;

// Hero variants
const heroVariants = {
  default: {
    headline: "The B2B Marketplace for IT Equipment",
    subheadline: "Connect with verified ITAD companies and brokers to buy and sell second-hand and new computer equipment efficiently and securely.",
    cta: { text: "Browse Marketplace", link: "/marketplace" },
    secondaryCta: { text: "Start Selling", link: "/sell" },
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
  },
  revenue: {
    headline: "Turn Your Surplus IT Equipment Into Revenue",
    subheadline: "Join thousands of companies trading IT equipment on the leading B2B marketplace for verified ITAD companies and brokers.",
    cta: { text: "Start Selling", link: "/sell" },
    secondaryCta: { text: "Learn More", link: "/pricing" },
    image: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=600&h=400&fit=crop"
  },
  trust: {
    headline: "Trade IT Equipment With Confidence",
    subheadline: "Your trusted marketplace for verified ITAD companies and brokers, ensuring secure and reliable IT equipment trading.",
    cta: { text: "Join Now", link: "/register" },
    secondaryCta: { text: "View Features", link: "/pricing" },
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop"
  },
  value: {
    headline: "Get Maximum Value for IT Equipment",
    subheadline: "Access the largest network of verified buyers and sellers in the IT equipment trading industry.",
    cta: { text: "Explore Marketplace", link: "/marketplace" },
    secondaryCta: { text: "Start Trading", link: "/register" },
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop"
  }
};

function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);
  const [currentHeroVariant, setCurrentHeroVariant] = useState('default');
  const intervalRef = useRef(null);

  const resetInterval = () => {
    // Clear the existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Set a new interval
    intervalRef.current = setInterval(() => {
      const variantKeys = Object.keys(heroVariants);
      const currentIndex = variantKeys.indexOf(currentHeroVariant);
      const nextIndex = (currentIndex + 1) % variantKeys.length;
      setCurrentHeroVariant(variantKeys[nextIndex]);
    }, 15000);
  };

  useEffect(() => {
    // Set up the initial interval
    resetInterval();
    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentHeroVariant]);

  const stats = [
    { label: 'Active Listings', value: '2,500+', icon: FiTrendingUp },
    { label: 'Verified Brokers', value: '150+', icon: FiUsers },
    { label: 'Countries', value: '25+', icon: FiGlobe },
    { label: 'Monthly Volume', value: '$2M+', icon: FiDollarSign }
  ];

  const whyChooseFeatures = [
    {
      title: "Transparent Auctions",
      description: "Open, real-time price visibility between verified companies.",
      icon: FiEye
    },
    {
      title: "Tailored for IT Hardware",
      description: "Built for desktops, laptops, servers, phones, and parts.",
      icon: FiCpu
    },
    {
      title: "Verified Buyers & Sellers",
      description: "A professional network without spam or non-verified users.",
      icon: FiShield
    },
    {
      title: "Fast Turnaround",
      description: "Upload stock and close deals in days, not weeks.",
      icon: FiClock
    },
    {
      title: "No Sales Commission",
      description: "ReVend takes no cut from your sales — you keep the full margin.",
      icon: FiPercent
    },
    {
      title: "Batch Upload & CSV Support",
      description: "List bulk inventory with structured, scalable input.",
      icon: FiUpload
    },
    {
      title: "Private or Public Listings",
      description: "Control who sees your offers based on strategy.",
      icon: FiLock
    },
    {
      title: "Smart Deal History",
      description: "Access past pricing, offer behavior, and sale patterns.",
      icon: FiBarChart3
    },
    {
      title: "Built-in Communication",
      description: "Message verified users directly within the platform.",
      icon: FiMessageCircle
    }
  ];

  const goToPreviousVariant = () => {
    const variantKeys = Object.keys(heroVariants);
    const currentIndex = variantKeys.indexOf(currentHeroVariant);
    const prevIndex = currentIndex === 0 ? variantKeys.length - 1 : currentIndex - 1;
    setCurrentHeroVariant(variantKeys[prevIndex]);
    resetInterval(); // Reset the interval when manually changing slides
  };

  const goToNextVariant = () => {
    const variantKeys = Object.keys(heroVariants);
    const currentIndex = variantKeys.indexOf(currentHeroVariant);
    const nextIndex = (currentIndex + 1) % variantKeys.length;
    setCurrentHeroVariant(variantKeys[nextIndex]);
    resetInterval(); // Reset the interval when manually changing slides
  };

  const handleDotClick = (variant) => {
    setCurrentHeroVariant(variant);
    resetInterval(); // Reset the interval when manually changing slides
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentHeroVariant}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {heroVariants[currentHeroVariant].headline}
                </motion.h1>
                <motion.p
                  className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {heroVariants[currentHeroVariant].subheadline}
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link
                    to={heroVariants[currentHeroVariant].cta.link}
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center text-lg"
                  >
                    {heroVariants[currentHeroVariant].cta.text}
                    <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to={heroVariants[currentHeroVariant].secondaryCta.link}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center text-lg"
                  >
                    {heroVariants[currentHeroVariant].secondaryCta.text}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="relative hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${currentHeroVariant}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <img
                    src={heroVariants[currentHeroVariant].image}
                    alt="IT Equipment"
                    className="rounded-lg shadow-2xl w-full h-auto object-cover"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 font-medium">Live Marketplace</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Hero navigation controls - moved below the content */}
          <div className="flex justify-between items-center mt-12 px-4 mx-auto max-w-7xl">
            <button
              onClick={goToPreviousVariant}
              className="p-3 rounded-full bg-blue-800 bg-opacity-50 text-white hover:bg-opacity-75 transition-colors z-20"
              aria-label="Previous hero"
            >
              <SafeIcon icon={FiChevronLeft} className="w-6 h-6" />
            </button>

            {/* Variant indicator dots - moved to center */}
            <div className="flex space-x-4">
              {Object.keys(heroVariants).map((variant) => (
                <button
                  key={variant}
                  onClick={() => handleDotClick(variant)}
                  className={`w-4 h-4 rounded-full transition-colors cursor-pointer ${
                    currentHeroVariant === variant
                      ? 'bg-white scale-110 transform'
                      : 'bg-blue-200 bg-opacity-50 hover:bg-blue-100'
                  }`}
                  aria-label={`Switch to ${variant} hero`}
                  style={{
                    transition: 'all 0.3s ease',
                    padding: '0',
                    border: 'none',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            <button
              onClick={goToNextVariant}
              className="p-3 rounded-full bg-blue-800 bg-opacity-50 text-white hover:bg-opacity-75 transition-colors z-20"
              aria-label="Next hero"
            >
              <SafeIcon icon={FiChevronRight} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6"
              >
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={stat.icon} className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Revend.co Section */}
      <section className="why-choose-revend-section py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose Revend.co</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most trusted platform for IT equipment trading in the B2B market
            </p>
          </div>

          <div className="why-choose-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="why-choose-feature-block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <SafeIcon icon={feature.icon} className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses already trading IT equipment on revend.co
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center text-lg"
            >
              Create Account
              <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/marketplace"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors inline-flex items-center justify-center text-lg"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;