import React from 'react';
import {HashRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {ProductProvider} from './contexts/ProductContext';
import {NotificationProvider} from './contexts/NotificationContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import SellEquipment from './pages/SellEquipment';
import BatchListingForm from './pages/BatchListingForm';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import DirectLogin from './pages/DirectLogin';
import AdminPromotion from './pages/AdminPromotion';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';
import CompanyVerification from './pages/admin/CompanyVerification';
import TransactionTracking from './pages/admin/TransactionTracking';
import SecurityControls from './pages/admin/SecurityControls';

// Styles
import './App.css';

// Layout wrapper component
const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSpecialRoute = location.pathname === '/direct-login' || location.pathname === '/admin-promotion';

  // Don't show header/footer/sidebar for special routes
  if (isSpecialRoute) {
    return (
      <Routes>
        <Route path="/direct-login" element={<DirectLogin />} />
        <Route path="/admin-promotion" element={<AdminPromotion />} />
      </Routes>
    );
  }

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex">
        {isAdminRoute && <AdminSidebar />}
        <main className={`flex-1 ${isAdminRoute ? 'ml-64' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/sell" element={<SellEquipment />} />
            <Route path="/batch-listing" element={<BatchListingForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/companies" element={<CompanyVerification />} />
            <Route path="/admin/companies/:id" element={<CompanyVerification />} />
            <Route path="/admin/transactions" element={<TransactionTracking />} />
            <Route path="/admin/security" element={<SecurityControls />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/direct-login" element={<DirectLogin />} />
              <Route path="/admin-promotion" element={<AdminPromotion />} />
              <Route path="/*" element={<Layout />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;