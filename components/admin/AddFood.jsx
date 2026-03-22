import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/AdminDashboard.css";

const S = {
  headerCard: {
    background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    color: "#fff", padding: "24px 30px", borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)", marginBottom: "30px",
  },
  title: { margin: 0, fontSize: "2rem", fontWeight: 800 },
  subtitle: { margin: "8px 0 0 0", fontSize: "1rem", opacity: 0.9 },
  formCard: {
    background: "#fff", borderRadius: "16px", padding: "30px",
    boxShadow: "0 5px 25px rgba(0,0,0,.08)", border: "1px solid #f1f5f9"
  },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontWeight: 600, color: "#475569", fontSize: ".9rem" },
  input: {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "2px solid #e2e8f0", fontSize: ".95rem", transition: "all 0.2s",
    background: "#f8fafc"
  },
  btnPrimary: {
    width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700,
    fontSize: "1.05rem", cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
  },
  btnSecondary: {
    width: "100%", padding: "12px", background: "#f1f5f9", color: "#475569",
    border: "none", borderRadius: "10px", fontWeight: 700, marginTop: "12px",
    cursor: "pointer", transition: "all 0.2s"
  },
  tableCard: {
    background: "#fff", borderRadius: "16px", padding: "30px",
    boxShadow: "0 5px 25px rgba(0,0,0,.08)", border: "1px solid #f1f5f9",
    overflowX: "auto"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left", borderBottom: "2px solid #f1f5f9", color: "#64748b", fontWeight: 700, fontSize: ".85rem", textTransform: "uppercase" },
  td: { padding: "16px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", fontSize: ".95rem", verticalAlign: "middle" },
  macroChip: { background: "#f1f5f9", padding: "4px 8px", borderRadius: "8px", fontSize: ".8rem", fontWeight: 600, color: "#475569", marginRight: "6px" }
};

