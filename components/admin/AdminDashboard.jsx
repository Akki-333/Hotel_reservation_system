import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchNotification, setSearchNotification] = useState("");
  const navigate = useNavigate();

  // Filter notifications based on search
  const filteredNotifications = notifications.filter(notif =>
    notif.message && notif.message.toLowerCase().includes(searchNotification.toLowerCase())
  );

  // Helper function to highlight matched text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: '#ffeb3b', padding: '0 2px', borderRadius: '2px' }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchNotifications();

      try {
        const branchesRes = await axios.get("http://localhost:5000/branches").catch(() => ({ data: [] }));
        const tablesRes = await axios.get("http://localhost:5000/tables").catch(() => ({ data: [] }));

        setBranches(branchesRes.data);
        setTables(tablesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchNotifications = () => {
    // Simulated notification fetch - can be connected to real backend
    setNotifications([
      { id: 1, message: "New booking received from John Doe", time: "2 mins ago" },
      { id: 2, message: "Table 5 has been booked", time: "15 mins ago" },
      { id: 3, message: "New user registered: Alice Smith", time: "1 hour ago" },
    ]);
  };

  // Calculate stats
  const totalBookedTables = tables.filter(t => t.booked).length;
  const totalAvailableTables = tables.length - totalBookedTables;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your hotel.</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stats-card branches">
            <div className="icon">
              <i className="bi bi-building"></i>
            </div>
            <h3>{loading ? <Skeleton width={60} /> : branches.length}</h3>
            <p>Total Branches</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card tables">
            <div className="icon">
              <i className="bi bi-grid-3x3-gap"></i>
            </div>
            <h3>{loading ? <Skeleton width={60} /> : tables.length}</h3>
            <p>Total Tables</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card">
            <div className="icon">
              <i className="bi bi-check-circle"></i>
            </div>
            <h3>{loading ? <Skeleton width={60} /> : totalAvailableTables}</h3>
            <p>Available Tables</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card notifications">
            <div className="icon">
              <i className="bi bi-bell"></i>
            </div>
            <h3>{loading ? <Skeleton width={60} /> : notifications.length}</h3>
            <p>Recent Notifications</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Branches Table */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4><i className="bi bi-building me-2"></i>Branches Overview</h4>
              <button className="btn btn-sm btn-success" onClick={() => navigate("/branch-management")}>
                <i className="bi bi-plus-circle me-1"></i> Add Branch
              </button>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Branch</th>
                    <th>Booked</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? [...Array(3)].map((_, index) => (
                        <tr key={index}>
                          <td><Skeleton width={40} /></td>
                          <td><Skeleton width={100} /></td>
                          <td><Skeleton width={50} /></td>
                          <td><Skeleton width={50} /></td>
                        </tr>
                      ))
                    : branches.length > 0 ? (
                      branches.map((branch, index) => {
                        const branchTables = tables.filter((table) => table.branch_id === branch.id);
                        const bookedTables = branchTables.filter((table) => table.booked).length;
                        const totalTables = branchTables.length;
                        return (
                          <tr key={branch.id}>
                            <td>{index + 1}</td>
                            <td>{branch.name} ({branch.location})</td>
                            <td><span className="badge bg-danger">{bookedTables}</span></td>
                            <td><span className="badge bg-success">{totalTables - bookedTables}</span></td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">No branches found</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4><i className="bi bi-bell me-2"></i>Recent Notifications</h4>
              <button className="btn btn-sm btn-success" onClick={fetchNotifications}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="search-box">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchNotification}
                  onChange={(e) => setSearchNotification(e.target.value)}
                />
              </div>
              <div className="notification-list">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <div key={notif.id} className="notification-item p-3 mb-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <span className="fw-medium">
                          {highlightText(notif.message, searchNotification)}
                        </span>
                        <small className="text-muted">{notif.time}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">No notifications found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <button className="btn btn-success w-100 py-3" onClick={() => navigate("/add-food")}>
                <i className="bi bi-utensils me-2 fs-4"></i>
                <br />Manage Foods
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <button className="btn btn-warning w-100 py-3" onClick={() => navigate("/coupon-management")}>
                <i className="bi bi-ticket-perforated me-2 fs-4"></i>
                <br />Manage Coupons
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <button className="btn btn-info w-100 py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white' }} onClick={() => navigate("/table-management")}>
                <i className="bi bi-grid-3x3-gap me-2 fs-4"></i>
                <br />Manage Tables
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <button className="btn btn-danger w-100 py-3" onClick={() => navigate("/branch-management")}>
                <i className="bi bi-branch me-2 fs-4"></i>
                <br />Branch Management
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
