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
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products from Supabase
    const fetchProducts = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products_revend')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      }
      
      setIsLoading(false);
    };
    
    fetchProducts();
    
    // Subscribe to changes
    const productsSubscription = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products_revend' }, 
        (payload) => {
          // Refresh products when there's a change
          fetchProducts();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  const addProduct = async (product) => {
    const { data, error } = await supabase
      .from('products_revend')
      .insert([product])
      .select();
    
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
    
    // No need to manually update state as subscription will handle it
    return data[0];
  };

  const updateProduct = async (id, updates) => {
    const { error } = await supabase
      .from('products_revend')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    // No need to manually update state as subscription will handle it
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from('products_revend')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    // No need to manually update state as subscription will handle it
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