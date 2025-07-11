import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';

const { FiFilter, FiGrid, FiList, FiMapPin, FiClock, FiPackage, FiInfo } = FiIcons;

const Marketplace = () => {
  const { products, categories, searchProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    isBatch: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let result = searchProducts(searchQuery, filters);

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, filters, sortBy, products]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      condition: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      isBatch: ''
    });
    setSearchQuery('');
  };

  const ProductCard = ({ product, isListView = false }) => {
    // Handle both individual listings and batch listings
    const isBatch = product.models_included || product.brands_included?.length > 0;
    const productTitle = product.title;
    const productDescription = product.description || '';
    const productCategory = product.category || product.device_category || 'Uncategorized';
    const productCondition = product.condition || product.condition_grade || 'Unknown';
    const productPrice = product.listing_price 
      ? (product.listing_price.type === 'total' 
         ? `€${product.listing_price.amount} total` 
         : `€${product.listing_price.amount} per unit`)
      : `$${product.price}`;
    
    // Get the image source
    const imageSource = product.photos && product.photos.length > 0 
      ? product.photos[0] 
      : product.image;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden ${isListView ? 'flex' : ''}`}
      >
        <img 
          src={imageSource} 
          alt={productTitle} 
          className={`object-cover ${isListView ? 'w-48 h-32' : 'w-full h-48'}`} 
        />
        
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">
            Discover quality IT equipment from verified sellers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-input"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="form-input"
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="A (Like New)">A (Like New)</option>
                <option value="B (Used - Minor Wear)">B (Used - Minor Wear)</option>
                <option value="C (Functional - Heavy Wear)">C (Functional - Heavy Wear)</option>
                <option value="D (For Parts)">D (For Parts)</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Used">Used</option>
              </select>
            </div>

            {/* Listing Type Filter */}
            <div>
              <select
                value={filters.isBatch}
                onChange={(e) => handleFilterChange('isBatch', e.target.value)}
                className="form-input"
              >
                <option value="">All Listings</option>
                <option value="true">Batch Listings</option>
                <option value="false">Single Items</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Price Range */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min €"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Max €"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {filteredProducts.length} results found
            </span>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiFilter} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;