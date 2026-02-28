import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedRole = localStorage.getItem('role');

    if (storedIsLoggedIn === 'true' && storedUsername && storedRole) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setRole('');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    const initTranslate = () => {
      if (window.google && window.google.translate && document.getElementById('google_translate_element')) {
        if (!window._translateWidgetInitialized) {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'hi,ta,ml,te,kn,gu,mr,bn,pa,ur,fr,es,de,zh-CN,ja,ru,ar,it,pt', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
            'google_translate_element'
          );
          window._translateWidgetInitialized = true;
        }
      }
    };
    const id = setInterval(() => {
      initTranslate();
      if (window._translateWidgetInitialized) clearInterval(id);
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="layout-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-md custom-navbar sticky-top">
        <div className="container-fluid px-3 px-md-4">
          <button className="navbar-brand logo btn p-0 border-0" onClick={() => navigate('/')}>
            <img 
              src="https://th.bing.com/th/id/OIP.jGbcvExsAa9UWVd_nUHjPAHaH0?w=197&h=208&c=7&r=0&o=5&dpr=1.3&pid=1.7" 
              alt="Hotel Logo" 
              className="navbar-logo"
            />
            <span className="brand-text">Stay & Dine</span>
          </button>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink end to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-house-door me-1"></i> Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/hotels" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-building me-1"></i> Hotels
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/my-bookings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-calendar-check me-1"></i> My Bookings
                </NavLink>
              </li>

              {isLoggedIn && role === "admin" && (
                <li className="nav-item">
                  <NavLink to="/admin_dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="bi bi-speedometer2 me-1"></i> Admin
                  </NavLink>
                </li>
              )}

              {!isLoggedIn ? (
                <li className="nav-item">
                  <NavLink to="/login" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </NavLink>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <span className="nav-link">
                      <i className="bi bi-person-circle me-1"></i> Hello, {username}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn logout-btn" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-left me-1"></i> Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="translate-container">
        <div id="google_translate_element"></div>
      </div>

      {/* Main Content */}
      <main className="content fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="custom-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <h5>Stay & Dine</h5>
              <p>Reserve rooms and restaurant tables together — simple, elegant, seamless.</p>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><NavLink to="/" className="text-white text-decoration-none">Home</NavLink></li>
                <li><NavLink to="/hotels" className="text-white text-decoration-none">Hotels</NavLink></li>
                <li><NavLink to="/my-bookings" className="text-white text-decoration-none">My Bookings</NavLink></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact</h5>
              <p><i className="bi bi-envelope me-2"></i> staydine@booking.com</p>
              <p><i className="bi bi-phone me-2"></i> +91 3452345674</p>
            </div>
          </div>
          <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          <p className="mb-0">&copy; 2025 Hotel Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
