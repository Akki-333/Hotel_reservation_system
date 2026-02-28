<<<<<<< HEAD
import { Suspense, lazy } from "react";
=======
import React, { useState } from "react";
>>>>>>> 582d53178b9c52d03fc28acc69e0946b4777eaa5
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "../components/auth/Login";
import BookingForm from "../components/user/BookingForm";
import Layout from "../components/common/Layout";
<<<<<<< HEAD
const AdminDashboard = lazy(() => import("../components/admin/AdminDashboard"));
const TableManagement = lazy(() => import("../components/admin/TableManagement"));
const BranchManagement = lazy(() => import("../components/admin/BranchManagement"));
import Chatbot from "../components/common/ChatBot";
import AdminRoute from "../components/auth/AdminRoute";
const MyBookings = lazy(() => import("../components/user/MyBookings"));
const CouponCreation = lazy(() => import("../components/admin/CouponCreation"));
const AddFood = lazy(() => import("../components/admin/AddFood"));
const FoodOrder = lazy(() => import("../components/user/FoodOrder"));
const OrderSummary = lazy(() => import("../components/user/OrderSummary"));
import HomePage from "../components/user/Home";
import "./App.css";
const Hotels = lazy(() => import("../components/user/Hotels"));
=======
import AdminDashboard from "../components/admin/AdminDashboard";
import TableManagement from "../components/admin/TableManagement";
import BranchManagement from "../components/admin/BranchManagement";
import Chatbot from "../components/common/ChatBot";
import AdminRoute from "../components/auth/AdminRoute";
import MyBookings from "../components/user/MyBookings";
import CouponCreation from "../components/admin/CouponCreation";
import AddFood from "../components/admin/AddFood";
import FoodOrder from "../components/user/FoodOrder";
import OrderSummary from "../components/user/OrderSummary";
import HomePage from "../components/user/Home";
import "./App.css";
import Hotels from "../components/user/Hotels";
>>>>>>> 582d53178b9c52d03fc28acc69e0946b4777eaa5
import { ToastContainer } from "react-toastify";



const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
        <ToastContainer      />
<<<<<<< HEAD
          <Suspense fallback={<div>Loading...</div>}>
=======
>>>>>>> 582d53178b9c52d03fc28acc69e0946b4777eaa5
          <Routes>
         

            <Route path="/" element={<Layout><HomePage /></Layout>} />
            {/* <Route path="/admin_dashboard" element={ <Layout> <AdminDashboard /></Layout>} /> */}
            {/* <Route path="/admin_dashboard" element={isLoggedIn && userRole === 'admin' ? <Layout><AdminDashboard /></Layout> : <Navigate to="/login" />} /> */}
            <Route
  path="/admin_dashboard"
  element={
    <AdminRoute>
      <Layout>
        <AdminDashboard />
      </Layout>
    </AdminRoute>
  }
/>
            <Route path="/food-order" element={<Layout><FoodOrder /></Layout>}/>
            <Route path="/order-summary" element={<Layout><OrderSummary /></Layout>}/>
            <Route path="add-food" element={<Layout><AddFood/></Layout>}/>
            <Route path="/hotels" element={<Layout><Hotels /></Layout>} /> 
            <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
            <Route path="/booking-form" element={<Layout><BookingForm /></Layout>} />
            <Route path="/coupon-management" element={<Layout> <CouponCreation/></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/table-management" element={<Layout><TableManagement /></Layout>} />
            <Route path="/branch-management" element={<Layout><BranchManagement /></Layout>} />
          </Routes>
<<<<<<< HEAD
          </Suspense>
=======
>>>>>>> 582d53178b9c52d03fc28acc69e0946b4777eaa5
        </main>
        {/* <Chatbot/> */}
      </div>
    </Router>
  );
};

export default App;
