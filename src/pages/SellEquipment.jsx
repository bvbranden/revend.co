import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import supabase from '../lib/supabase';

const { FiUpload, FiX, FiCamera, FiInfo } = FiIcons;

const SellEquipment = () => {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);

  // Form fields configuration
  const formFields = {
    basicInfo: [
      {
        name: "title",
        label: "Product Title",
        type: "text",
        required: true,
        placeholder: "Example: Dell Latitude E7450 - i7/16GB/512GB - Grade A"
      },
      {
        name: "category",
        label: "Device Category",
        type: "select",
        required: true,
        options: [
          "Laptop", "Desktop", "Monitor", "Server", "Mobile", "Tablet", "Other"
        ]
      },
      {
        name: "brand",
        label: "Brand",
        type: "select",
        required: true,
        options: [
          "Dell", "HP", "Lenovo", "Apple", "Microsoft", "Asus", "Acer", 
          "Samsung", "Toshiba", "Fujitsu", "Other"
        ]
      },
      {
        name: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "Example: Latitude E7450"
      }
    ],
    
    specifications: [
      {
        name: "cpu_type",
        label: "CPU Type",
        type: "select",
        required: true,
        options: [
          "Intel i3", "Intel i5", "Intel i7", "Intel i9", "Intel Xeon",
          "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Other"
        ]
      },
      {
        name: "ram_size",
        label: "RAM Size",
        type: "select",
        required: true,
        options: [
          "4GB", "8GB", "16GB", "32GB", "64GB", "128GB", "Other"
        ]
      },
      {
        name: "storage_type",
        label: "Storage Type",
        type: "select",
        required: true,
        options: [
          "SSD", "HDD", "NVMe", "eMMC"
        ]
      },
      {
        name: "storage_size",
        label: "Storage Size",
        type: "text",
        required: true,
        placeholder: "Example: 512GB"
      },
      {
        name: "screen_size",
        label: "Screen Size",
        type: "select",
        required: false,
        options: [
          "11\"", "12\"", "13\"", "14\"", "15.6\"", "17\"", "19\"", 
          "21\"", "24\"", "27\"", "32\"", "Other"
        ]
      }
    ],
    
    condition: [
      {
        name: "condition_grade",
        label: "Condition Grade",
        type: "select",
        required: true,
        options: [
          "A (Like New)",
          "B (Used - Minor Wear)",
          "C (Functional - Heavy Wear)",
          "D (For Parts)"
        ]
      },
      {
        name: "operating_system",
        label: "Operating System",
        type: "select",
        required: true,
        options: [
          "Windows 10 Home",
          "Windows 10 Pro",
          "Windows 11 Home",
          "Windows 11 Pro",
          "macOS",
          "ChromeOS",
          "Linux",
          "None"
        ]
      },
      {
        name: "coa_license_info",
        label: "COA/License Information",
        type: "select",
        required: true,
        options: [
          "Included",
          "Not included"
        ]
      },
      {
        name: "power_supply",
        label: "Power Supply/Charger",
        type: "select",
        required: true,
        options: [
          "Included",
          "Not included"
        ]
      },
      {
        name: "battery_health",
        label: "Battery Health",
        type: "select",
        required: false,
        options: [
          "80% or higher",
          "50-79%",
          "Below 50%",
          "Needs replacement",
          "Not applicable"
        ]
      }
    ],
    
    details: [
      {
        name: "functional_defects",
        label: "Functional Defects",
        type: "textarea",
        required: false,
        placeholder: "List any known defects or issues"
      },
      {
        name: "data_wipe",
        label: "Data Wipe Report",
        type: "select",
        required: true,
        options: [
          "Available",
          "Available on request",
          "Not available"
        ]
      }
    ],
    
    shipping: [
      {
        name: "packaging",
        label: "Packaging Type",
        type: "select",
        required: true,
        options: [
          "Original Box",
          "Custom Box",
          "Bubble Wrapped",
          "Other"
        ]
      },
      {
        name: "location",
        label: "Pickup Location",
        type: "text",
        required: true,
        placeholder: "City, Country"
      },
      {
        name: "shipping_details",
        label: "Shipping Details",
        type: "textarea",
        required: false,
        placeholder: "Additional shipping or pickup information"
      }
    ],
    
    pricing: [
      {
        name: "price",
        label: "Price (€)",
        type: "number",
        required: true,
        placeholder: "Enter price in euros"
      },
      {
        name: "quantity",
        label: "Quantity Available",
        type: "number",
        required: true,
        min: 1
      },
      {
        name: "availability",
        label: "Availability",
        type: "select",
        required: true,
        options: [
          "Ready Now",
          "Ships in 1-2 days",
          "Ships in 3-5 days",
          "Ships in 1-2 weeks"
        ]
      }
    ],
    
    terms: [
      {
        name: "warranty",
        label: "Warranty",
        type: "text",
        required: true,
        placeholder: "Example: 30-day DOA guarantee"
      },
      {
        name: "escrow_eligible",
        label: "Escrow Eligible",
        type: "select",
        required: true,
        options: [
          "Yes",
          "No"
        ]
      },
      {
        name: "preferred_region",
        label: "Preferred Buyer Region",
        type: "select",
        required: false,
        options: [
          "Worldwide",
          "EU only",
          "North America only",
          "Asia only",
          "Other"
        ]
      },
      {
        name: "custom_notes",
        label: "Additional Notes",
        type: "textarea",
        required: false,
        placeholder: "Any additional information about the product"
      }
    ]
  };

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    model: '',
    cpu_type: '',
    ram_size: '',
    storage_type: '',
    storage_size: '',
    screen_size: '',
    condition_grade: '',
    operating_system: '',
    coa_license_info: '',
    power_supply: '',
    battery_health: '',
    functional_defects: '',
    data_wipe: '',
    packaging: '',
    location: '',
    shipping_details: '',
    price: '',
    quantity: 1,
    availability: '',
    warranty: '',
    escrow_eligible: '',
    preferred_region: '',
    custom_notes: '',
    photos: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const uploadedImages = [...images];
      
      for (const file of files) {
        if (uploadedImages.length >= 10) {
          alert('Maximum 10 images allowed');
          break;
        }
        
        // Create unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        
        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from('revend-images')
          .upload(filePath, file);
          
        if (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('revend-images')
          .getPublicUrl(filePath);
          
        uploadedImages.push({
          url: publicUrl,
          path: filePath,
          type: uploadedImages.length === 0 ? 'overview' : 
                uploadedImages.length === 1 ? 'labels' : 'condition'
        });
      }
      
      setImages(uploadedImages);
    } catch (err) {
      setError('Error uploading images. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = async (index) => {
    try {
      const updatedImages = [...images];
      const image = updatedImages[index];
      
      // Remove from Supabase Storage if path exists
      if (image.path) {
        const { error } = await supabase.storage
          .from('revend-images')
          .remove([image.path]);
          
        if (error) {
          console.error('Error removing image:', error);
        }
      }
      
      // Remove from state
      updatedImages.splice(index, 1);
      setImages(updatedImages);
    } catch (err) {
      console.error('Error removing image:', err);
    }
  };

  const updateImageType = (index, type) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      type
    };
    setImages(updatedImages);
  };

  const renderFormSection = (section, fields) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{section}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(field => (
          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="form-label">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="form-input"
              >
                <option value="">Select {field.label}</option>
                {field.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                className="form-input"
                rows="3"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                className="form-input"
                min={field.min}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!user) {
        throw new Error('You must be logged in to sell equipment');
      }

      if (images.length === 0) {
        throw new Error('Please upload at least one image');
      }

      const productData = {
        ...formData,
        seller: user.company,
        seller_id: user.id,
        photos: images.map(img => img.url),
        created_at: new Date().toISOString(),
        specs: {
          cpu: formData.cpu_type,
          ram: formData.ram_size,
          storage: `${formData.storage_type} ${formData.storage_size}`,
          screen: formData.screen_size
        }
      };

      const newProduct = await addProduct(productData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error creating listing. Please try again.');
      console.error('Error creating product:', err);
    } finally {
      setIsLoading(false);
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
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <SafeIcon icon={FiIcons.FiCheck} className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Created Successfully!</h2>
          <p className="text-gray-600 mb-6">Your product has been successfully listed in the marketplace.</p>
          <p className="text-gray-500 mb-6">Redirecting to marketplace...</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sell Equipment</h1>
          <p className="text-gray-600 mt-2">List your IT equipment for sale to verified buyers</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderFormSection("Basic Information", formFields.basicInfo)}
          {renderFormSection("Technical Specifications", formFields.specifications)}
          {renderFormSection("Condition & Software", formFields.condition)}
          {renderFormSection("Additional Details", formFields.details)}
          
          {/* Images Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            <p className="text-gray-600 mb-4">Upload clear photos of your equipment (at least one required)</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <SafeIcon icon={FiCamera} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload product photos (up to 10)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-upload"
                disabled={isLoading || images.length >= 10}
              />
              <label
                htmlFor="photo-upload"
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  (isLoading || images.length >= 10) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <SafeIcon icon={FiUpload} className="mr-2 h-4 w-4" />
                {isLoading ? 'Uploading...' : 'Choose Photos'}
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Uploaded Photos ({images.length}/10)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative border rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={`Product photo ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-black bg-opacity-75 rounded p-2">
                          <p className="text-white text-sm mb-1">Photo type:</p>
                          <select
                            value={image.type || ''}
                            onChange={(e) => updateImageType(index, e.target.value)}
                            className="w-full text-sm bg-gray-800 text-white border-gray-700 rounded"
                          >
                            <option value="">Select type</option>
                            <option value="overview">Overview</option>
                            <option value="labels">Labels/Specs</option>
                            <option value="condition">Condition</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {image.type ? image.type.charAt(0).toUpperCase() + image.type.slice(1) : 'Unspecified'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {renderFormSection("Shipping Information", formFields.shipping)}
          {renderFormSection("Pricing & Availability", formFields.pricing)}
          {renderFormSection("Terms & Additional Information", formFields.terms)}
          
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Listing...
                </>
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellEquipment;