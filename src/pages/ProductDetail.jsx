import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

const { FiMapPin, FiClock, FiUser, FiMessageCircle, FiHeart, FiShare2, FiCheck } = FiIcons;

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

  const images = [product.image, product.image, product.image]; // Mock multiple images

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
            <input
              type="text"
              className="form-input"
              defaultValue={user?.name || ''}
            />
          </div>
          <div>
            <label className="form-label">Company</label>
            <input
              type="text"
              className="form-input"
              defaultValue={user?.company || ''}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              defaultValue={user?.email || ''}
            />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
            />
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
            <li className="text-gray-900">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
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
                    alt={`${product.title} ${index + 1}`}
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
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <SafeIcon icon={FiHeart} className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <SafeIcon icon={FiShare2} className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
                  {product.location}
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                  Listed recently
                </div>
              </div>

              <div className="text-4xl font-bold text-green-600 mb-6">
                ${product.price}
                <span className="text-lg font-normal text-gray-600 ml-2">per unit</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Condition</label>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-900">{product.condition}</span>
                </div>
              </div>
              <div>
                <label className="form-label">Available Quantity</label>
                <span className="font-medium text-gray-900">{product.quantity} units</span>
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
                        min="1"
                        max={product.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="form-input"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="form-label">Total Price</label>
                      <div className="text-2xl font-bold text-green-600">
                        ${(product.price * quantity).toLocaleString()}
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