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
    'Desktops',
    'Laptops', 
    'Servers',
    'Network Equipment',
    'Components'
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products_revend')
          .select('*')
          .order('created_at', { ascending: false });

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching products:', error);
        }

        // Mock data for demonstration if no products in database
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
          }
        ];

        setProducts(data && data.length > 0 ? data : mockProducts);
        
        if (data && data.length > 0) {
          const uniqueCategories = [...new Set(data.map(product => product.category))];
          setCategories(uniqueCategories);
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
      .channel('products_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products_revend' 
      }, (payload) => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from('products_revend')
        .insert([product])
        .select();

      if (error) {
        console.error('Error adding product:', error);
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
      const { error } = await supabase
        .from('products_revend')
        .update(updates)
        .eq('id', id);

      if (error) {
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
      const { error } = await supabase
        .from('products_revend')
        .delete()
        .eq('id', id);

      if (error) {
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
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.condition) {
      filtered = filtered.filter(product => product.condition === filters.condition);
    }

    if (filters.location) {
      filtered = filtered.filter(product =>
        product.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice);
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