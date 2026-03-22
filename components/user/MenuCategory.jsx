import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

let StoreContext;
try {
  StoreContext = require("../Foods/StoreContext").StoreContext;
} catch {
  StoreContext = null;
}

const MenuCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const ctx = StoreContext ? React.useContext(StoreContext) : null;
  const food_list = ctx?.food_list || [];

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const decodedCategory = decodeURIComponent(category || "");
  const categoryFoods = food_list.filter(f => (f.category || "General") === decodedCategory);

  return (
    <div style={{ padding: "48px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{
          background: "transparent", color: "#64748b", fontWeight: 600, 
          fontSize: ".9rem", border: "none", cursor: "pointer", 
          marginBottom: "24px", display: "inline-flex", alignItems: "center", gap: "6px"
        }}
      >
        ← Back to Categories
      </button>

      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
          {decodedCategory} Menu
        </h1>
        <p style={{ color: "#64748b", fontSize: "1rem" }}>
          Explore our delicious offerings in the {decodedCategory} category.
        </p>
      </div>

      {categoryFoods.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🍽️</div>
          <p style={{ fontWeight: 600, fontSize: "1rem" }}>No dishes found in this category.</p>
        </div>
      ) : (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px"
        }}>
          {categoryFoods.map((item) => (
            <div key={item.food_id || item.id} className="food-card-modern" style={{
              background: "#fff", borderRadius: "16px", overflow: "hidden", 
              boxShadow: "0 4px 20px rgba(0,0,0,.07)", border: "1px solid #e2e8f0", 
              transition: "all 0.25s ease", display: "flex", flexDirection: "column"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.07)"; }}
            >
              <div style={{ height: "160px", overflow: "hidden", background: "#f1f5f9" }}>
                {item.food_image || item.image ? (
                  <img src={item.food_image || item.image} alt={item.food_name || item.name} 
                       style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                       onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.07)"}
                       onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1e3a8a, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                    🍴
                  </div>
                )}
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h4 style={{ fontSize: ".95rem", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                  {item.food_name || item.name}
                </h4>
                <p style={{ fontSize: ".8rem", color: "#64748b", marginBottom: "10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {item.food_desc || item.description || "Delicious item from our menu."}
                </p>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1e3a8a" }}>₹{item.food_price || item.price}</div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    {(item.food_calories || item.calories) && (
                      <span style={{ fontSize: ".7rem", padding: "2px 8px", background: "#f1f5f9", color: "#475569", borderRadius: "9999px", fontWeight: 500 }}>
                        🔥 {item.food_calories || item.calories} kcal
                      </span>
                    )}
                    {(item.food_proteins || item.proteins) && (
                      <span style={{ fontSize: ".7rem", padding: "2px 8px", background: "#f1f5f9", color: "#475569", borderRadius: "9999px", fontWeight: 500 }}>
                        💪 {item.food_proteins || item.proteins}g protein
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuCategory;
