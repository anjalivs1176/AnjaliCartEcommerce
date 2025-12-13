import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './customer/components/Navbar/Navbar';
import customTheme from './Theme/customTheme';

// Customer pages
import Home from './customer/pages/Home/Home';
import Product from './customer/pages/Product/product';
import ProductDetails from './customer/pages/Page Details/ProductDetails';
import Review from './customer/pages/Review/Review';
import Cart from './customer/pages/Cart/Cart';
import Checkout from './customer/pages/Checkout/Checkout';
import Account from './customer/pages/Account/Account';
import Auth from './customer/pages/Auth/Auth';
import Wishlist from './customer/pages/Wishlist/Wishlist';
import PaymentSuccess from './customer/pages/Payment/PaymentSuccess';
import OrderDetails from './customer/pages/Account/OrderDetails';

// Seller pages
import BecomeSeller from './seller/Become Seller/BecomeSeller';
import SellerDashboard from './seller/SellerDashboard/SellerDashboard';
import SellerVerifyOTP from './seller/Pages/SellerVerifyOTP';

// Admin pages
import AdminDashboard from './admin/pages/Dashboard/AdminDashboard';

// Auth Wrapper
import RequireAuth from './component/RequireAuth';

function App() {
  const location = useLocation();

  // Hide navbar on admin & seller routes
  const hideNavbar =
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/become-seller') ||
    location.pathname.startsWith('/verify-seller') ||
    location.pathname.startsWith('/admin');

  return (
    <ThemeProvider theme={customTheme}>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ------------------- PUBLIC ROUTES ------------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/verify-seller/:email/:otp" element={<SellerVerifyOTP />} />

        {/* ------------------- PROTECTED ROUTES ------------------- */}
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />

        <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
        <Route path="/reviews/:productId" element={<RequireAuth><Review /></RequireAuth>} />

        <Route path="/products/:category" element={<Product />} />

        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />

        <Route
          path="/wishlist"
          element={
            <RequireAuth>
              <Wishlist />
            </RequireAuth>
          }
        />

        <Route
          path="/account/*"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />

        <Route path="/payment-success/:paymentOrderId" element={<PaymentSuccess />} />
        <Route path="/account/orders/:orderId" element={<OrderDetails />} />

        {/* ------------------- ADMIN PROTECTED ------------------- */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* ------------------- SELLER PROTECTED ------------------- */}
        <Route
          path="/seller/*"
          element={
            <RequireAuth>
              <SellerDashboard />
            </RequireAuth>
          }
        />

      </Routes>
    </ThemeProvider>
  );
}

export default App;
