import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "../components/auth/Login";
import BookingForm from "../components/user/BookingForm";
import Layout from "../components/common/Layout";
import AdminRoute from "../components/auth/AdminRoute";
import HomePage from "../components/user/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const AdminDashboard = lazy(() => import("../components/admin/AdminDashboard"));
const TableManagement = lazy(() => import("../components/admin/TableManagement"));
const MyBookings = lazy(() => import("../components/user/MyBookings"));
const CouponCreation = lazy(() => import("../components/admin/CouponCreation"));
const AddFood = lazy(() => import("../components/admin/AddFood"));
const FoodOrder = lazy(() => import("../components/user/FoodOrder"));
const MenuCategory = lazy(() => import("../components/user/MenuCategory"));

const NotFound = () => (
  <div style={{
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    textAlign: "center",
    padding: "40px"
  }}>
    <div style={{ fontSize: "6rem", lineHeight: 1 }}>🏨</div>
    <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "#1e3a8a" }}>404</h1>
    <p style={{ fontSize: "1.2rem", color: "#64748b" }}>Oops! This page doesn't exist.</p>
    <a href="/" style={{
      padding: "12px 28px",
      background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
      color: "#fff",
      borderRadius: "10px",
      fontWeight: 600,
      textDecoration: "none"
    }}>Back to Home</a>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="flex-grow-1">
          <Suspense fallback={
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: "60vh", flexDirection: "column", gap: "16px"
            }}>
              <div style={{
                width: "48px", height: "48px", border: "4px solid #e2e8f0",
                borderTop: "4px solid #3b82f6", borderRadius: "50%",
                animation: "spin 0.8s linear infinite"
              }} />
              <p style={{ color: "#64748b", fontWeight: 500 }}>Loading…</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/admin_dashboard" element={
                <AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>
              } />
              <Route path="/food-order"       element={<Layout><FoodOrder /></Layout>} />
              <Route path="/add-food"         element={<Layout><AddFood /></Layout>} />
              <Route path="/menu/:category"   element={<Layout><MenuCategory /></Layout>} />
              <Route path="/my-bookings"      element={<Layout><MyBookings /></Layout>} />
              <Route path="/booking-form"     element={<Layout><BookingForm /></Layout>} />
              <Route path="/coupon-management" element={<Layout><CouponCreation /></Layout>} />
              <Route path="/login"            element={<Layout><Login /></Layout>} />
              <Route path="/table-management" element={<Layout><TableManagement /></Layout>} />
              <Route path="*"                 element={<Layout><NotFound /></Layout>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;
