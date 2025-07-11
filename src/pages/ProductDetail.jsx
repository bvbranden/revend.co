import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

const {
  FiMapPin,
  FiClock,
  FiUser,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiCheck,
  FiPackage,
  FiInfo,
  FiAlertCircle,
  FiShield,
  FiBriefcase,
  FiTruck,
  FiTag
} = FiIcons;

const ProductDetail = () => {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showContactForm, setShowContactForm] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/marketplace" className="btn-primary">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Determine if this is a batch listing or individual product
  const isBatch = product.models_included || product.brands_included?.length > 0;
  
  // Get images array from either source
  const images = product.photos || [product.image, product.image, product.image]; // Mock multiple images for regular listings
  
  // Get product details based on listing type
  const productTitle = product.title;
  const productCategory = product.category || product.device_category || 'Uncategorized';
  const productCondition = product.condition || product.condition_grade || 'Unknown';
  const productLocation = product.location || product.pickup_location || 'Unknown location';
  
  // Get price information
  const productPrice = product.listing_price 
    ? (product.listing_price.type === 'total' 
       ? parseFloat(product.listing_price.amount) 
       : parseFloat(product.listing_price.amount))
    : product.price;
  
  const isPricePerUnit = product.listing_price?.type === 'per_unit' || !isBatch;
  
  // Calculate minimum purchase
  const minPurchaseQty = product.minimum_purchase || 1;
  
  // Function to render batch-specific information
  const renderBatchInfo = () => {
    if (!isBatch) return null;
    
    return (
      <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <SafeIcon icon={FiPackage} className="w-5 h-5 mr-2 text-purple-600" />
          Batch Information
        </h2>
        
        {/* Brands Included */}
        {product.brands_included?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Brands Included:</h3>
            <div className="flex flex-wrap gap-2">
              {product.brands_included.map((brand, index) => (
                <span key={index} className="px-2 py-1 bg-white rounded-md border border-gray-200 text-sm">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Models Included */}
        {product.models_included?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Models Included:</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.models_included.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.model}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* CPU Types */}
        {product.cpu_types?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">CPU Types:</h3>
            <div className="flex flex-wrap gap-2">
              {product.cpu_types.map((cpu, index) => (
                <span key={index} className="px-2 py-1 bg-white rounded-md border border-gray-200 text-sm">
                  {cpu}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* RAM Configuration */}
        {product.ram_configuration?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">RAM Configuration:</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.ram_configuration.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.size}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Storage Configuration */}
        {product.storage_configuration?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Storage Configuration:</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.storage_configuration.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.size}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Additional Batch Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Software Information */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Software:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {product.operating_system && (
                <li className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                  OS: {product.operating_system}
                </li>
              )}
              {product.coa_license_info && (
                <li className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                  COA/License: {product.coa_license_info}
                </li>
              )}
              {product.data_wipe_report && (
                <li className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                  Data Wipe Report: {product.data_wipe_report}
                </li>
              )}
            </ul>
          </div>
          
          {/* Accessories & Physical Condition */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Hardware Condition:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {product.power_supplies && (
                <li className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                  Power Supplies: {product.power_supplies}
                </li>
              )}
              {product.functional_defects && (
                <li className="flex items-start">
                  <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-orange-500 mr-2 mt-0.5" />
                  <span>Known Defects: {product.functional_defects}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Battery Health */}
        {product.battery_health?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Battery Health:</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.battery_health.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.condition}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Function to render shipping and additional details
  const renderShippingInfo = () => {
    if (!isBatch) return null;
    
    return (
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <SafeIcon icon={FiTruck} className="w-5 h-5 mr-2 text-blue-600" />
          Shipping & Terms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shipping Details */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Shipping:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {product.packaging && (
                <li className="flex items-center">
                  <SafeIcon icon={FiPackage} className="w-4 h-4 text-blue-500 mr-2" />
                  Packaging: {product.packaging}
                </li>
              )}
              {product.shipping_details && (
                <li className="flex items-center">
                  <SafeIcon icon={FiInfo} className="w-4 h-4 text-blue-500 mr-2" />
                  Details: {product.shipping_details}
                </li>
              )}
              {product.availability && (
                <li className="flex items-center">
                  <SafeIcon icon={FiClock} className="w-4 h-4 text-blue-500 mr-2" />
                  Availability: {product.availability}
                </li>
              )}
            </ul>
          </div>
          
          {/* Terms */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Terms:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {product.warranty && (
                <li className="flex items-center">
                  <SafeIcon icon={FiShield} className="w-4 h-4 text-blue-500 mr-2" />
                  Warranty: {product.warranty}
                </li>
              )}
              {product.escrow_eligible !== undefined && (
                <li className="flex items-center">
                  <SafeIcon 
                    icon={product.escrow_eligible ? FiCheck : FiX} 
                    className={`w-4 h-4 ${product.escrow_eligible ? 'text-green-500' : 'text-red-500'} mr-2`} 
                  />
                  Escrow Eligible: {product.escrow_eligible ? 'Yes' : 'No'}
                </li>
              )}
              {product.preferred_buyer_region?.length > 0 && (
                <li className="flex items-center">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 text-blue-500 mr-2" />
                  Preferred Buyer Region: {product.preferred_buyer_region.join(', ')}
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Custom Notes */}
        {product.custom_notes && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <h3 className="text-md font-medium text-gray-800 mb-1">Seller Notes:</h3>
            <p className="text-sm text-gray-700">{product.custom_notes}</p>
          </div>
        )}
      </div>
    );
  };

  const ContactForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Seller</h3>
      <form className="space-y-4">
        <div>
          <label className="form-label">Message</label>
          <textarea
            rows="4"
            className="form-input"
            placeholder="Hi, I'm interested in your equipment. Could you provide more details?"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Your Name</label>
            <input type="text" className="form-input" defaultValue={user?.name || ''} />
          </div>
          <div>
            <label className="form-label">Company</label>
            <input type="text" className="form-input" defaultValue={user?.company || ''} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Email</label>
            <input type="email" className="form-input" defaultValue={user?.email || ''} />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input type="tel" className="form-input" />
          </div>
        </div>
        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex-1">
            Send Message
          </button>
          <button
            type="button"
            onClick={() => setShowContactForm(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link></li>
            <li>/</li>
            <li className="text-gray-900">{productTitle}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img src={images[selectedImage]} alt={productTitle} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productTitle} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {productCategory}
                  </span>
                  {isBatch && (
                    <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      Batch Listing
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <SafeIcon icon={FiHeart} className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <SafeIcon icon={FiShare2} className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productTitle}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                  {productLocation}
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                  Listed recently
                </div>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-6">
                {isPricePerUnit ? (
                  <>
                    €{productPrice} <span className="text-lg font-normal text-gray-600 ml-2">per unit</span>
                  </>
                ) : (
                  <>
                    €{productPrice} <span className="text-lg font-normal text-gray-600 ml-2">total</span>
                  </>
                )}
              </div>
            </div>

            {/* Product Details */}
            {!isBatch && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Condition & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Condition</label>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-900">{productCondition}</span>
                </div>
              </div>
              <div>
                <label className="form-label">Available Quantity</label>
                <span className="font-medium text-gray-900">{product.quantity || 1} units</span>
                {isBatch && minPurchaseQty > 1 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Minimum purchase: {minPurchaseQty} units
                  </p>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.seller}</h3>
                  <p className="text-sm text-gray-600">Verified ITAD Company</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                <span>Verified seller with 98% positive feedback</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {user ? (
                <>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        min={minPurchaseQty}
                        max={product.quantity || 1}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="form-input"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="form-label">Total Price</label>
                      <div className="text-2xl font-bold text-green-600">
                        €{(productPrice * quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    <SafeIcon icon={FiMessageCircle} className="w-5 h-5 mr-2" />
                    Contact Seller
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Please log in to contact the seller</p>
                  <Link to="/login" className="btn-primary">
                    Login to Contact
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Batch-specific information */}
        {renderBatchInfo()}
        
        {/* Shipping and Terms */}
        {renderShippingInfo()}

        {/* Description */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && user && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full">
              <ContactForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;