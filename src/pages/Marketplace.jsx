import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';

const { FiMapPin, FiPackage, FiGrid, FiList, FiFilter, FiSearch, FiX } = FiIcons;

const ProductCard = ({ product, isListView = false }) => {
  const navigate = useNavigate();
  
  const isBatch = product.models_included || product.brands_included?.length > 0;
  const productTitle = product.title;
  const productCategory = product.category || product.device_category || 'Uncategorized';
  const productCondition = product.condition || product.condition_grade || 'Unknown';
  const productPrice = product.listing_price ? (
    product.listing_price.type === 'total' 
      ? `€${product.listing_price.amount} total` 
      : `€${product.listing_price.amount} per unit`
  ) : `$${product.price}`;

  const imageSource = product.photos && product.photos.length > 0 
    ? product.photos[0] 
    : product.image;

  const handleNavigateToDetail = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden ${isListView ? 'flex' : ''}`}
    >
      <div 
        onClick={handleNavigateToDetail}
        className={`cursor-pointer ${isListView ? 'w-48 h-32' : 'w-full h-48'}`}
      >
        <img
          src={imageSource}
          alt={productTitle}
          className={`object-cover w-full h-full transition-transform duration-200 hover:scale-105`}
        />
      </div>
      
      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
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

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {productTitle}
        </h3>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-1" />
          {product.location || product.pickup_location || 'Unknown location'}
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-4">
          <SafeIcon icon={FiPackage} className="w-4 h-4 mr-1" />
          Qty: {product.quantity || 1}
          {isBatch && product.minimum_purchase && (
            <span className="ml-2 text-xs text-blue-600">
              (Min. {product.minimum_purchase})
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            {productPrice}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Marketplace = () => {
  const { products, categories, searchProducts } = useProducts();
  const [isListView, setIsListView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = searchProducts(searchTerm, {
    category: selectedCategory,
    condition: selectedCondition,
    minPrice: priceRange.min,
    maxPrice: priceRange.max
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCondition('');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">Browse and buy IT equipment from verified sellers</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SafeIcon icon={FiFilter} className="w-5 h-5 mr-2" />
                Filters
              </button>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setIsListView(false)}
                  className={`p-2 ${!isListView ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <SafeIcon icon={FiGrid} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsListView(true)}
                  className={`p-2 ${isListView ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <SafeIcon icon={FiList} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Any Condition</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="€"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="€"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className={isListView ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isListView={isListView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiPackage} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;