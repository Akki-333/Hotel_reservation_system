import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../src/config/api";

/* ─── Inline Styles ─── */
const S = {
  page: { padding: "36px 28px", maxWidth: "1280px", margin: "0 auto" },
  topRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "28px" },
  statCard: {
    background: "#fff", borderRadius: "16px", padding: "24px 22px",
    boxShadow: "0 4px 20px rgba(0,0,0,.07)", border: "1px solid #e2e8f0",
    display: "flex", alignItems: "center", gap: "16px",
  },
  statIconWrap: {
    width: "52px", height: "52px", borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.6rem", flexShrink: 0,
  },
  statNum: { fontSize: "1.8rem", fontWeight: 900, color: "#0f172a", lineHeight: 1 },
  statLabel: { fontSize: ".78rem", color: "#64748b", fontWeight: 600, marginTop: "3px", textTransform: "uppercase", letterSpacing: ".04em" },
  grid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "start" },
  card: {
    background: "#fff", borderRadius: "16px", padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: "1px solid #e2e8f0",
  },
  cardTitle: { fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" },
  searchInput: {
    width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
    borderRadius: "10px", fontSize: ".88rem", fontFamily: "inherit", outline: "none",
    marginBottom: "14px", color: "#0f172a",
  },
  notifItem: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "10px 12px", borderRadius: "10px", background: "#f8fafc",
    marginBottom: "8px", gap: "10px",
  },
  notifText: { fontSize: ".82rem", color: "#334155", lineHeight: 1.5, flex: 1 },
  delBtn: {
    background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca",
    borderRadius: "7px", padding: "4px 10px", cursor: "pointer",
    fontSize: ".75rem", fontWeight: 700, fontFamily: "inherit", flexShrink: 0,
  },
  quickGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" },
  quickBtn: (color) => ({
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "20px 16px", gap: "10px", background: "#fff",
    border: `2px solid ${color}20`, borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(0,0,0,.06)", cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.2s ease",
  }),
  quickIcon: { fontSize: "1.8rem" },
  quickLabel: (color) => ({ fontSize: ".82rem", fontWeight: 700, color }),
  tableWrap: { background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" },
  tableHead: { background: "linear-gradient(135deg, #0f172a, #1e3a8a)", color: "#fff" },
  th: { padding: "12px 16px", fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" },
  td: { padding: "12px 16px", fontSize: ".88rem", color: "#334155", borderBottom: "1px solid #f1f5f9" },
  badge: (booked, total) => ({
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "3px 10px", borderRadius: "9999px", fontSize: ".75rem", fontWeight: 700,
    background: booked === 0 ? "rgba(16,185,129,.12)" : booked === total ? "rgba(239,68,68,.12)" : "rgba(245,158,11,.12)",
    color: booked === 0 ? "#059669" : booked === total ? "#dc2626" : "#d97706",
  }),
  spinner: { display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" },
  spinnerEl: { width: "24px", height: "24px", border: "3px solid #e2e8f0", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  pageTitle: { fontSize: "1.6rem", fontWeight: 900, color: "#0f172a", marginBottom: "4px" },
  pageSub: { color: "#64748b", fontSize: ".88rem", marginBottom: "28px" },
};

const highlight = (text, term) => {
  if (!term) return text;
  const parts = text.split(new RegExp(`(${term})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === term.toLowerCase()
      ? <mark key={i} style={{ background: "#fef08a", padding: "0 2px", borderRadius: "2px" }}>{p}</mark>
      : p
  );
};

const QUICK_ACTIONS = [
  { label: "Tables", icon: "🪑", path: "/table-management", color: "#2563eb" },
  { label: "Foods", icon: "🍽️", path: "/add-food", color: "#d97706" },
  { label: "Coupons", icon: "🎟️", path: "/coupon-management", color: "#7c3aed" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchNotif, setSearchNotif] = useState("");
  const [hoveredAction, setHoveredAction] = useState(null);

  const filteredNotifs = notifications.filter((n) =>
    n.message?.toLowerCase().includes(searchNotif.toLowerCase())
  );

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ Fixed: all three in Promise.all
        const [bRes, tRes, nRes] = await Promise.all([
          api.get("/branches"),
          api.get("/tables"),
          api.get("/notifications"),
        ]);
        setBranches(bRes.data);
        setTables(tRes.data);
        setNotifications(nRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();

    // WebSocket for live notifications
    let ws;
    try {
      ws = new WebSocket("ws://localhost:8080");
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data?.message) setNotifications((prev) => [data, ...prev]);
        } catch {}
      };
    } catch {}
    return () => { if (ws) ws.close(); };
  }, []);

  const deleteNotif = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const totalBooked = tables.filter((t) => t.booked).length;
  const totalAvailable = tables.length - totalBooked;

  return (
    <div style={S.page}>
      <h1 style={S.pageTitle}>Admin Dashboard 🎛️</h1>
      <p style={S.pageSub}>Overview of your hotel system — branches, tables, notifications.</p>

      {/* ── STAT CARDS ── */}
      <div style={S.topRow}>
        {[
          { icon: "🪑", label: "Total Tables", value: tables.length, color: "#eff6ff", iconColor: "#2563eb" },
          { icon: "📌", label: "Booked", value: totalBooked, color: "#fef2f2", iconColor: "#dc2626" },
          { icon: "✅", label: "Available", value: totalAvailable, color: "#f0fdf4", iconColor: "#16a34a" },
          { icon: "🔔", label: "Notifications", value: notifications.length, color: "#fefce8", iconColor: "#ca8a04" },
        ].map((stat) => (
          <div style={S.statCard} key={stat.label}>
            <div style={{ ...S.statIconWrap, background: stat.color }}>
              <span style={{ color: stat.iconColor }}>{stat.icon}</span>
            </div>
            <div>
              <div style={S.statNum}>{loading ? "—" : stat.value}</div>
              <div style={S.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ marginBottom: "8px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "14px" }}>⚡ Quick Actions</h2>
        <div style={S.quickGrid}>
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              style={{
                ...S.quickBtn(a.color),
                borderColor: hoveredAction === a.label ? a.color : `${a.color}20`,
                transform: hoveredAction === a.label ? "translateY(-4px)" : "none",
                boxShadow: hoveredAction === a.label ? `0 8px 24px ${a.color}30` : "0 2px 12px rgba(0,0,0,.06)",
              }}
              onMouseEnter={() => setHoveredAction(a.label)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => navigate(a.path)}
            >
              <span style={S.quickIcon}>{a.icon}</span>
              <span style={S.quickLabel(a.color)}>Manage {a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID: notifications | table status ── */}
      <div style={S.grid}>
        {/* Notifications */}
        <div style={S.card}>
          <h3 style={S.cardTitle}>🔔 Notifications</h3>
          <input
            type="text"
            style={S.searchInput}
            placeholder="Search notifications…"
            value={searchNotif}
            onChange={(e) => setSearchNotif(e.target.value)}
          />
          {loading ? (
            <div style={S.spinner}><div style={S.spinnerEl} /></div>
          ) : filteredNotifs.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", fontSize: ".85rem", padding: "24px 0" }}>
              {searchNotif ? "No matching notifications" : "No notifications yet"}
            </p>
          ) : (
            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              {filteredNotifs.map((n, i) => (
                <div key={n.id || i} style={S.notifItem}>
                  <span style={S.notifText}>{highlight(n.message || "", searchNotif)}</span>
                  {n.id && (
                    <button style={S.delBtn} onClick={() => deleteNotif(n.id)}>✕</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Status */}
        <div>
          <h3 style={{ ...S.cardTitle, marginBottom: "14px" }}>📊 Table Occupancy</h3>
          <div style={S.tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={S.tableHead}>
                <tr>
                  {["#", "Table Name", "Type", "Status"].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", padding: "32px" }}>
                    <div style={S.spinnerEl} />
                  </td></tr>
                ) : tables.length === 0 ? (
                  <tr><td colSpan={4} style={{ ...S.td, textAlign: "center", color: "#94a3b8" }}>No tables found</td></tr>
                ) : tables.map((t, idx) => (
                  <tr key={t.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={S.td}>{idx + 1}</td>
                    <td style={{ ...S.td, fontWeight: 700 }}>{t.table_name}</td>
                    <td style={S.td}>{t.table_type}</td>
                    <td style={S.td}>
                      <span style={S.badge(t.booked ? 1 : 0, 1)}>
                        {t.booked ? "🔴 Occupied" : "🟢 Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
