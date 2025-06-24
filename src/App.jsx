import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Navbar from './components/Navbar';
import Home from './components/Home'
import ProductsList from './components/ProductsList'
import OrdersList from './components/OrdersList'
import Cart from './components/Cart'
import Register from './components/Register'
import Login from './components/Login'
import OrderDetail from './components/OrderDetail'
import ProductDetail from './components/ProductDetail'
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AddProduct from './components/AddProduct';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersList /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
        <Route path="/products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
      </Routes>
    </>
      
  );
}

