import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [warnMessage, setWarnMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      navigate("/");
    }
  }, [navigate]);

  // Open registration mode when visiting /login# (or any hash)
  useEffect(() => {
    if (location.hash) {
      setIsRegistering(true);
    }
  }, [location.hash]);

  const handleLogin = async () => {
    setWarnMessage("");
    setIsLoading(true);

    if (!username || !password) {
      setWarnMessage("Username and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      
      if (response.data.success) {
        localStorage.setItem("username", username);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("isLoggedIn", "true");

        toast.success("Login successful! 🎉");
        
        setTimeout(() => {
          if (response.data.role === "admin") {
            window.location.href = "/admin_dashboard";
          } else if (response.data.role === "user") {
            window.location.href = "/";
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setWarnMessage("");

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !dob ||
      !password ||
      !confirmPassword
    ) {
      setWarnMessage("All fields are required.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setWarnMessage("Phone number must be 10 digits.");
      return;
    }

    if (!emailRegex.test(email)) {
      setWarnMessage("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setWarnMessage(
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setWarnMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/register", {
        name,
        username,
        email,
        phone,
        dob,
        password,
      });

      if (response.data.success) {
        toast.success("Registration successful! Please login. 🎉");
        setIsRegistering(false);
        setName("");
        setUsername("");
        setEmail("");
        setPhone("");
        setDob("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="https://th.bing.com/th/id/OIP.jGbcvExsAa9UWVd_nUHjPAHaH0?w=197&h=208&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="Hotel Logo"
            className="logo"
          />
          <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
          <p>
            {isRegistering
              ? "Join us for an amazing experience"
              : "Sign in to continue to Stay & Dine"}
          </p>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {warnMessage && (
          <div className="error-message">
            <i className="bi bi-exclamation-circle"></i> {warnMessage}
          </div>
        )}

        <div className="login-form">
          {isRegistering ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="switch-mode">
                Already have an account?{" "}
                <a href="#" onClick={() => setIsRegistering(false)}>
                  Sign In
                </a>
              </p>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </span>
              </div>

              <div className="forgot-password">
                <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Forgot password feature coming soon!"); }}>
                  Forgot Password?
                </a>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="social-divider">
                <span>or continue with</span>
              </div>

              <div className="social-buttons">
                <button className="social-btn facebook">
                  <i className="bi bi-facebook"></i> Facebook
                </button>
                <button className="social-btn google">
                  <i className="bi bi-google"></i> Google
                </button>
              </div>

              <p className="switch-mode">
                Don't have an account?{" "}
                <a href="#" onClick={() => setIsRegistering(true)}>
                  Register Now
                </a>
              </p>
            </>
          )}

          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
