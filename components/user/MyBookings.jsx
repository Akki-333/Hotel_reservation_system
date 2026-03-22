import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/config/api";

const S = {
  page: { padding: "48px 24px", maxWidth: "960px", margin: "0 auto", fontFamily: "'Inter', sans-serif" },
  header: { marginBottom: "32px", textAlign: "left" },
  title: { fontSize: "clamp(1.8rem, 3vw, 2.22rem)", fontWeight: 800, color: "#0f172a", marginBottom: "8px" },
  subtitle: { color: "#64748b", fontSize: ".95rem", lineHeight: 1.5 },
  emptyCard: {
    textAlign: "center", padding: "80px 24px", background: "#fff",
    borderRadius: "24px", border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(0,0,0,.03)",
  },
  emptyIcon: { fontSize: "4rem", marginBottom: "20px" },
  emptyTitle: { fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" },
  emptyText: { color: "#64748b", fontSize: ".95rem", marginBottom: "28px", maxWidth: "400px", margin: "0 auto 28px" },
  bookBtn: {
    display: "inline-flex", alignItems: "center", gap: "10px",
    padding: "14px 28px", background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "#fff", border: "none", borderRadius: "14px", fontWeight: 800,
    fontSize: "1rem", cursor: "pointer", textDecoration: "none",
    boxShadow: "0 8px 20px rgba(37,99,235,.2)", transition: "all 0.3s ease"
  },
  card: {
    background: "#fff", borderRadius: "20px", padding: "24px 28px",
    boxShadow: "0 4px 20px rgba(0,0,0,.05)", border: "1px solid #e2e8f0",
    marginBottom: "20px", transition: "all 0.3s ease",
    display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "20px",
  },
  hotelName: { fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" },
  chip: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "#f1f5f9", color: "#475569",
    padding: "6px 14px", borderRadius: "9999px",
    fontSize: ".8rem", fontWeight: 700,
  },
  cancelBtn: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "10px 20px", background: "#fef2f2", color: "#dc2626",
    border: "1.5px solid #fee2e2", borderRadius: "12px",
    fontWeight: 800, fontSize: ".85rem", cursor: "pointer", transition: "all 0.2s ease",
  },
  spinner: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "16px", padding: "100px 24px", color: "#94a3b8",
  },
  spinnerCircle: {
    width: "48px", height: "48px",
    border: "4px solid #e2e8f0", borderTop: "4px solid #2563eb",
    borderRadius: "50%", animation: "spin 1s linear infinite",
  },
  countBadge: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "rgba(37,99,235,.1)", color: "#1e3a8a",
    padding: "6px 16px", borderRadius: "99px",
    fontSize: ".85rem", fontWeight: 800, marginBottom: "24px",
  }
};

const formatDate = (str) => {
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleString("en-IN", { 
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
  });
};

const isPast = (str) => new Date(str) < new Date();

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to view your bookings.");
      navigate("/login");
      return;
    }
    api.get(`/my_bookings/${userId}`)
      .then(({ data }) => { 
        // Strict Privacy: Only show bookings belonging to the current user
        const filtered = Array.isArray(data) ? data.filter(b => String(b.user_id || b.userId) === String(userId)) : [];
        setBookings(filtered); 
        setLoading(false); 
      })
      .catch(() => { toast.error("Failed to load your records."); setLoading(false); });
  }, [userId, navigate]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    setCancelling(id);
    try {
      await api.delete(`/cancel_booking/${id}`);
      setBookings((prev) => prev.filter((b) => b.booking_id !== id));
      toast.success("Reservation cancelled successfully.");
    } catch {
      toast.error("Could not cancel at this time.");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div style={S.page}>
        <div style={S.spinner}>
          <div style={S.spinnerCircle} />
          <p style={{fontWeight:600}}>Loading your private bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>📋 My Bookings</h1>
        <p style={S.subtitle}>Strictly private access to your personal reservation history and active booking status.</p>
      </div>

      {bookings.length === 0 ? (
        <div style={S.emptyCard}>
          <div style={S.emptyIcon}>🗓️</div>
          <h3 style={S.emptyTitle}>You have not yet booked</h3>
          <p style={S.emptyText}>Experience the finest dining today! Choose a cuisine from our home page and reserve your table.</p>
          <a href="/" style={S.bookBtn}>🍽️ Explore Menu & Book</a>
        </div>
      ) : (
        <>
          <div style={S.countBadge}>📌 {bookings.length} Personal Record{bookings.length !== 1 ? "s" : ""}</div>
          {bookings.map((b) => {
            const past = isPast(b.booking_time);
            return (
              <div key={b.booking_id} style={{ ...S.card, opacity: past ? 0.7 : 1 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={S.hotelName}>Stay & Dine — Table {b.table_name || "#"}</span>
                    <span style={{
                      ...S.chip,
                      background: past ? "#f1f5f9" : "rgba(16,185,129,.15)",
                      color: past ? "#64748b" : "#059669",
                    }}>
                      {past ? "⏰ Res. Completed" : "✨ Active Now"}
                    </span>
                  </div>
                  <div style={S.chipRow}>
                    <span style={S.chip}>📍 Premium Location</span>
                    <span style={S.chip}>📅 {formatDate(b.booking_time)}</span>
                    <span style={S.chip}>🪑 {b.table_type || "Fine Dining"}</span>
                  </div>
                </div>
                {!past && (
                  <button
                    style={{
                      ...S.cancelBtn,
                      opacity: cancelling === b.booking_id ? 0.6 : 1,
                    }}
                    disabled={cancelling === b.booking_id}
                    onClick={() => handleCancel(b.booking_id)}
                  >
                    {cancelling === b.booking_id ? "..." : "🗑️ Cancel"}
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MyBookings;
