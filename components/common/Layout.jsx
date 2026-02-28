import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // State to manage login status, username, and role
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

  return (
    <div className="layout-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-sm custom-navbar">
        <div className="container">
          <a className="navbar-brand logo" href="/">
            <img 
              src="https://th.bing.com/th/id/OIP.jGbcvExsAa9UWVd_nUHjPAHaH0?w=197&h=208&c=7&r=0&o=5&dpr=1.3&pid=1.7" 
              alt="Hotel Logo" 
              className="navbar-logo"
            />
            Restaurant table Booking
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Always visible links */}
              <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/hotels">Hotels</a></li>
              <li className="nav-item"><a className="nav-link" href="/my-bookings">My Bookings</a></li>
              {/* <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About Us</a></li> */}

              {/* Admin-only Dashboard */}
              {isLoggedIn && role === "admin" && (
                <li className="nav-item"><a className="nav-link" href="/admin_dashboard">Admin Dashboard</a></li>
              )}

              {/* Login/Logout */}
              {!isLoggedIn ? (
                <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
              ) : (
                <>
                  <li className="nav-item"><span className="nav-link">Hello, {username}</span></li>
                  <li className="nav-item">
                    <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="content">{children}</main>

      {/* Footer */}
      <footer className="custom-footer">
        <p>&copy; 2025 Hotel Booking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
 