import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

const { FiShoppingCart, FiHeart, FiMapPin, FiPackage, FiClock, FiInfo, FiMessageSquare, FiChevronLeft, FiChevronRight, FiCheck, FiCpu, FiHardDrive, FiServer, FiMonitor, FiBattery } = FiIcons;

const ProductDetail = () => {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInterested, setIsInterested] = useState(false);
  const [inquiry, setInquiry] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Get product from context
        const productData = getProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Product not found'}
          </h2>
          <Link to="/marketplace" className="text-blue-600 hover:text-blue-800">
            Return to marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Handle both individual listings and batch listings
  const isBatch = product.models_included || product.brands_included?.length > 0;
  const productTitle = product.title;
  const productDescription = product.description || '';
  const productCategory = product.category || product.device_category || 'Uncategorized';
  const productCondition = product.condition || product.condition_grade || 'Unknown';

  // Get the price display
  const productPrice = product.listing_price ? (
    product.listing_price.type === 'total' 
      ? `€${parseInt(product.listing_price.amount).toLocaleString()} total`
      : `€${parseInt(product.listing_price.amount).toLocaleString()} per unit`
  ) : `$${parseInt(product.price).toLocaleString()}`;

  // Get price per unit for batch listings
  const pricePerUnit = product.listing_price && product.listing_price.type === 'total' && product.quantity
    ? `€${(parseInt(product.listing_price.amount) / parseInt(product.quantity)).toFixed(2)}`
    : null;

  // Get the seller name with privacy consideration
  const sellerName = "Verified Seller"; // Replace any company name with "Verified Seller"

  // Get all images
  const images = product.photos && product.photos.length > 0 
    ? product.photos 
    : product.image 
      ? [product.image] 
      : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleInterestToggle = () => {
    if (!user) {
      // Use React Router navigation instead of window.location
      navigate('/login', { 
        state: { from: { pathname: `/product/${id}` } },
        replace: false 
      });
      return;
    }
    setIsInterested(!isInterested);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      // Use React Router navigation instead of window.location
      navigate('/login', { 
        state: { from: { pathname: `/product/${id}` } },
        replace: false 
      });
      return;
    }

    setSubmitting(true);
    try {
      // In a real implementation, this would send the inquiry to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Your inquiry has been sent! The seller will contact you soon.');
      setInquiry('');
      setShowInquiryForm(false);
    } catch (err) {
      console.error('Error sending inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      // Use React Router navigation instead of window.location
      navigate('/login', { 
        state: { from: { pathname: `/product/${id}` } },
        replace: false 
      });
      return;
    }
    setShowInquiryForm(true);
  };

  // Helper function to render specifications
  const renderSpecs = () => {
    if (isBatch) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.brands_included && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Brands</h4>
              <p className="mt-1">{product.brands_included.join(', ')}</p>
            </div>
          )}
          {product.cpu_types && product.cpu_types.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">CPU Types</h4>
              <p className="mt-1">{product.cpu_types.join(', ')}</p>
            </div>
          )}
          {product.ram_configuration && product.ram_configuration.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">RAM Configuration</h4>
              <ul className="mt-1 list-disc list-inside">
                {product.ram_configuration.map((ram, index) => (
                  <li key={index}>
                    {ram.size} ({ram.quantity} units)
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.storage_configuration && product.storage_configuration.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Storage Configuration</h4>
              <ul className="mt-1 list-disc list-inside">
                {product.storage_configuration.map((storage, index) => (
                  <li key={index}>
                    {storage.type} {storage.size} ({storage.quantity} units)
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.screen_sizes && product.screen_sizes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Screen Sizes</h4>
              <p className="mt-1">{product.screen_sizes.join(', ')}</p>
            </div>
          )}
        </div>
      );
    } else {
      // For individual products
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.specs && (
            <>
              {product.specs.cpu && (
                <div className="flex items-center">
                  <SafeIcon icon={FiCpu} className="w-5 h-5 mr-2 text-gray-400" />
                  <span>CPU: {product.specs.cpu}</span>
                </div>
              )}
              {product.specs.ram && (
                <div className="flex items-center">
                  <SafeIcon icon={FiServer} className="w-5 h-5 mr-2 text-gray-400" />
                  <span>RAM: {product.specs.ram}</span>
                </div>
              )}
              {product.specs.storage && (
                <div className="flex items-center">
                  <SafeIcon icon={FiHardDrive} className="w-5 h-5 mr-2 text-gray-400" />
                  <span>Storage: {product.specs.storage}</span>
                </div>
              )}
              {product.specs.screen && (
                <div className="flex items-center">
                  <SafeIcon icon={FiMonitor} className="w-5 h-5 mr-2 text-gray-400" />
                  <span>Screen: {product.specs.screen}</span>
                </div>
              )}
              {product.specs.battery && (
                <div className="flex items-center">
                  <SafeIcon icon={FiBattery} className="w-5 h-5 mr-2 text-gray-400" />
                  <span>Battery: {product.specs.battery}</span>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/marketplace" className="text-gray-500 hover:text-gray-700">Marketplace</Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{productTitle}</span>
            </li>
          </ol>
        </nav>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2 text-green-500" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-96">
              <img
                src={images[currentImageIndex]}
                alt={productTitle}
                className="w-full h-full object-contain"
              />
              {/* Image navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                  >
                    <SafeIcon icon={FiChevronLeft} className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                  >
                    <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              {/* Image count indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 flex-shrink-0 rounded border-2 ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {productCategory}
                </span>
                {isBatch && (
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    Batch
                  </span>
                )}
                <span className="text-sm text-gray-500">{productCondition}</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {productTitle}
              </h1>

              <div className="flex items-center text-gray-600 text-sm mb-4">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                {product.location || product.pickup_location || 'Unknown location'}
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-green-600">
                    {productPrice}
                  </span>
                  {pricePerUnit && (
                    <span className="block text-sm text-gray-500 mt-1">
                      Approx. {pricePerUnit} per unit
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiPackage} className="w-5 h-5 text-gray-500" />
                  <span>Qty: {product.quantity || 1}</span>
                  {isBatch && product.minimum_purchase && (
                    <span className="text-xs text-blue-600">
                      (Min. {product.minimum_purchase})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mb-6">
                <button
                  onClick={handleContactSeller}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                >
                  <SafeIcon icon={FiMessageSquare} className="w-5 h-5 mr-2" />
                  Contact Seller
                </button>
                <button
                  onClick={handleInterestToggle}
                  className={`p-3 rounded-lg border ${
                    isInterested 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <SafeIcon icon={FiHeart} className="w-5 h-5" />
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h2>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">S</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{sellerName}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 mr-1 text-green-500" />
                      Verified Seller
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            {showInquiryForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact the Seller</h2>
                <form onSubmit={handleInquirySubmit}>
                  <div className="mb-4">
                    <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="inquiry"
                      rows="4"
                      value={inquiry}
                      onChange={(e) => setInquiry(e.target.value)}
                      placeholder="I'm interested in this product. Is it still available?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowInquiryForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !inquiry.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {product.availability || 'Ready Now'}
                  </p>
                  {product.warranty && (
                    <p className="text-sm text-gray-600 mt-1">
                      Warranty: {product.warranty}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {productDescription || 'No description provided.'}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
              {renderSpecs()}
            </div>

            {/* Additional Details */}
            {(product.functional_defects || product.data_wipe || product.power_supplies || product.coa_license_info) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.functional_defects && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Known Issues</h4>
                      <p className="mt-1">{product.functional_defects}</p>
                    </div>
                  )}
                  {product.data_wipe && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Data Wipe</h4>
                      <p className="mt-1">{product.data_wipe}</p>
                    </div>
                  )}
                  {product.power_supplies && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Power Supplies</h4>
                      <p className="mt-1">{product.power_supplies}</p>
                    </div>
                  )}
                  {product.coa_license_info && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">License Information</h4>
                      <p className="mt-1">{product.coa_license_info}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shipping Info */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="space-y-4">
                {product.packaging && (
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiPackage} className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Packaging</p>
                      <p className="text-sm text-gray-600">{product.packaging}</p>
                    </div>
                  </div>
                )}
                {(product.location || product.pickup_location) && (
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup Location</p>
                      <p className="text-sm text-gray-600">{product.location || product.pickup_location}</p>
                    </div>
                  </div>
                )}
                {product.shipping_details && (
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiInfo} className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Shipping Details</p>
                      <p className="text-sm text-gray-600">{product.shipping_details}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleContactSeller}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
                >
                  <SafeIcon icon={FiMessageSquare} className="w-5 h-5 mr-2" />
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;