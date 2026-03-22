import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn");
    if (stored === "true") {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem("username") || "");
      setRole(localStorage.getItem("role") || "");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    ["username", "isLoggedIn", "role", "userId"].forEach((k) =>
      localStorage.removeItem(k)
    );
    navigate("/login");
  };

  const firstLetter = username ? username[0].toUpperCase() : "U";

  const navItems = (
    <>
      <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
      <li><NavLink to="/booking-form" className={({ isActive }) => isActive ? "active" : ""}>Book a Table</NavLink></li>
      <li><NavLink to="/my-bookings" className={({ isActive }) => isActive ? "active" : ""}>My Bookings</NavLink></li>
      {isLoggedIn && role === "admin" && (
        <li><NavLink to="/admin_dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
      )}
      {isLoggedIn ? (
        <>
          <li className="nav-user-chip">
            <span className="nav-user-avatar">{firstLetter}</span>
            {username}
          </li>
          <li>
            <button className="nav-btn nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <li>
          <NavLink to="/login" className="nav-btn nav-login-btn">Login</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="layout-container">
      {/* ── NAVBAR ── */}
      <nav className={`custom-navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Brand */}
          <a href="/" className="navbar-brand-custom">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3373/3373165.png"
              alt="Hotel Logo"
              className="navbar-logo-img"
            />
            <span className="navbar-brand-text">
              Stay<span>&amp;Dine</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="nav-links">{navItems}</ul>

          {/* Hamburger */}
          <button
            className={`hamburger-btn${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile nav */}
        <ul className={`mobile-nav${menuOpen ? " open" : ""}`}>{navItems}</ul>
      </nav>

      {/* ── CONTENT ── */}
      <main className="content">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="custom-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <h3>Stay&amp;Dine 🏨</h3>
              <p>
                Premium hotel &amp; restaurant reservations — book your table,
                explore fine dining and exclusive rooms, all in one place.
              </p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/booking-form">Book a Table</a></li>
                <li><a href="/my-bookings">My Bookings</a></li>
                <li><a href="/login">Login / Register</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><a href="#">📞 +91 98765 43210</a></li>
                <li><a href="#">✉️ support@stayanddine.com</a></li>
                <li><a href="#">📍 Mumbai, India</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Stay&amp;Dine. All rights reserved.</span>
            <span className="footer-badge">🏆 Premium Hospitality</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;