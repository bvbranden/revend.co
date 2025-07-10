import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Initialize with mock data
    const mockProducts = [
      {
        id: '1',
        title: 'Dell OptiPlex 7090 Desktop',
        category: 'Desktops',
        condition: 'Refurbished',
        price: 450,
        quantity: 25,
        location: 'New York, NY',
        seller: 'TechRecycle Pro',
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop',
        specs: {
          cpu: 'Intel i5-10500',
          ram: '16GB DDR4',
          storage: '256GB SSD',
          gpu: 'Integrated'
        },
        description: 'High-quality refurbished Dell OptiPlex desktops, perfect for office environments.',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'HP ProBook 450 G8 Laptops',
        category: 'Laptops',
        condition: 'New',
        price: 650,
        quantity: 15,
        location: 'Los Angeles, CA',
        seller: 'Enterprise Solutions',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        specs: {
          cpu: 'Intel i7-1165G7',
          ram: '16GB DDR4',
          storage: '512GB SSD',
          gpu: 'Intel Iris Xe'
        },
        description: 'Brand new HP ProBook laptops with warranty. Bulk pricing available.',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Cisco Catalyst 2960 Switches',
        category: 'Network Equipment',
        condition: 'Used',
        price: 120,
        quantity: 40,
        location: 'Chicago, IL',
        seller: 'NetworkPro Recycling',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
        specs: {
          ports: '24 Port',
          speed: 'Gigabit',
          type: 'Managed Switch',
          poe: 'No'
        },
        description: 'Reliable Cisco switches, tested and certified. Perfect for small to medium networks.',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Server RAM DDR4 32GB Modules',
        category: 'Components',
        condition: 'Refurbished',
        price: 85,
        quantity: 100,
        location: 'Austin, TX',
        seller: 'Memory Masters',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
        specs: {
          type: 'DDR4 ECC',
          speed: '2666MHz',
          capacity: '32GB',
          form: 'DIMM'
        },
        description: 'High-quality server memory modules, fully tested and certified.',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Dell PowerEdge R740 Server',
        category: 'Servers',
        condition: 'Refurbished',
        price: 2500,
        quantity: 5,
        location: 'Miami, FL',
        seller: 'ServerHub Inc',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
        specs: {
          cpu: '2x Intel Xeon Silver',
          ram: '64GB DDR4',
          storage: '2TB SSD',
          raid: 'RAID 10'
        },
        description: 'Enterprise-grade server, perfect for data centers and virtualization.',
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        title: 'Graphics Cards GTX 1660 Ti',
        category: 'Components',
        condition: 'Used',
        price: 180,
        quantity: 30,
        location: 'Seattle, WA',
        seller: 'GPU Traders',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
        specs: {
          gpu: 'GTX 1660 Ti',
          memory: '6GB GDDR6',
          interface: 'PCIe 3.0',
          power: '120W'
        },
        description: 'Gaming graphics cards in good condition, tested and working perfectly.',
        createdAt: new Date().toISOString()
      }
    ];

    const mockCategories = [
      'Desktops',
      'Laptops',
      'Servers',
      'Components',
      'Network Equipment',
      'Storage',
      'Monitors',
      'Printers'
    ];

    setProducts(mockProducts);
    setCategories(mockCategories);
    setIsLoading(false);
  }, []);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
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
    searchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};