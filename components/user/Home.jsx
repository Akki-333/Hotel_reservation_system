import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import api from "../../src/config/api";

const SafeCategoryDisplay = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCat, setActiveCat] = React.useState("All");

  React.useEffect(() => {
    api.get("/get-foods")
      .then(res => { setFoods(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
      <div className="loader-dots"><span>.</span><span>.</span><span>.</span></div>
    </div>
  );

  if (foods.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", background: "#f8fafc", borderRadius: "24px" }}>
      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🍽️</div>
      <p style={{ fontWeight: 700 }}>Our chef is preparing the first menu.</p>
      <p style={{ fontSize: ".85rem" }}>Please check back in a few moments.</p>
    </div>
  );

  const categories = ["All", ...new Set(foods.map(f => f.category || "General").filter(Boolean))];
  const filtered = activeCat === "All" ? foods : foods.filter(f => (f.category || "General") === activeCat);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* ── CUISINE SELECETOR (Flex-box Ribbon) ── */}
      <div style={{ 
        display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px",
        scrollbarWidth: "none", "-ms-overflow-style": "none" 
      }} className="cuisine-ribbon">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={{
              padding: "12px 28px", borderRadius: "14px", border: "none", cursor: "pointer",
              fontWeight: 800, fontSize: ".9rem", transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
              background: activeCat === cat ? "#1e3a8a" : "#fff",
              color: activeCat === cat ? "#fff" : "#475569",
              boxShadow: activeCat === cat ? "0 10px 20px rgba(30,58,138,.2)" : "0 4px 12px rgba(0,0,0,.03)",
              border: `1.5px solid ${activeCat === cat ? "#1e3a8a" : "#e2e8f0"}`,
              whiteSpace: "nowrap"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── FOOD GRID (Dynamic Flex-Grid) ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px"
      }}>
        {filtered.map(item => (
          <div key={item.id} className="food-card-modern" style={{
            background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0",
            overflow: "hidden", display: "flex", flexDirection: "column",
            boxShadow: "0 10px 30px rgba(0,0,0,.04)", transition: "all 0.4s ease"
          }}>
            <div style={{ height: "200px", background: "#f1f5f9", position: "relative" }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                onError={e => e.target.src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400"} 
              />
              <div style={{ 
                position: "absolute", top: "12px", right: "12px", 
                background: "rgba(255,255,255,.9)", backdropFilter: "blur(4px)",
                padding: "4px 12px", borderRadius: "99px", fontWeight: 800, color: "#1e3a8a",
                fontSize: ".85rem", boxShadow: "0 4px 12px rgba(0,0,0,.1)"
              }}>
                ₹{item.price}
              </div>
            </div>
            <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>{item.name}</h4>
              <p style={{ fontSize: ".88rem", color: "#64748b", lineHeight: 1.6, marginBottom: "20px" }}>
                {item.description || "A signature specialty crafted with locally sourced fresh ingredients and premium spices."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FEATURES = [
  { icon: "🛎️", title: "Instant Dining", desc: "No more waiting. Book your perfect dining table in seconds directly." },
  { icon: "🍽️", title: "Premium Catalog", desc: "Explore 100+ gourmet dishes by cuisine type and chef's recommendation." },
  { icon: "🎟️", title: "Daily Rewards", desc: "Earn exclusive dining coupons and rewards on every successful booking." },
  { icon: "📱", title: "Private History", desc: "Strictly private access to your own bookings, timings, and status." },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="fade-in">
            <div className="home-hero-badge">✨ Luxury Table Reservation Platform</div>
            <h1>
              Discover & Reserve<br />
              <span className="highlight">Perfect Dining</span><br />
              Experiences
            </h1>
            <p>Experience the finest hospitality — book your table in seconds and browse our curated world-class menu catalog.</p>
            <div className="home-hero-buttons">
              <a href="/booking-form" className="hero-btn-primary">🍽️ Start Your Reservation</a>
            </div>
          </div>

          <div className="home-hero-visual slide-up">
            <div className="hero-img-card">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800"
                alt="Fine Dining"
              />
            </div>
            <div className="hero-stats-row">
              {[
                ["Stay&Dine", "Exclusive"],
                ["10k+", "Bookings"],
                ["4.9★", "Rating"],
              ].map(([num, label]) => (
                <div className="hero-stat" key={label}>
                  <div className="hero-stat-num">{num}</div>
                  <div className="hero-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE MENU ── */}
      <section className="home-food-section">
        <div className="home-food-inner">
          <div className="section-title" style={{ textAlign: "left", marginBottom: "40px" }}>
            <h2>🍴 Signature Menu Catalog</h2>
            <p>Filter by cuisine and discover your next favorite dish. All items ready for reservation.</p>
          </div>
          <SafeCategoryDisplay />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-features">
        <div className="home-features-inner">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