const AddFood = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    name: "", category: "", price: "", description: "", calories: "", proteins: "", fibers: "",
  });
  const [editFood, setEditFood] = useState(null);

  // Derive existing categories from the foods list to populate the datalist
  const existingCategories = [...new Set(foods.map(f => f.category).filter(Boolean))];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-foods");
      setFoods(res.data);
    } catch (error) {
      console.error("Failed to fetch foods", error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    const foodData = {
      name: newFood.name,
      category: newFood.category || "General",
      price: newFood.price,
      description: newFood.description,
      calories: newFood.calories || "0.0",
      proteins: newFood.proteins || "0.0",
      fibers: newFood.fibers || "0.0",
    };

    try {
      if (editFood) {
        await axios.put(`http://localhost:5000/update-food/${editFood.id}`, foodData);
        toast.success("Food updated successfully! ✨");
      } else {
        await axios.post("http://localhost:5000/add-food", foodData);
        toast.success("New dish added to menu! 🍽️");
      }
      fetchFoods();
      resetForm();
    } catch (error) {
      console.error("Failed to save food", error);
      toast.error("Failed to perfectly save food.");
    }
  };

  const handleEdit = (food) => {
    setEditFood(food);
    setNewFood({
      name: food.name,
      category: food.category,
      price: food.price,
      description: food.description,
      calories: food.calories || "",
      proteins: food.proteins || "",
      fibers: food.fibers || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`http://localhost:5000/delete-food/${id}`);
        fetchFoods();
        toast.success("Food deleted successfully.");
      } catch (error) {
        console.error("Failed to delete food", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  const resetForm = () => {
    setNewFood({ name: "", category: "", price: "", description: "", calories: "", proteins: "", fibers: "" });
    setEditFood(null);
  };

  return (
    <div className="admin-dashboard">
      <div style={S.headerCard}>
        <h1 style={S.title}>🍽️ Menu Management</h1>
        <p style={S.subtitle}>Add, categorize, and update dishes to populate the dynamic user menu.</p>
      </div>

      <div className="row">
        {/* Left Column: Form */}
        <div className="col-lg-4 mb-4">
          <div style={S.formCard}>
            <h3 style={{ marginBottom: "24px", color: "#1a1a2e", fontWeight: 800 }}>
              {editFood ? "✏️ Edit Dish" : "✨ Add New Dish"}
            </h3>
            
            <form onSubmit={handleAddOrUpdate}>
              <div style={S.inputGroup}>
                <label style={S.label}>Dish Name</label>
                <input
                  type="text" name="name" style={S.input}
                  value={newFood.name} onChange={handleChange}
                  placeholder="e.g. Garlic Butter Naan" required
                />
              </div>

              <div style={S.inputGroup}>
                <label style={S.label}>Category</label>
                {/* Datalist allows typing a custom category or selecting an existing one */}
                <input 
                  list="category-suggestions" name="category" style={S.input}
                  value={newFood.category} onChange={handleChange} 
                  placeholder="Select or type a category (e.g. South Indian, Desserts)" required 
                />
                <datalist id="category-suggestions">
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                  <option value="Starter" />
                  <option value="Main Course" />
                  <option value="Desserts" />
                  <option value="Beverages" />
                  <option value="South Indian" />
                  <option value="Italian" />
                  <option value="Fast Food" />
                </datalist>
                <small style={{ color: "#94a3b8", fontSize: ".8rem", marginTop: "6px", display: "block" }}>
                  This creates the beautiful Category boxes on the user's Home page!
                </small>
              </div>

              <div style={S.inputGroup}>
                <label style={S.label}>Price (₹)</label>
                <input
                  type="number" name="price" style={S.input}
                  value={newFood.price} onChange={handleChange}
                  placeholder="e.g. 250" required
                />
              </div>

              <div style={S.inputGroup}>
                <label style={S.label}>Description</label>
                <textarea
                  name="description" style={{ ...S.input, minHeight: "80px", resize: "vertical" }}
                  value={newFood.description} onChange={handleChange}
                  placeholder="A mouth-watering description..."
                />
              </div>

              {/* Nutritional Information (always visible now) */}
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
                <h6 style={{ color: "#475569", fontWeight: 700, marginBottom: "16px" }}>🍏 Nutritional Info (Optional)</h6>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Calories (kcal)</label>
                    <input type="number" name="calories" style={S.input} value={newFood.calories} onChange={handleChange} placeholder="0" />
                  </div>
                  <div>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Proteins (g)</label>
                    <input type="number" name="proteins" style={S.input} value={newFood.proteins} onChange={handleChange} placeholder="0" />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Fibers (g)</label>
                    <input type="number" name="fibers" style={S.input} value={newFood.fibers} onChange={handleChange} placeholder="0" />
                  </div>
                </div>
              </div>

              <button type="submit" style={S.btnPrimary}>
                {editFood ? "Update Dish" : "Add Dish to Menu"}
              </button>
              
              {editFood && (
                <button type="button" style={S.btnSecondary} onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="col-lg-8">
          <div style={S.tableCard}>
            <h4 style={{ marginBottom: "20px", color: "#1a1a2e", fontWeight: 800 }}>🧾 Current Menu Items</h4>
            {foods.length === 0 ? (
              <p style={{ color: "#64748b" }}>No foods added yet. Add one to see it here!</p>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Name &amp; Category</th>
                    <th style={S.th}>Price</th>
                    <th style={S.th}>Nutrition</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food.id}>
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: "#1e3a8a", marginBottom: "4px" }}>{food.name}</div>
                        <span style={{ fontSize: ".8rem", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "99px" }}>
                          {food.category}
                        </span>
                      </td>
                      <td style={S.td}><span style={{ fontWeight: 800 }}>₹{food.price}</span></td>
                      <td style={S.td}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {food.calories && food.calories !== "0.0" && <span style={S.macroChip}>🔥 {food.calories}</span>}
                          {food.proteins && food.proteins !== "0.0" && <span style={S.macroChip}>💪 {food.proteins}g</span>}
                        </div>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleEdit(food)} style={{ ...S.btnSecondary, marginTop: 0, padding: "8px 16px", flex: 1, color: "#2563eb", background: "rgba(37,99,235,.1)" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(food.id)} style={{ ...S.btnSecondary, marginTop: 0, padding: "8px 16px", flex: 1, color: "#dc2626", background: "rgba(220,38,38,.1)" }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
