```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';

const { FiArrowRight, FiShield, FiTrendingUp, FiUsers, FiGlobe, FiDollarSign } = FiIcons;

// Hero variants
const heroVariants = {
  default: {
    headline: "The B2B Marketplace for IT Equipment",
    subheadline: "Connect with verified ITAD companies and brokers to buy and sell second-hand and new computer equipment efficiently and securely.",
    cta: {
      text: "Browse Marketplace",
      link: "/marketplace"
    },
    secondaryCta: {
      text: "Start Selling",
      link: "/sell"
    }
  },
  revenue: {
    headline: "Turn Your Surplus IT Equipment Into Revenue",
    subheadline: "Join thousands of companies trading IT equipment on the leading B2B marketplace for verified ITAD companies and brokers.",
    cta: {
      text: "Start Selling",
      link: "/sell"
    },
    secondaryCta: {
      text: "Learn More",
      link: "/pricing"
    }
  },
  trust: {
    headline: "Trade IT Equipment With Confidence",
    subheadline: "Your trusted marketplace for verified ITAD companies and brokers, ensuring secure and reliable IT equipment trading.",
    cta: {
      text: "Join Now",
      link: "/register"
    },
    secondaryCta: {
      text: "View Features",
      link: "/pricing"
    }
  },
  value: {
    headline: "Get Maximum Value for IT Equipment",
    subheadline: "Access the largest network of verified buyers and sellers in the IT equipment trading industry.",
    cta: {
      text: "Explore Marketplace",
      link: "/marketplace"
    },
    secondaryCta: {
      text: "Start Trading",
      link: "/register"
    }
  }
};

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);
  const [currentHeroVariant, setCurrentHeroVariant] = useState('default');

  const stats = [
    { label: 'Active Listings', value: '2,500+', icon: FiTrendingUp },
    { label: 'Verified Brokers', value: '150+', icon: FiUsers },
    { label: 'Countries', value: '25+', icon: FiGlobe },
    { label: 'Monthly Volume', value: '$2M+', icon: FiDollarSign }
  ];

  const features = [
    {
      icon: FiShield,
      title: 'Verified Sellers',
      description: 'All sellers are verified ITAD companies and certified brokers'
    },
    {
      icon: FiTrendingUp,
      title: 'Real-time Pricing',
      description: 'Get competitive market prices updated in real-time'
    },
    {
      icon: FiUsers,
      title: 'B2B Focus',
      description: 'Exclusively for business-to-business transactions'
    }
  ];

  // Variant selector component (only visible in development)
  const VariantSelector = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Hero Variants</h4>
        <div className="space-y-2">
          {Object.keys(heroVariants).map((variant) => (
            <button
              key={variant}
              onClick={() => setCurrentHeroVariant(variant)}
              className={`block w-full px-3 py-2 text-sm rounded-md ${
                currentHeroVariant === variant
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {heroVariants[currentHeroVariant].headline}
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {heroVariants[currentHeroVariant].subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                alt="IT Equipment"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Live Marketplace</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the components... */}
      
      {/* Variant Selector */}
      <VariantSelector />
    </div>
  );
};

export default Home;
```