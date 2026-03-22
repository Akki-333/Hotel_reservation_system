import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/AdminDashboard.css";

const S = {
  headerCard: {
    background: "linear-gradient(135deg, #11998e, #38ef7d)",
    color: "#fff", padding: "24px 30px", borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(17, 153, 142, 0.3)", marginBottom: "30px",
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
    background: "#f8fafc", outline: "none"
  },
  fileInput: {
    width: "100%", padding: "10px", borderRadius: "10px",
    border: "2px dashed #cbd5e1", background: "#f8fafc", cursor: "pointer",
    fontSize: ".9rem", color: "#64748b"
  },
  btnPrimary: {
    width: "100%", padding: "14px", background: "linear-gradient(135deg, #11998e, #38ef7d)",
    color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700,
    fontSize: "1.05rem", cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(17, 153, 142, 0.3)"
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
  td: { padding: "16px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", fontSize: ".95rem", verticalAlign: "top" }
};

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  
  // Add Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [homeImg, setHomeImg] = useState(null);
  const [hotelFrontImg, setHotelFrontImg] = useState(null);
  const [hotelImg, setHotelImg] = useState(null);
  const [hotelImg2, setHotelImg2] = useState(null);

  // Edit State
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    axios.get("http://localhost:5000/branches").then((res) => setBranches(res.data));
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("contactNo", contactNo);
    formData.append("description", description);

    if (homeImg) formData.append("home_img", homeImg);
    if (hotelFrontImg) formData.append("hotel_front_img", hotelFrontImg);
    if (hotelImg) formData.append("hotel_img", hotelImg);
    if (hotelImg2) formData.append("hotel_img2", hotelImg2);

    try {
      await axios.post("http://localhost:5000/branches", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Hotel Branch successfully added!");
      
      // Reset form
      setName(""); setLocation(""); setContactNo(""); setDescription("");
      setHomeImg(null); setHotelFrontImg(null); setHotelImg(null); setHotelImg2(null);
      
      // Reset file inputs visually
      document.querySelectorAll('input[type="file"]').forEach(el => el.value = "");
      fetchBranches();
    } catch (err) {
      toast.error("Failed to add hotel branch.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hotel profile entirely?")) {
      axios.delete(`http://localhost:5000/branches/${id}`).then(() => {
        toast.success("Hotel profile deleted.");
        fetchBranches();
      });
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editingBranch.name);
    formData.append("location", editingBranch.location);
    formData.append("contactNo", editingBranch.contactNo);
    formData.append("description", editingBranch.description);

    if (homeImg) formData.append("home_img", homeImg);
    if (hotelFrontImg) formData.append("hotel_front_img", hotelFrontImg);
    if (hotelImg) formData.append("hotel_img", hotelImg);
    if (hotelImg2) formData.append("hotel_img2", hotelImg2);

    try {
      await axios.put(`http://localhost:5000/branches/${editingBranch.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Hotel Profile updated successfully!");
      setEditingBranch(null);
      fetchBranches();
    } catch (err) {
      toast.error("Failed to update hotel profile.");
    }
  };

  return (
    <div className="admin-dashboard">
      <div style={S.headerCard}>
        <h1 style={S.title}>🏨 Hotel Profile Management</h1>
        <p style={S.subtitle}>Manage your hotel's core identity, location details, contact info, and gallery images.</p>
      </div>

      <div className="row">
        {/* Left Form */}
        <div className="col-xl-5 mb-4">
          <div style={S.formCard}>
            <h3 style={{ marginBottom: "24px", color: "#1a1a2e", fontWeight: 800 }}>
              {editingBranch ? "✏️ Edit Hotel Profile" : "✨ New Hotel Profile"}
            </h3>

            {editingBranch ? (
              <form onSubmit={handleUpdate}>
                <div style={S.inputGroup}>
                  <label style={S.label}>Hotel Name</label>
                  <input type="text" style={S.input} value={editingBranch.name} onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })} required />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Location / Address</label>
                  <input type="text" style={S.input} value={editingBranch.location} onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })} required />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Contact Number</label>
                  <input type="number" style={S.input} value={editingBranch.contactNo} onChange={(e) => setEditingBranch({ ...editingBranch, contactNo: e.target.value })} required />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Description summary</label>
                  <textarea style={{ ...S.input, minHeight: "80px" }} value={editingBranch.description} onChange={(e) => setEditingBranch({ ...editingBranch, description: e.target.value })} required />
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "20px", border: "1px dashed #cbd5e1" }}>
                  <h6 style={{ fontWeight: 700, color: "#475569", marginBottom: "12px" }}>📸 Update Gallery Images</h6>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Hero / Home Image</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHomeImg(e.target.files[0])} />
                  </div>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Front View Image</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHotelFrontImg(e.target.files[0])} />
                  </div>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Interior Image 1</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHotelImg(e.target.files[0])} />
                  </div>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Interior Image 2</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHotelImg2(e.target.files[0])} />
                  </div>
                </div>

                <button type="submit" style={S.btnPrimary}>Save Profile Changes</button>
                <button type="button" style={S.btnSecondary} onClick={() => setEditingBranch(null)}>Cancel</button>
              </form>
            ) : (
              <form onSubmit={handleAddBranch}>
                <div style={S.inputGroup}>
                  <label style={S.label}>Hotel Name</label>
                  <input type="text" style={S.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Stay & Dine Premium" required />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Location / Address</label>
                  <input type="text" style={S.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. 123 Paradise Ave" required />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Contact Number</label>
                  <input type="number" style={S.input} value={contactNo} onChange={(e) => setContactNo(e.target.value)} placeholder="e.g. 9876543210" required />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Description summary</label>
                  <textarea style={{ ...S.input, minHeight: "80px" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Experience luxury..." required />
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "20px", border: "1px dashed #cbd5e1" }}>
                  <h6 style={{ fontWeight: 700, color: "#475569", marginBottom: "12px" }}>📸 Upload Gallery Images</h6>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Hero / Home Image</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHomeImg(e.target.files[0])} required />
                  </div>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Front View Image</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHotelFrontImg(e.target.files[0])} required />
                  </div>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Interior Image 1</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHotelImg(e.target.files[0])} required />
                  </div>
                  <div style={S.inputGroup}>
                    <label style={{ ...S.label, fontSize: ".8rem" }}>Interior Image 2</label>
                    <input type="file" style={S.fileInput} onChange={(e) => setHotelImg2(e.target.files[0])} required />
                  </div>
                </div>

                <button type="submit" style={S.btnPrimary}>Create Hotel Profile</button>
              </form>
            )}
          </div>
        </div>

        {/* Right Table */}
        <div className="col-xl-7">
          <div style={S.tableCard}>
            <h4 style={{ marginBottom: "20px", color: "#1a1a2e", fontWeight: 800 }}>📋 Active Profiles</h4>
            {branches.length === 0 ? (
              <p style={{ color: "#64748b" }}>No hotel profiles generated.</p>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Hotel Info</th>
                    <th style={S.th}>Description</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map(branch => (
                    <tr key={branch.id}>
                      <td style={S.td}>
                        <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "1.1rem" }}>{branch.name}</div>
                        <div style={{ fontSize: ".85rem", color: "#475569", marginTop: "4px" }}>📍 {branch.location}</div>
                        <div style={{ fontSize: ".85rem", color: "#475569", marginTop: "2px" }}>📞 {branch.contactNo}</div>
                      </td>
                      <td style={S.td}>
                        <div style={{ fontSize: ".9rem", color: "#334155", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                          {branch.description}
                        </div>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <button onClick={() => handleEdit(branch)} style={{ ...S.btnSecondary, marginTop: 0, padding: "8px 16px", color: "#2563eb", background: "rgba(37,99,235,.1)" }}>Edit Profile</button>
                          <button onClick={() => handleDelete(branch.id)} style={{ ...S.btnSecondary, marginTop: 0, padding: "8px 16px", color: "#dc2626", background: "rgba(220,38,38,.1)" }}>Delete</button>
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

export default BranchManagement;
