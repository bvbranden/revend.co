import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const {
  FiInfo, FiHelpCircle, FiPlus, FiMinus, FiUpload, FiX, FiCamera,
  FiDollarSign, FiMapPin, FiPackage, FiSave, FiCalendar, FiClock, FiShield, FiCheck
} = FiIcons;

const BatchListingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form data state - simplified structure
  const [formData, setFormData] = useState({
    title: '',
    quantity: '',
    device_category: '',
    brands_included: [],
    models_included: [{ model: '', quantity: '' }],
    cpu_types: [],
    ram_configuration: [{ size: '', quantity: '' }],
    storage_configuration: [{ type: '', size: '', quantity: '' }],
    screen_sizes: [],
    condition_grade: '',
    operating_system: '',
    coa_license_info: '',
    power_supplies: '',
    battery_health: [{ condition: '', quantity: '' }],
    functional_defects: '',
    data_wipe_report: '',
    photos: [],
    packaging: '',
    shipping_details: '',
    pickup_location: '',
    listing_price: {
      type: 'total',
      amount: ''
    },
    minimum_purchase: '',
    availability: 'Ready Now',
    lead_time: '',
    warranty: '',
    escrow_eligible: false,
    preferred_buyer_region: [],
    custom_notes: ''
  });

  // Reference data
  const deviceCategories = ['Laptop', 'Desktop', 'Monitor', 'Server', 'Mobile', 'Tablet', 'Other'];
  const brandOptions = ['Dell', 'HP', 'Lenovo', 'Apple', 'Microsoft', 'Asus', 'Acer', 'Samsung', 'Toshiba', 'Fujitsu', 'Other'];
  const cpuOptions = ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'Intel Xeon', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Mixed'];
  const screenSizeOptions = ['11"', '12"', '13"', '14"', '15.6"', '17"', '19"', '21"', '24"', '27"', '32"', 'Other'];
  const conditionOptions = ['A (Like New)', 'B (Used - Minor Wear)', 'C (Functional - Heavy Wear)', 'D (For Parts)'];
  const osOptions = ['Windows 10 Home', 'Windows 10 Pro', 'Windows 11 Home', 'Windows 11 Pro', 'macOS', 'ChromeOS', 'Linux', 'None'];
  const coaOptions = ['Included', 'Not included', 'Mixed'];
  const chargerOptions = ['All included', 'Some included', 'None'];
  const batteryOptions = ['80% or higher', '50-79%', 'Below 50%', 'Needs replacement', 'Unknown'];
  const dataWipeOptions = ['Uploaded', 'Available on request', 'Not available'];
  const packagingOptions = ['Palletised', 'Boxed', 'Loose'];
  const regionOptions = ['EU only', 'North America only', 'Asia only', 'Worldwide', 'Benelux preferred', 'UK preferred', 'Other'];

  useEffect(() => {
    // Scroll to top when step changes
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Optimized input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Checkbox change handler
  const handleCheckboxChange = useCallback((e, array, item) => {
    const { checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, [array]: [...prev[array], item] };
      } else {
        return { ...prev, [array]: prev[array].filter(i => i !== item) };
      }
    });
  }, []);

  // Radio change handler
  const handleRadioChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Array item change handler
  const handleArrayItemChange = useCallback((array, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[array]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [array]: newArray };
    });
  }, []);

  // Add array item
  const addArrayItem = useCallback((array, template) => {
    setFormData(prev => ({
      ...prev,
      [array]: [...prev[array], { ...template }]
    }));
  }, []);

  // Remove array item
  const removeArrayItem = useCallback((array, index) => {
    setFormData(prev => {
      const newArray = [...prev[array]];
      newArray.splice(index, 1);
      return { ...prev, [array]: newArray };
    });
  }, []);

  // Price handlers
  const handlePriceTypeChange = useCallback((type) => {
    setFormData(prev => ({
      ...prev,
      listing_price: { ...prev.listing_price, type }
    }));
  }, []);

  const handlePriceAmountChange = useCallback((amount) => {
    setFormData(prev => ({
      ...prev,
      listing_price: { ...prev.listing_price, amount }
    }));
  }, []);

  // Availability handler
  const handleAvailabilityChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      availability: value,
      lead_time: value === 'Ready Now' ? '' : prev.lead_time
    }));
  }, []);

  // File upload handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      const uploadedPhotos = [...formData.photos];
      
      for (const file of files) {
        if (uploadedPhotos.length >= 10) {
          alert('Maximum 10 photos allowed');
          break;
        }

        // Create unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `batch-images/${fileName}`;

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

        uploadedPhotos.push({
          url: publicUrl,
          path: filePath,
          type: uploadedPhotos.length === 0 ? 'overview' : 
                uploadedPhotos.length === 1 ? 'labels' : 'condition'
        });
      }

      setFormData(prev => ({ ...prev, photos: uploadedPhotos }));
    } catch (err) {
      setError('Error uploading images. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoto = async (index) => {
    try {
      const photos = [...formData.photos];
      const photo = photos[index];

      // Remove from Supabase Storage
      if (photo.path) {
        const { error } = await supabase.storage
          .from('revend-images')
          .remove([photo.path]);

        if (error) {
          console.error('Error removing image:', error);
        }
      }

      // Remove from state
      photos.splice(index, 1);
      setFormData(prev => ({ ...prev, photos }));
    } catch (err) {
      console.error('Error removing photo:', err);
    }
  };

  const updatePhotoType = (index, type) => {
    const photos = [...formData.photos];
    photos[index] = { ...photos[index], type };
    setFormData(prev => ({ ...prev, photos }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    setError('');
    
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) {
          setError('Batch title is required');
          return false;
        }
        if (!formData.quantity || formData.quantity <= 0) {
          setError('Valid quantity is required');
          return false;
        }
        if (!formData.device_category) {
          setError('Device category is required');
          return false;
        }
        if (formData.brands_included.length === 0) {
          setError('At least one brand must be selected');
          return false;
        }
        return true;
      
      case 2:
        if (formData.models_included.length === 0 || formData.models_included.some(item => !item.model || !item.quantity)) {
          setError('Model information is incomplete');
          return false;
        }
        if (formData.cpu_types.length === 0) {
          setError('At least one CPU type must be selected');
          return false;
        }
        if (formData.ram_configuration.length === 0 || formData.ram_configuration.some(item => !item.size || !item.quantity)) {
          setError('RAM configuration is incomplete');
          return false;
        }
        if (formData.storage_configuration.length === 0 || formData.storage_configuration.some(item => !item.type || !item.size || !item.quantity)) {
          setError('Storage configuration is incomplete');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.condition_grade) {
          setError('Condition grade is required');
          return false;
        }
        if (!formData.coa_license_info) {
          setError('COA/License information is required');
          return false;
        }
        if (!formData.power_supplies) {
          setError('Power supply information is required');
          return false;
        }
        if (!formData.data_wipe_report) {
          setError('Data wipe report information is required');
          return false;
        }
        return true;
      
      case 4:
        if (formData.photos.length < 3) {
          setError('At least 3 photos are required');
          return false;
        }
        if (!formData.photos.some(photo => photo.type === 'overview')) {
          setError('An overview photo is required');
          return false;
        }
        if (!formData.photos.some(photo => photo.type === 'labels')) {
          setError('A labels photo is required');
          return false;
        }
        if (!formData.photos.some(photo => photo.type === 'condition')) {
          setError('A condition photo is required');
          return false;
        }
        return true;
      
      case 5:
        if (!formData.packaging) {
          setError('Packaging information is required');
          return false;
        }
        if (!formData.pickup_location) {
          setError('Pickup location is required');
          return false;
        }
        if (!formData.listing_price.amount) {
          setError('Price is required');
          return false;
        }
        if (!formData.minimum_purchase) {
          setError('Minimum purchase quantity is required');
          return false;
        }
        if (formData.availability !== 'Ready Now' && !formData.lead_time) {
          setError('Lead time is required');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    setError('');

    try {
      if (!user) {
        throw new Error('You must be logged in to create a listing');
      }

      const submissionData = {
        seller_id: user.id,
        title: formData.title,
        quantity: parseInt(formData.quantity),
        device_category: formData.device_category,
        brands_included: formData.brands_included,
        models_included: formData.models_included.filter(item => item.model && item.quantity),
        cpu_types: formData.cpu_types,
        ram_configuration: formData.ram_configuration.filter(item => item.size && item.quantity),
        storage_configuration: formData.storage_configuration.filter(item => item.type && item.size && item.quantity),
        screen_sizes: formData.screen_sizes,
        condition_grade: formData.condition_grade,
        operating_system: formData.operating_system,
        coa_license_info: formData.coa_license_info,
        power_supplies: formData.power_supplies,
        battery_health: formData.battery_health.filter(item => item.condition && item.quantity),
        functional_defects: formData.functional_defects,
        data_wipe_report: formData.data_wipe_report,
        photos: formData.photos.map(photo => photo.url),
        packaging: formData.packaging,
        shipping_details: formData.shipping_details,
        pickup_location: formData.pickup_location,
        listing_price: formData.listing_price,
        minimum_purchase: parseInt(formData.minimum_purchase),
        availability: formData.availability === 'Ready Now' ? 'Ready Now' : `Ships in ${formData.lead_time} days`,
        warranty: formData.warranty,
        escrow_eligible: formData.escrow_eligible,
        preferred_buyer_region: formData.preferred_buyer_region,
        custom_notes: formData.custom_notes
      };

      const { error } = await supabase
        .from('product_batches_revend')
        .insert([submissionData]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/marketplace');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error creating listing. Please try again.');
      console.error('Error submitting batch:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized components to prevent unnecessary re-renders
  const Tooltip = React.memo(({ text }) => (
    <div className="group relative">
      <SafeIcon icon={FiHelpCircle} className="ml-1 w-4 h-4 text-gray-400 cursor-help" />
      <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-64">
        {text}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
      </div>
    </div>
  ));

  const FormSection = React.memo(({ title, description, children }) => (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
        {title}
      </h2>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  ));

  const FormField = React.memo(({ label, tooltip, required = false, children }) => (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <label className="form-label flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
      </div>
      {children}
    </div>
  ));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to create a batch listing.</p>
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
            <SafeIcon icon={FiCheck} className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Listed Successfully!</h2>
          <p className="text-gray-600 mb-6">Your batch has been successfully listed in the marketplace.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Create Batch Listing</h1>
          <p className="text-gray-600 mt-2">List multiple devices as a single batch</p>
          
          {/* Progress Indicator */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium ${
                      currentStep > index + 1
                        ? 'bg-blue-600 text-white'
                        : currentStep === index + 1
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <div>Basic Info</div>
              <div>Specifications</div>
              <div>Condition</div>
              <div>Photos</div>
              <div>Shipping</div>
              <div>Terms</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection
                title="Basic Information"
                description="Provide the fundamental details about your hardware batch"
              >
                <FormField
                  label="Batch Title"
                  tooltip="Create a descriptive title for your batch that mentions key details like quantity, brands, and specifications"
                  required
                >
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. 45x Business Laptops – Dell, Lenovo, HP – i5/i7 Mixed"
                    className="form-input"
                    maxLength={100}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.title.length}/100 characters
                  </div>
                </FormField>

                <FormField
                  label="Quantity"
                  tooltip="The total number of devices included in this batch"
                  required
                >
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g. 45"
                    className="form-input"
                    min="1"
                  />
                </FormField>

                <FormField
                  label="Device Category"
                  tooltip="Select the main category of devices in this batch"
                  required
                >
                  <select
                    name="device_category"
                    value={formData.device_category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select category</option>
                    {deviceCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Brands Included"
                  tooltip="Select all hardware manufacturers included in this batch"
                  required
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {brandOptions.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`brand-${brand}`}
                          checked={formData.brands_included.includes(brand)}
                          onChange={(e) => handleCheckboxChange(e, 'brands_included', brand)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`brand-${brand}`} className="text-gray-700">{brand}</label>
                      </div>
                    ))}
                  </div>
                </FormField>
              </FormSection>
            </motion.div>
          )}

          {/* Step 2: Technical Specifications */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection
                title="Technical Specifications"
                description="Provide detailed specifications for the devices in this batch"
              >
                <FormField
                  label="Models Included"
                  tooltip="Specify which models are included and how many of each"
                  required
                >
                  {formData.models_included.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={item.model}
                        onChange={(e) => handleArrayItemChange('models_included', index, 'model', e.target.value)}
                        placeholder="Model (e.g. Dell Latitude E7450)"
                        className="form-input flex-grow"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleArrayItemChange('models_included', index, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="form-input w-20"
                        min="1"
                      />
                      {formData.models_included.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('models_included', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <SafeIcon icon={FiMinus} className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('models_included', { model: '', quantity: '' })}
                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                    <span>Add another model</span>
                  </button>
                </FormField>

                <FormField
                  label="CPU Types"
                  tooltip="Select all processor types included in the batch"
                  required
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cpuOptions.map(cpu => (
                      <div key={cpu} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`cpu-${cpu}`}
                          checked={formData.cpu_types.includes(cpu)}
                          onChange={(e) => handleCheckboxChange(e, 'cpu_types', cpu)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`cpu-${cpu}`} className="text-gray-700">{cpu}</label>
                      </div>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="RAM Configuration"
                  tooltip="Specify RAM sizes and how many devices have each configuration"
                  required
                >
                  {formData.ram_configuration.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={item.size}
                        onChange={(e) => handleArrayItemChange('ram_configuration', index, 'size', e.target.value)}
                        placeholder="RAM Size (e.g. 8GB)"
                        className="form-input flex-grow"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleArrayItemChange('ram_configuration', index, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="form-input w-20"
                        min="1"
                      />
                      {formData.ram_configuration.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('ram_configuration', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <SafeIcon icon={FiMinus} className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('ram_configuration', { size: '', quantity: '' })}
                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                    <span>Add another RAM configuration</span>
                  </button>
                </FormField>

                <FormField
                  label="Storage Configuration"
                  tooltip="Specify storage types, sizes and how many devices have each configuration"
                  required
                >
                  {formData.storage_configuration.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <select
                        value={item.type}
                        onChange={(e) => handleArrayItemChange('storage_configuration', index, 'type', e.target.value)}
                        className="form-input w-24"
                      >
                        <option value="">Type</option>
                        <option value="SSD">SSD</option>
                        <option value="HDD">HDD</option>
                        <option value="NVMe">NVMe</option>
                        <option value="eMMC">eMMC</option>
                      </select>
                      <input
                        type="text"
                        value={item.size}
                        onChange={(e) => handleArrayItemChange('storage_configuration', index, 'size', e.target.value)}
                        placeholder="Size (e.g. 256GB)"
                        className="form-input flex-grow"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleArrayItemChange('storage_configuration', index, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="form-input w-20"
                        min="1"
                      />
                      {formData.storage_configuration.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('storage_configuration', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <SafeIcon icon={FiMinus} className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('storage_configuration', { type: '', size: '', quantity: '' })}
                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                    <span>Add another storage configuration</span>
                  </button>
                </FormField>

                <FormField
                  label="Screen Size"
                  tooltip="Select all screen sizes included in the batch (if applicable)"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {screenSizeOptions.map(size => (
                      <div key={size} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`screen-${size}`}
                          checked={formData.screen_sizes.includes(size)}
                          onChange={(e) => handleCheckboxChange(e, 'screen_sizes', size)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`screen-${size}`} className="text-gray-700">{size}</label>
                      </div>
                    ))}
                  </div>
                </FormField>
              </FormSection>
            </motion.div>
          )}

          {/* Step 3: Condition & Software */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection
                title="Condition & Software"
                description="Provide details about the physical condition and software status"
              >
                <FormField
                  label="Condition Grade"
                  tooltip="Select the overall condition grade of the devices"
                  required
                >
                  <div className="space-y-2">
                    {conditionOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`condition-${option}`}
                          name="condition"
                          checked={formData.condition_grade === option}
                          onChange={() => handleRadioChange('condition_grade', option)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={`condition-${option}`} className="text-gray-700">{option}</label>
                      </div>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="Operating System"
                  tooltip="Select the operating system installed on the devices"
                >
                  <select
                    name="operating_system"
                    value={formData.operating_system}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select operating system</option>
                    {osOptions.map(os => (
                      <option key={os} value={os}>{os}</option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="COA or Licensing Info"
                  tooltip="Indicate whether software licensing or Certificate of Authenticity (COA) is included"
                  required
                >
                  <div className="space-y-2">
                    {coaOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`coa-${option}`}
                          name="coa"
                          checked={formData.coa_license_info === option}
                          onChange={() => handleRadioChange('coa_license_info', option)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={`coa-${option}`} className="text-gray-700">{option}</label>
                      </div>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="Power Supplies or Chargers"
                  tooltip="Indicate if power supplies or chargers are included with the devices"
                  required
                >
                  <div className="space-y-2">
                    {chargerOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`power-${option}`}
                          name="power"
                          checked={formData.power_supplies === option}
                          onChange={() => handleRadioChange('power_supplies', option)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={`power-${option}`} className="text-gray-700">{option}</label>
                      </div>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="Battery Health"
                  tooltip="For devices with batteries, provide information about battery health"
                >
                  {formData.battery_health.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <select
                        value={item.condition}
                        onChange={(e) => handleArrayItemChange('battery_health', index, 'condition', e.target.value)}
                        className="form-input flex-grow"
                      >
                        <option value="">Select battery condition</option>
                        {batteryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleArrayItemChange('battery_health', index, 'quantity', e.target.value)}
                        placeholder="Qty"
                        className="form-input w-20"
                        min="1"
                      />
                      {formData.battery_health.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('battery_health', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <SafeIcon icon={FiMinus} className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('battery_health', { condition: '', quantity: '' })}
                    className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                    <span>Add another battery condition</span>
                  </button>
                </FormField>

                <FormField
                  label="Functional Defects"
                  tooltip="List any known defects or issues with the devices"
                >
                  <textarea
                    name="functional_defects"
                    value={formData.functional_defects}
                    onChange={handleInputChange}
                    placeholder="e.g. 3 devices have broken screens, 5 devices have missing keys"
                    className="form-input"
                    rows="3"
                  />
                </FormField>

                <FormField
                  label="Blancco or Data Wipe Report"
                  tooltip="Indicate whether a data erasure report is available"
                  required
                >
                  <div className="space-y-2">
                    {dataWipeOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`wipe-${option}`}
                          name="data_wipe"
                          checked={formData.data_wipe_report === option}
                          onChange={() => handleRadioChange('data_wipe_report', option)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={`wipe-${option}`} className="text-gray-700">{option}</label>
                      </div>
                    ))}
                  </div>
                </FormField>
              </FormSection>
            </motion.div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection
                title="Photos"
                description="Upload clear photos of your equipment (minimum 3 photos required)"
              >
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Required photos:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                    <li>One overview photo showing the full batch</li>
                    <li>One close-up photo of labels/specifications</li>
                    <li>One photo showing the cosmetic condition</li>
                  </ul>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <SafeIcon icon={FiCamera} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload batch photos (up to 10)</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="photo-upload"
                      disabled={isLoading || formData.photos.length >= 10}
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        (isLoading || formData.photos.length >= 10) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <SafeIcon icon={FiUpload} className="mr-2 h-4 w-4" />
                      {isLoading ? 'Uploading...' : 'Choose Photos'}
                    </label>
                  </div>
                </div>

                {formData.photos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Uploaded Photos ({formData.photos.length}/10)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative border rounded-lg overflow-hidden">
                          <img
                            src={photo.url}
                            alt={`Batch photo ${index + 1}`}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                              >
                                <SafeIcon icon={FiX} className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="bg-black bg-opacity-75 rounded p-2">
                              <p className="text-white text-sm mb-1">Photo type:</p>
                              <select
                                value={photo.type || ''}
                                onChange={(e) => updatePhotoType(index, e.target.value)}
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
                            {photo.type ? photo.type.charAt(0).toUpperCase() + photo.type.slice(1) : 'Unspecified'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormSection>
            </motion.div>
          )}

          {/* Step 5: Shipping & Pricing */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection
                title="Shipping & Pricing"
                description="Provide details about packaging, location, and pricing"
              >
                <FormField
                  label="Packaging Type"
                  tooltip="Select how the equipment will be packaged for shipping"
                  required
                >
                  <div className="space-y-2">
                    {packagingOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`packaging-${option}`}
                          name="packaging"
                          checked={formData.packaging === option}
                          onChange={() => handleRadioChange('packaging', option)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={`packaging-${option}`} className="text-gray-700">{option}</label>
                      </div>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="Shipping Details"
                  tooltip="Provide any additional shipping information or restrictions"
                >
                  <textarea
                    name="shipping_details"
                    value={formData.shipping_details}
                    onChange={handleInputChange}
                    placeholder="e.g. Freight shipping only, Buyer arranges pickup, etc."
                    className="form-input"
                    rows="2"
                  />
                </FormField>

                <FormField
                  label="Pickup Location"
                  tooltip="Specify where the equipment is located for pickup or shipping"
                  required
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiMapPin} className="text-gray-400 absolute ml-3" />
                    <input
                      type="text"
                      name="pickup_location"
                      value={formData.pickup_location}
                      onChange={handleInputChange}
                      placeholder="e.g. Amsterdam, Netherlands"
                      className="form-input pl-10"
                    />
                  </div>
                </FormField>

                <FormField
                  label="Listing Price"
                  tooltip="Specify either the total batch price or price per unit"
                  required
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="price-total"
                          checked={formData.listing_price.type === 'total'}
                          onChange={() => handlePriceTypeChange('total')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="price-total" className="text-gray-700">Total batch price</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="price-unit"
                          checked={formData.listing_price.type === 'per_unit'}
                          onChange={() => handlePriceTypeChange('per_unit')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="price-unit" className="text-gray-700">Price per unit</label>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <SafeIcon icon={FiDollarSign} className="text-gray-400 absolute ml-3" />
                      <input
                        type="number"
                        value={formData.listing_price.amount}
                        onChange={(e) => handlePriceAmountChange(e.target.value)}
                        placeholder={formData.listing_price.type === 'total' ? 'e.g. 4500' : 'e.g. 100'}
                        className="form-input pl-10"
                        min="0"
                        step="0.01"
                      />
                      <span className="ml-2 text-gray-600">€</span>
                    </div>
                    {formData.listing_price.type === 'total' && formData.listing_price.amount && formData.quantity && (
                      <p className="text-sm text-gray-600">
                        Approximately €{(parseFloat(formData.listing_price.amount) / parseInt(formData.quantity)).toFixed(2)} per unit
                      </p>
                    )}
                    {formData.listing_price.type === 'per_unit' && formData.listing_price.amount && formData.quantity && (
                      <p className="text-sm text-gray-600">
                        Total batch value: €{(parseFloat(formData.listing_price.amount) * parseInt(formData.quantity)).toFixed(2)}
                      </p>
                    )}
                  </div>
                </FormField>

                <FormField
                  label="Minimum Purchase Quantity"
                  tooltip="Specify the minimum number of units that can be purchased"
                  required
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiPackage} className="text-gray-400 absolute ml-3" />
                    <input
                      type="number"
                      name="minimum_purchase"
                      value={formData.minimum_purchase}
                      onChange={handleInputChange}
                      placeholder="e.g. 10 (enter full batch quantity for 'all or nothing' sales)"
                      className="form-input pl-10"
                      min="1"
                      max={formData.quantity}
                    />
                  </div>
                  {formData.minimum_purchase && formData.quantity && formData.minimum_purchase == formData.quantity && (
                    <p className="text-sm text-blue-600 mt-1">Full batch purchase required</p>
                  )}
                </FormField>

                <FormField
                  label="Availability"
                  tooltip="Indicate when the equipment will be ready for shipping or pickup"
                  required
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="avail-ready"
                        checked={formData.availability === 'Ready Now'}
                        onChange={() => handleAvailabilityChange('Ready Now')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="avail-ready" className="text-gray-700">Ready Now</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="avail-lead"
                        checked={formData.availability === 'Lead Time'}
                        onChange={() => handleAvailabilityChange('Lead Time')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="avail-lead" className="text-gray-700">Lead Time Required</label>
                    </div>
                    {formData.availability === 'Lead Time' && (
                      <div className="flex items-center mt-2">
                        <SafeIcon icon={FiClock} className="text-gray-400 absolute ml-3" />
                        <input
                          type="number"
                          name="lead_time"
                          value={formData.lead_time}
                          onChange={handleInputChange}
                          placeholder="Number of days"
                          className="form-input pl-10"
                          min="1"
                        />
                        <span className="ml-2 text-gray-600">days</span>
                      </div>
                    )}
                  </div>
                </FormField>
              </FormSection>
            </motion.div>
          )}

          {/* Step 6: Terms & Additional Info */}
          {currentStep === 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormSection
                title="Terms & Additional Info"
                description="Specify warranty terms, buyer preferences, and additional notes"
              >
                <FormField
                  label="Warranty or DOA Guarantee"
                  tooltip="Specify your warranty terms or Dead-On-Arrival guarantee"
                  required
                >
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g. 14-day DOA guarantee or 3-month warranty"
                    className="form-input"
                  />
                </FormField>

                <FormField
                  label="Escrow Eligible"
                  tooltip="Indicate whether you accept payment through escrow service"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="escrow-eligible"
                      checked={formData.escrow_eligible}
                      onChange={(e) => setFormData(prev => ({ ...prev, escrow_eligible: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="escrow-eligible" className="text-gray-700">
                      Yes, I accept payment through escrow service
                    </label>
                    <SafeIcon icon={FiShield} className="text-blue-500 ml-1" />
                  </div>
                </FormField>

                <FormField
                  label="Preferred Buyer Region"
                  tooltip="Select your preferred regions for buyers"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {regionOptions.map(region => (
                      <div key={region} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`region-${region}`}
                          checked={formData.preferred_buyer_region.includes(region)}
                          onChange={(e) => handleCheckboxChange(e, 'preferred_buyer_region', region)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`region-${region}`} className="text-gray-700">{region}</label>
                      </div>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="Custom Notes"
                  tooltip="Add any additional information about your batch"
                >
                  <textarea
                    name="custom_notes"
                    value={formData.custom_notes}
                    onChange={handleInputChange}
                    placeholder="Additional details, grading method, internal references, etc."
                    className="form-input"
                    rows="4"
                  />
                </FormField>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                    <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2" />
                    Almost Done!
                  </h3>
                  <p className="text-blue-700 mb-2">
                    Please review all information before submitting. Once submitted, your batch listing will be visible to buyers in the marketplace.
                  </p>
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="confirm-terms"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="confirm-terms" className="ml-2 text-blue-700">
                      I confirm that the information provided is accurate and I agree to the{' '}
                      <a href="#" className="underline">Terms of Service</a>.
                    </label>
                  </div>
                </div>
              </FormSection>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} className="mr-2 h-5 w-5" />
                    Submit Listing
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchListingForm;