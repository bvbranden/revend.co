import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiArrowRight, FiShield, FiTrendingUp, FiUsers, FiGlobe, FiDollarSign,
  FiChevronLeft, FiChevronRight, FiUser, FiUpload, FiClock, FiHandshake,
  FiAperture, FiDatabase, FiCheckCircle, FiZap, FiDollar, FiGrid,
  FiLock, FiBarChart2, FiMessageCircle
} = FiIcons;

const Home = () => {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);

  const heroSlides = [
    {
      title: "Trade IT Equipment with Confidence",
      description: "The leading B2B marketplace for ITAD companies and brokers to trade second-hand and new IT equipment efficiently and securely.",
      cta: "Get Started",
      ctaLink: "/register",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Auction Your IT Inventory",
      description: "Set your terms, create auctions, and sell to the highest bidder. Our transparent platform ensures fair pricing for hardware.",
      cta: "Sell Equipment",
      ctaLink: "/sell",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Verified Business Network",
      description: "Join our community of vetted ITAD companies, refurbishers, and IT brokers. Build trust and grow your business.",
      cta: "Join Network",
      ctaLink: "/register",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Secure Transactions & Escrow",
      description: "Trade with confidence using our secure payment system and escrow services. Every transaction is protected and verified.",
      cta: "Learn More",
      ctaLink: "/pricing",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const nextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setTimeout(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [currentHeroSlide, autoplay]);

  const handleIndicatorClick = (index) => {
    setCurrentHeroSlide(index);
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    setAutoplay(false);
  };

  const handleSliderHover = (isHovering) => {
    setAutoplay(!isHovering);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Stats Section
  const stats = [
    { value: "10K+", label: "IT Assets Listed", icon: FiDollarSign },
    { value: "500+", label: "Verified Companies", icon: FiUsers },
    { value: "€2.5M", label: "Monthly Trading Volume", icon: FiTrendingUp },
    { value: "12", label: "Countries Served", icon: FiGlobe }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden"
        onMouseEnter={() => handleSliderHover(true)}
        onMouseLeave={() => handleSliderHover(false)}
      >
        {/* Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 bg-white opacity-5 rounded-full w-96 h-96 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 bg-white opacity-5 rounded-full w-96 h-96 -ml-20 -mb-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 h-[600px] flex items-center relative">
          {/* Hero Slider */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Text Content */}
                <div className="order-2 lg:order-1">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    {heroSlides[currentHeroSlide].title}
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-100 mb-8">
                    {heroSlides[currentHeroSlide].description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={heroSlides[currentHeroSlide].ctaLink}
                      className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg transition-colors flex items-center"
                    >
                      {heroSlides[currentHeroSlide].cta}
                      <SafeIcon icon={FiArrowRight} className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                      to="/marketplace"
                      className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                    >
                      Browse Marketplace
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="order-1 lg:order-2">
                  <div className="relative">
                    <img
                      src={heroSlides[currentHeroSlide].image}
                      alt={heroSlides[currentHeroSlide].title}
                      className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Slider Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentHeroSlide === index ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <SafeIcon icon={FiChevronLeft} className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Next slide"
            >
              <SafeIcon icon={FiChevronRight} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={stat.icon} className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose revend.co
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built for professional IT asset trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiAperture,
                title: "Transparent Auctions",
                description: "Open, real-time bidding between verified companies — no hidden fees or price manipulation.",
                color: "blue"
              },
              {
                icon: FiDatabase,
                title: "Tailored for IT Hardware",
                description: "Built for desktops, laptops, servers, phones, and components — not general B2B trade.",
                color: "indigo"
              },
              {
                icon: FiCheckCircle,
                title: "Verified Buyers & Sellers",
                description: "Access a trusted network of vetted professionals — no noise, no spam, no amateurs.",
                color: "green"
              },
              {
                icon: FiZap,
                title: "Fast Turnaround",
                description: "List your stock in minutes and close deals within days — or even hours.",
                color: "yellow"
              },
              {
                icon: FiDollar,
                title: "No Sales Commission",
                description: "ReVend takes no cut from your successful sales. Your profit stays yours.",
                color: "emerald"
              },
              {
                icon: FiGrid,
                title: "Batch Upload & CSV Support",
                description: "Upload full inventories via spreadsheet — designed for recurring bulk workflows.",
                color: "purple"
              },
              {
                icon: FiLock,
                title: "Private or Public Auctions",
                description: "Choose who sees your auctions: keep it private or go public.",
                color: "rose"
              },
              {
                icon: FiBarChart2,
                title: "Smart Deal History",
                description: "Track performance, bidding behavior, and past prices to improve future listings.",
                color: "cyan"
              },
              {
                icon: FiMessageCircle,
                title: "Built-in Communication",
                description: "Message buyers and sellers directly — no need for third-party email or apps.",
                color: "orange"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="h-full bg-white rounded-xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="mb-6 relative">
                    {/* Icon container with dynamic color */}
                    <div className={`w-14 h-14 bg-${feature.color}-50 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110`}>
                      <SafeIcon
                        icon={feature.icon}
                        className={`w-7 h-7 text-${feature.color}-600`}
                      />
                    </div>
                    
                    {/* Decorative element */}
                    <div className={`absolute w-14 h-14 bg-${feature.color}-100 rounded-xl -z-10 top-2 left-2 opacity-50`}></div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of ITAD companies and brokers who trust revend.co for their equipment trading needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/marketplace"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how revend.co has transformed IT asset trading for businesses worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "revend.co has revolutionized how we source IT equipment. The verification process gives us confidence in every transaction.",
                author: "Sarah Johnson",
                company: "TechRefurb Solutions",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
              },
              {
                quote: "As an ITAD company, we've increased our sales volume by 40% since joining the platform. The auction system ensures we get fair market value.",
                author: "Michael Chen",
                company: "GreenIT Recycling",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
              },
              {
                quote: "The analytics tools have been invaluable for our pricing strategy. We can now make data-driven decisions about our inventory.",
                author: "Emma Rodriguez",
                company: "CircuitBridge Systems",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;