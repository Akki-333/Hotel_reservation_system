import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/AdminDashboard.css";

const S = {
  headerCard: {
    background: "linear-gradient(135deg, #eb3349, #f45c43)",
    color: "#fff", padding: "24px 30px", borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(235, 51, 73, 0.3)", marginBottom: "30px",
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
  select: {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "2px solid #e2e8f0", fontSize: ".95rem", transition: "all 0.2s",
    background: "#f8fafc", outline: "none", cursor: "pointer"
  },
  btnPrimary: {
    width: "100%", padding: "14px", background: "linear-gradient(135deg, #eb3349, #f45c43)",
    color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700,
    fontSize: "1.05rem", cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(235, 51, 73, 0.3)"
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
  statusBadge: (booked) => ({
    background: booked ? "rgba(239,68,68,.12)" : "rgba(16,185,129,.12)",
    color: booked ? "#dc2626" : "#059669",
    padding: "6px 12px", borderRadius: "9999px",
    fontSize: ".75rem", fontWeight: 700, whiteSpace: "nowrap"
  })
};

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]);

  // Form State
  const [tableName, setTableName] = useState("");
  const [price, setPrice] = useState("");
  const [tableType, setTableType] = useState("2-pair");
  const [booked] = useState(false);

  // Edit State
  const [editTable, setEditTable] = useState(null);
  const [editTableName, setEditTableName] = useState("");
  const [editBookedStatus, setEditBookedStatus] = useState(false);

  useEffect(() => {
    fetchTables();
    fetchBranches();
  }, []);

  const fetchTables = () => {
    axios.get("http://localhost:5000/tables")
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Error fetching tables:", err));
  };

  const fetchBranches = () => {
    axios.get("http://localhost:5000/branches")
      .then((res) => {
        setBranches(res.data);
        if (res.data && res.data.length > 0) {
          // Auto-select the first branch for single-hotel mode
          setBranchId(res.data[0].id);
        }
      })
      .catch((err) => console.error("Error fetching branches:", err));
  };

  const getChairCount = (type) => {
    if (type === "2-pair") return 2;
    if (type === "4-pair") return 4;
    if (type === "8-pair") return 8;
    return 2;
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!branchId) {
      toast.error("Critical System Error: No branch ID found. Make sure the database has at least one restaurant branch initialized.");
      return;
    }
    if (!tableName) {
      toast.warning("Please enter a Table Name!");
      return;
    }

    const chairCount = getChairCount(tableType);
    const chairsList = Array.from({ length: chairCount }, (_, i) => i + 1);

    axios.post("http://localhost:5000/tables", {
      branch_id: branchId,
      table_name: tableName,
      booked,
      table_type: tableType,
      chair_count: chairCount,
      chairs_list: chairsList,
      price: price || 0
    })
      .then(() => {
        fetchTables();
        setTableName("");
        setTableType("2-pair");
        setPrice("");
        toast.success("Table created successfully! 🪑");
      })
      .catch((err) => {
        toast.error(err.response?.data || "Failed to add table");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this table?")) {
      axios.delete(`http://localhost:5000/tables/${id}`).then(() => {
        setTables((prev) => prev.filter((table) => table.id !== id));
        toast.success("Table removed.");
      }).catch(() => toast.error("Failed to delete table."));
    }
  };

  const handleEdit = (table) => {
    setEditTable(table);
    setEditTableName(table.table_name);
    setEditBookedStatus(Boolean(table.booked));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/tables/${editTable.id}`, {
      table_name: editTableName,
      booked: editBookedStatus,
    })
      .then(() => {
        fetchTables();
        setEditTable(null);
        toast.success("Table updated!");
      })
      .catch((err) => console.error("Error updating:", err));
  };

  return (
    <div className="admin-dashboard">
      <div style={S.headerCard}>
        <h1 style={S.title}>🪑 Table Management</h1>
        <p style={S.subtitle}>Configure seating arrangements, pricing, and live availability for your restaurant.</p>
      </div>

      <div className="row">
        {/* Left Form */}
        <div className="col-lg-4 mb-4">
          <div style={S.formCard}>
            <h3 style={{ marginBottom: "24px", color: "#1a1a2e", fontWeight: 800 }}>
              {editTable ? "✏️ Edit Table" : "✨ New Table"}
            </h3>

            {editTable ? (
              <form onSubmit={handleSaveEdit}>
                <div style={S.inputGroup}>
                  <label style={S.label}>Table Name/Identifier</label>
                  <input
                    type="text" style={S.input}
                    value={editTableName}
                    onChange={(e) => setEditTableName(e.target.value)}
                    required
                  />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Availability Status</label>
                  <select
                    style={S.select}
                    value={editBookedStatus}
                    onChange={(e) => setEditBookedStatus(e.target.value === "true")}
                  >
                    <option value="false">🟢 Available</option>
                    <option value="true">🔴 Booked</option>
                  </select>
                </div>
                <button type="submit" style={S.btnPrimary}>Update Table Status</button>
                <button type="button" style={S.btnSecondary} onClick={() => setEditTable(null)}>Cancel</button>
              </form>
            ) : (
              <form onSubmit={handleAddTable}>
                <div style={S.inputGroup}>
                  <label style={S.label}>Table Name/Identifier</label>
                  <input
                    type="text" style={S.input}
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="e.g. T-12, VIP Lounge 1"
                    required
                  />
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Seating Capacity</label>
                  <select
                    style={S.select}
                    value={tableType}
                    onChange={(e) => setTableType(e.target.value)}
                  >
                    <option value="2-pair">Intimate Setting (2 Chairs)</option>
                    <option value="4-pair">Family Size (4 Chairs)</option>
                    <option value="8-pair">Large Group (8 Chairs)</option>
                  </select>
                </div>
                <div style={S.inputGroup}>
                  <label style={S.label}>Reservation Price (₹)</label>
                  <input
                    type="number" style={S.input}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 500"
                    required
                  />
                </div>
                
                <button type="submit" style={S.btnPrimary}>Deploy Table to Floorplan</button>
              </form>
            )}
          </div>
        </div>

        {/* Right Table */}
        <div className="col-lg-8">
          <div style={S.tableCard}>
            <h4 style={{ marginBottom: "20px", color: "#1a1a2e", fontWeight: 800 }}>📋 Registered Tables</h4>
            
            {tables.length === 0 ? (
              <p style={{ color: "#64748b" }}>No tables found. Add your first table configuration!</p>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Identifier</th>
                    <th style={S.th}>Capacity</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map(table => (
                    <tr key={table.id}>
                      <td style={S.td}>
                        <div style={{ fontWeight: 800, color: "#1e3a8a" }}>{table.table_name}</div>
                        {table.price > 0 && <span style={{ fontSize: ".75rem", color: "#64748b" }}>₹{table.price} Reservation</span>}
                      </td>
                      <td style={S.td}>
                        <span style={{ fontSize: "1.1rem", marginRight: "6px" }}>👥</span> 
                        {Array.isArray(table.chairs_list) ? table.chairs_list.length : (table.chair_count || parseInt(table.table_type))} Seats
                      </td>
                      <td style={S.td}>
                        <span style={S.statusBadge(table.booked)}>
                          {table.booked ? "🔴 Booked" : "🟢 Available"}
                        </span>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleEdit(table)} style={{ ...S.btnSecondary, marginTop: 0, padding: "8px 16px", color: "#2563eb", background: "rgba(37,99,235,.1)" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(table.id)} style={{ ...S.btnSecondary, marginTop: 0, padding: "8px 16px", color: "#dc2626", background: "rgba(220,38,38,.1)" }}>
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

export default TableManagement;
