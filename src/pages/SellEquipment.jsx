import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

const { FiUpload, FiX, FiDollarSign, FiPackage } = FiIcons;

const SellEquipment = () => {
  const { user } = useAuth();
  const { addProduct, categories } = useProducts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    price: '',
    quantity: '',
    location: '',
    description: '',
    specs: {}
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload to a cloud service
    const mockImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    setImages(prev => [...prev, ...mockImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        seller: user?.company || 'Your Company',
        image: images[0]?.url || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop'
      };

      await addProduct(newProduct);
      navigate('/marketplace');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSpecFields = () => {
    switch (formData.category) {
      case 'Desktops':
      case 'Laptops':
        return [
          { key: 'cpu', label: 'CPU', placeholder: 'Intel i5-10500' },
          { key: 'ram', label: 'RAM', placeholder: '16GB DDR4' },
          { key: 'storage', label: 'Storage', placeholder: '256GB SSD' },
          { key: 'gpu', label: 'GPU', placeholder: 'Integrated' }
        ];
      case 'Servers':
        return [
          { key: 'cpu', label: 'CPU', placeholder: '2x Intel Xeon' },
          { key: 'ram', label: 'RAM', placeholder: '64GB DDR4' },
          { key: 'storage', label: 'Storage', placeholder: '2TB SSD' },
          { key: 'raid', label: 'RAID', placeholder: 'RAID 10' }
        ];
      case 'Network Equipment':
        return [
          { key: 'ports', label: 'Ports', placeholder: '24 Port' },
          { key: 'speed', label: 'Speed', placeholder: 'Gigabit' },
          { key: 'type', label: 'Type', placeholder: 'Managed Switch' },
          { key: 'poe', label: 'PoE', placeholder: 'Yes/No' }
        ];
      case 'Components':
        return [
          { key: 'type', label: 'Type', placeholder: 'DDR4 ECC' },
          { key: 'speed', label: 'Speed', placeholder: '2666MHz' },
          { key: 'capacity', label: 'Capacity', placeholder: '32GB' },
          { key: 'form', label: 'Form Factor', placeholder: 'DIMM' }
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to sell equipment.</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Equipment</h1>
            <p className="text-gray-600">
              Reach thousands of verified buyers in our B2B marketplace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Dell OptiPlex 7090 Desktop"
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Condition</label>
                  <select
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="New York, NY"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Quantity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Price per Unit ($)</label>
                  <div className="relative">
                    <SafeIcon 
                      icon={FiDollarSign} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                    />
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="450.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Quantity Available</label>
                  <div className="relative">
                    <SafeIcon 
                      icon={FiPackage} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                    />
                    <input
                      type="number"
                      name="quantity"
                      required
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="25"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            {formData.category && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getSpecFields().map(field => (
                    <div key={field.key}>
                      <label className="form-label">{field.label}</label>
                      <input
                        type="text"
                        value={formData.specs[field.key] || ''}
                        onChange={(e) => handleSpecChange(field.key, e.target.value)}
                        className="form-input"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload product images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-primary cursor-pointer"
                  >
                    Choose Files
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map(image => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt="Product"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <textarea
                name="description"
                required
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Provide detailed information about your equipment, including condition, features, and any additional notes..."
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Listing...
                  </div>
                ) : (
                  'Create Listing'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SellEquipment;