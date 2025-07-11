import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    'Desktops', 'Laptops', 'Servers', 'Network Equipment', 'Components', 'Mobile', 'Tablet', 'Monitor', 'Other'
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // First try to get regular product listings
        const { data: regularProducts, error: regularError } = await supabase
          .from('products_revend')
          .select('*')
          .order('created_at', { ascending: false });

        if (regularError && regularError.code !== 'PGRST116') {
          console.error('Error fetching regular products:', regularError);
        }
        
        // Then try to get batch listings
        const { data: batchProducts, error: batchError } = await supabase
          .from('product_batches_revend')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (batchError && batchError.code !== 'PGRST116') {
          console.error('Error fetching batch products:', batchError);
        }

        // Combine both types of products
        let allProducts = [];
        
        if (regularProducts && regularProducts.length > 0) {
          allProducts = [...regularProducts];
        }
        
        if (batchProducts && batchProducts.length > 0) {
          allProducts = [...allProducts, ...batchProducts];
        }

        // If we have real data, use it, otherwise fall back to mock data
        if (allProducts.length > 0) {
          setProducts(allProducts);
          
          // Collect all categories from both types of listings
          const regularCategories = regularProducts?.map(p => p.category) || [];
          const batchCategories = batchProducts?.map(p => p.device_category) || [];
          const uniqueCategories = [...new Set([...regularCategories, ...batchCategories])].filter(Boolean);
          
          if (uniqueCategories.length > 0) {
            setCategories(uniqueCategories);
          }
        } else {
          // Use mock data for demonstration
          const mockProducts = [
            {
              id: '1',
              title: 'Dell OptiPlex 7090 Desktop',
              category: 'Desktops',
              condition: 'Refurbished',
              price: 450,
              quantity: 25,
              location: 'New York, NY',
              description: 'High-performance desktop computers perfect for office environments.',
              specs: {
                cpu: 'Intel i5-10500',
                ram: '16GB DDR4',
                storage: '256GB SSD',
                gpu: 'Integrated'
              },
              seller: 'Tech Solutions Inc.',
              image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              title: 'HP EliteBook 840 G8',
              category: 'Laptops',
              condition: 'Used',
              price: 650,
              quantity: 15,
              location: 'San Francisco, CA',
              description: 'Professional laptops in excellent condition.',
              specs: {
                cpu: 'Intel i7-1165G7',
                ram: '16GB DDR4',
                storage: '512GB SSD',
                screen: '14" FHD'
              },
              seller: 'Computer Refresh Co.',
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: '3',
              title: 'Cisco Catalyst 2960X Switch',
              category: 'Network Equipment',
              condition: 'New',
              price: 1200,
              quantity: 8,
              location: 'Austin, TX',
              description: 'Brand new network switches with full warranty.',
              specs: {
                ports: '24 Port',
                speed: 'Gigabit',
                type: 'Managed Switch',
                poe: 'PoE+'
              },
              seller: 'Network Pro Solutions',
              image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
              createdAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
              id: '4',
              title: '45x Mixed Business Laptops - Dell, HP, Lenovo',
              device_category: 'Laptops',
              condition_grade: 'B (Used - Minor Wear)',
              quantity: 45,
              pickup_location: 'Amsterdam, Netherlands',
              description: 'Batch of 45 business laptops from various manufacturers. All tested and working.',
              brands_included: ['Dell', 'HP', 'Lenovo'],
              models_included: [
                { model: 'Dell Latitude E7450', quantity: '15' },
                { model: 'HP EliteBook 840 G5', quantity: '20' },
                { model: 'Lenovo ThinkPad T480', quantity: '10' }
              ],
              cpu_types: ['Intel i5', 'Intel i7'],
              ram_configuration: [
                { size: '8GB', quantity: '25' },
                { size: '16GB', quantity: '20' }
              ],
              storage_configuration: [
                { type: 'SSD', size: '256GB', quantity: '30' },
                { type: 'SSD', size: '512GB', quantity: '15' }
              ],
              listing_price: { type: 'total', amount: '18000' },
              minimum_purchase: '10',
              availability: 'Ready Now',
              warranty: '30-day DOA guarantee',
              seller: 'European IT Surplus GmbH',
              photos: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'],
              createdAt: new Date(Date.now() - 259200000).toISOString()
            }
          ];
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error('Error in fetchProducts:', error);
        // Set mock data on error
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Subscribe to changes
    const productsSubscription = supabase
      .channel('table-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products_revend' }, () => {
        fetchProducts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_batches_revend' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  const addProduct = async (product) => {
    try {
      // Determine if this is a batch listing or individual product
      const isBatch = product.models_included || product.brands_included?.length > 0;
      const tableName = isBatch ? 'product_batches_revend' : 'products_revend';
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([product])
        .select();

      if (error) {
        console.error(`Error adding ${isBatch ? 'batch' : 'product'}:`, error);
        throw error;
      }

      return data[0];
    } catch (error) {
      // If database fails, add to local state for demo
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      // Try updating a regular product first
      let { error } = await supabase
        .from('products_revend')
        .update(updates)
        .eq('id', id);

      // If not found, try updating a batch product
      if (error && error.code === 'PGRST116') {
        const { error: batchError } = await supabase
          .from('product_batches_revend')
          .update(updates)
          .eq('id', id);
          
        if (batchError) {
          console.error('Error updating product:', batchError);
          throw batchError;
        }
      } else if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    } catch (error) {
      // Update local state for demo
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Try deleting a regular product first
      let { error } = await supabase
        .from('products_revend')
        .delete()
        .eq('id', id);

      // If not found, try deleting a batch product
      if (error && error.code === 'PGRST116') {
        const { error: batchError } = await supabase
          .from('product_batches_revend')
          .delete()
          .eq('id', id);
          
        if (batchError) {
          console.error('Error deleting batch:', batchError);
          throw batchError;
        }
      } else if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    } catch (error) {
      // Remove from local state for demo
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  const searchProducts = (query, filters = {}) => {
    let filtered = products;

    if (query) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product =>
        (product.category === filters.category || product.device_category === filters.category)
      );
    }

    if (filters.condition) {
      filtered = filtered.filter(product =>
        (product.condition === filters.condition || product.condition_grade === filters.condition)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(product =>
        (product.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
         product.pickup_location?.toLowerCase().includes(filters.location.toLowerCase()))
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => {
        const price = product.price || 
                      (product.listing_price?.type === 'per_unit' ? parseFloat(product.listing_price.amount) : 
                       (parseFloat(product.listing_price?.amount || 0) / parseInt(product.quantity || 1)));
        return price >= parseFloat(filters.minPrice);
      });
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => {
        const price = product.price || 
                      (product.listing_price?.type === 'per_unit' ? parseFloat(product.listing_price.amount) : 
                       (parseFloat(product.listing_price?.amount || 0) / parseInt(product.quantity || 1)));
        return price <= parseFloat(filters.maxPrice);
      });
    }
    
    // Filter by listing type (batch or single)
    if (filters.isBatch === 'true') {
      filtered = filtered.filter(product => 
        product.models_included || product.brands_included?.length > 0
      );
    } else if (filters.isBatch === 'false') {
      filtered = filtered.filter(product => 
        !product.models_included && (!product.brands_included || product.brands_included.length === 0)
      );
    }

    return filtered;
  };

  const value = {
    products,
    categories,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};