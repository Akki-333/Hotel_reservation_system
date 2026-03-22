import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/AdminDashboard.css";

const S = {
  headerCard: {
    background: "linear-gradient(135deg, #f093fb, #f5576c)",
    color: "#fff", padding: "24px 30px", borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(240, 147, 251, 0.3)", marginBottom: "30px",
  },
  title: { margin: 0, fontSize: "2rem", fontWeight: 800 },
  subtitle: { margin: "8px 0 0 0", fontSize: "1rem", opacity: 0.9 },
  formCard: {
    background: "#fff", borderRadius: "16px", padding: "40px",
    boxShadow: "0 5px 25px rgba(0,0,0,.08)", border: "1px solid #f1f5f9",
    maxWidth: "600px", margin: "0 auto"
  },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontWeight: 600, color: "#475569", fontSize: ".9rem" },
  input: {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "2px solid #e2e8f0", fontSize: ".95rem", transition: "all 0.2s",
    background: "#f8fafc", outline: "none"
  },
  select: {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "2px solid #e2e8f0", fontSize: ".95rem", transition: "all 0.2s",
    background: "#f8fafc", outline: "none", cursor: "pointer"
  },
  btnPrimary: {
    width: "100%", padding: "14px", background: "linear-gradient(135deg, #f093fb, #f5576c)",
    color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700,
    fontSize: "1.05rem", cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(240, 147, 251, 0.3)"
  }
};

const CouponCreation = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [reason, setReason] = useState("5_bookings");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/eligible-users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/create-coupon", {
        user_id: selectedUser,
        coupon_code: couponCode,
        discount,
        reason,
        expiry_date: expiryDate
      });
      
      const userObj = users.find(u => u.id.toString() === selectedUser.toString());
      toast.success(`Coupon successfully granted to ${userObj ? userObj.name : 'user'}! 🎁`);
      
      // Reset form
      setSelectedUser("");
      setCouponCode("");
      setDiscount("");
      setExpiryDate("");
    } catch (err) {
      const errorMsg = err.response?.data || "Failed to create coupon, Please try again";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="admin-dashboard">
      <div style={S.headerCard}>
        <h1 style={S.title}>🎁 Reward Center</h1>
        <p style={S.subtitle}>Generate special discount coupons to reward your loyal customers.</p>
      </div>

      <div style={S.formCard}>
        <h3 style={{ marginBottom: "24px", color: "#1a1a2e", fontWeight: 800, textAlign: "center" }}>
          Create & Assign Coupon
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={S.inputGroup}>
            <label style={S.label}>Target User</label>
            <select style={S.select} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
              <option value="">-- Choose a user --</option>
              {Array.isArray(users) && users.length > 0 ? (
                // Only select users who have more than 0 bookings ideally, but we'll show all eligible users fetched
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))
              ) : (
                <option disabled>No users available</option>
              )}
            </select>
          </div>

          <div style={S.inputGroup}>
            <label style={S.label}>Coupon Code</label>
            <input
              type="text" style={{ ...S.input, textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px" }}
              value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER50" required
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div style={S.inputGroup}>
                <label style={S.label}>Discount Percentage (%)</label>
                <input
                  type="number" style={S.input} min="1" max="100"
                  value={discount} onChange={(e) => setDiscount(e.target.value)}
                  placeholder="e.g. 15" required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div style={S.inputGroup}>
                <label style={S.label}>Expiry Date</label>
                <input
                  type="date" style={S.input}
                  value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div style={S.inputGroup}>
            <label style={S.label}>Reason for Reward</label>
            <select style={S.select} value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="5_bookings">5 Successful Bookings</option>
              <option value="promotion">Seasonal Promotion</option>
              <option value="loyalty">Loyalty Reward Program</option>
              <option value="special_offer">VIP Special Offer</option>
            </select>
          </div>

          <button type="submit" style={S.btnPrimary}>
            Generate & Assign Coupon
          </button>
        </form>
      </div>
    </div>
  );
};

export default CouponCreation;
