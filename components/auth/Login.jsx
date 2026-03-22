import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";
import api from "../../src/config/api";

const Login = () => {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [warnMessage, setWarnMessage] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [name, setName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") navigate("/");
  }, [navigate]);

  const clearWarn = () => setWarnMessage("");

  const handleLogin = async () => {
    clearWarn();
    if (!username || !password) {
      setWarnMessage("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/login", { username, password });
      if (data.success) {
        localStorage.setItem("username", username);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("role", data.role);
        localStorage.setItem("isLoggedIn", "true");
        toast.success(`Welcome back, ${username}! 👋`);
        setTimeout(() => {
          window.location.href = data.role === "admin" ? "/admin_dashboard" : "/";
        }, 600);
      } else {
        setWarnMessage(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setWarnMessage("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    clearWarn();
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name || !regUsername || !email || !phone || !dob || !regPassword || !confirmPassword) {
      setWarnMessage("All fields are required.");
      return;
    }
    if (!phoneRegex.test(phone)) {
      setWarnMessage("Phone must be exactly 10 digits.");
      return;
    }
    if (!emailRegex.test(email)) {
      setWarnMessage("Invalid email format (e.g. user@gmail.com).");
      return;
    }
    if (!passwordRegex.test(regPassword)) {
      setWarnMessage("Password: 8+ chars, uppercase, lowercase, number and special character.");
      return;
    }
    if (regPassword !== confirmPassword) {
      setWarnMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/register", {
        name, username: regUsername, email, phone, dob, password: regPassword,
      });
      if (data.success) {
        toast.success("Registration successful! Please log in. 🎉");
        setTab("login");
        setName(""); setRegUsername(""); setEmail(""); setPhone("");
        setDob(""); setRegPassword(""); setConfirmPassword("");
      } else {
        setWarnMessage(data.message || "Registration failed. Username/email may already exist.");
      }
    } catch {
      setWarnMessage("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <span className="field-icon" onClick={() => setShowPass((v) => !v)}>
      {showPass ? "🙈" : "👁️"}
    </span>
  );

  return (
    <div className="auth-page">
      {/* ── LEFT HERO ── */}
      <div className="auth-hero">
        <div className="auth-hero-icon">🏨</div>
        <h1>Welcome to <span>Stay&amp;Dine</span></h1>
        <p>
          Book premium hotel tables, explore curated menus and discover
          exclusive rooms — all in one seamless platform.
        </p>
        <div className="auth-hero-features">
          {[
            ["🛎️", "Instant table reservations"],
            ["🍽️", "Fine dining menus"],
            ["🎟️", "Exclusive member coupons"],
            ["📱", "Real-time booking updates"],
          ].map(([icon, text]) => (
            <div key={text} className="auth-hero-feature">
              <span className="auth-feature-icon">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner slide-up">
          {/* Tabs */}
          <div className="auth-toggle-tabs">
            <button
              className={`auth-tab${tab === "login" ? " active" : ""}`}
              onClick={() => { setTab("login"); clearWarn(); }}
            >Sign In</button>
            <button
              className={`auth-tab${tab === "register" ? " active" : ""}`}
              onClick={() => { setTab("register"); clearWarn(); }}
            >Create Account</button>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <h2>{tab === "login" ? "Sign in to your account" : "Create a new account"}</h2>
            <p>{tab === "login" ? "Enter your credentials below" : "Fill in the details below"}</p>
          </div>

          {/* Warning */}
          {warnMessage && (
            <div className="auth-alert warn">⚠️ {warnMessage}</div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <>
              <div className="form-field">
                <input
                  type="text"
                  id="login-username"
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <label htmlFor="login-username">Username</label>
              </div>
              <div className="form-field">
                <input
                  type={showPass ? "text" : "password"}
                  id="login-password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <label htmlFor="login-password">Password</label>
                <EyeIcon />
              </div>
              <button
                className="auth-submit-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <><span className="btn-spinner" /> Signing in…</> : "Sign In →"}
              </button>
              <div className="auth-divider">or</div>
              <p style={{ textAlign: "center", fontSize: ".88rem", color: "#64748b", marginTop: "8px" }}>
                Don't have an account?{" "}
                <button onClick={() => { setTab("register"); clearWarn(); }}
                  style={{ color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Register here
                </button>
              </p>
            </>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <>
              <div className="form-grid-2">
                <div className="form-field">
                  <input type="text" id="reg-name" placeholder=" " value={name} onChange={(e) => setName(e.target.value)} />
                  <label htmlFor="reg-name">Full Name</label>
                </div>
                <div className="form-field">
                  <input type="text" id="reg-username" placeholder=" " value={regUsername} onChange={(e) => setRegUsername(e.target.value)} />
                  <label htmlFor="reg-username">Username</label>
                </div>
              </div>
              <div className="form-field">
                <input type="email" id="reg-email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="reg-email">Email Address</label>
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <input type="tel" id="reg-phone" placeholder=" " value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <label htmlFor="reg-phone">Phone (10 digits)</label>
                </div>
                <div className="form-field">
                  <input type="date" id="reg-dob" placeholder=" " value={dob} onChange={(e) => setDob(e.target.value)} />
                  <label htmlFor="reg-dob" style={{ top: 0, fontSize: ".76rem", color: "#2563eb", fontWeight: 600 }}>Date of Birth</label>
                </div>
              </div>
              <div className="form-field">
                <input type={showPass ? "text" : "password"} id="reg-password" placeholder=" " value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                <label htmlFor="reg-password">Password</label>
                <EyeIcon />
              </div>
              <div className="form-field">
                <input type={showPass ? "text" : "password"} id="reg-confirm" placeholder=" " value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <label htmlFor="reg-confirm">Confirm Password</label>
              </div>
              <button
                className="auth-submit-btn"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? <><span className="btn-spinner" /> Creating account…</> : "Create Account →"}
              </button>
              <div className="auth-divider">or</div>
              <p style={{ textAlign: "center", fontSize: ".88rem", color: "#64748b", marginTop: "8px" }}>
                Already have an account?{" "}
                <button onClick={() => { setTab("login"); clearWarn(); }}
                  style={{ color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
