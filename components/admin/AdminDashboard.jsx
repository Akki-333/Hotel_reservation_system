import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdminDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  
  useEffect(() => {
    const fetchData = async () => {
      fetchNotifications();

      try {
        const [branchesRes, tablesRes, notificationsRes] = await Promise.all([
          axios.get("http://localhost:5000/branches"),
          axios.get("http://localhost:5000/tables"),
          // axios.get("http://localhost:5000/notifications"),
        ]);

        setBranches(branchesRes.data);
        setTables(tablesRes.data);
        setNotifications(notificationsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // ✅ Connect to WebSocket server

    ws.onopen = () => {
      console.log("🟢 Connected to WebSocket Server");
      setLoading(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // ✅ Parse message safely
        console.log("🔔 New Notification:", data);

        if (data && data.message) {
          setNotifications((prev) => [data, ...prev]); // ✅ Add new notification
        } else {
          console.error("❌ Received invalid notification format:", data);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("🔴 Disconnected from WebSocket Server");
    };

    return () => {
      ws.close();
    };
  }, []);



  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/notifications");
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      setLoading(false);
    }
  };

  // Delete Notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notifications/${id}`);
      setNotifications(notifications.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
    }
  };


  return (
    <div className="container-fluid p-5">
      <div className="row">
        {/* Notifications Panel */}
        <div className="col-md-4">
  <div className="card">
    <div className="card-header">
      <h4>Notifications</h4>
    </div>
    <div className="card-body" 
         style={{ maxHeight: notifications.length >= 5 ? "200px" : "auto", overflowY: notifications.length >= 5 ? "auto" : "visible" }}>
      <ul className="list-group">
        {loading
          ? [...Array(3)].map((_, index) => (
              <li key={index} className="list-group-item">
                <Skeleton width={"100%"} height={20} />
              </li>
            ))
          : notifications.map((notif) => (
              <li key={notif.id} className="list-group-item d-flex justify-content-between">
                <span>{notif.message}</span>
                <button className="btn btn-danger btn-sm p-1 d-flex align-items-center justify-content-center" 
                  style={{ width: "30px", height: "30px" }} 
                  onClick={() => deleteNotification(notif.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </li>
            ))}
      </ul>
    </div>
  </div>
</div>


        {/* Table Management */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Table Management</h4>
            </div>
            <div className="card-body">
              <button className="btn btn-primary w-100" onClick={() => navigate("/table-management")}>
                {loading ? <Skeleton width={150} height={30} /> : "Manage Tables"}
              </button>
            </div>
          </div>
        </div>

        {/* Branch Management */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Coupon Management</h4>
            </div>
            <div className="card-body">
              <button className="btn btn-success w-100" onClick={() => navigate("/branch-management")}>
                {loading ? <Skeleton width={150} height={30} /> : "Manage Branches"}
              </button>
            </div>
          </div>
        </div>

 
      </div>

      {/* Table Status */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Table Status</h4>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Branch</th>
                    <th>Booked Tables</th>
                    <th>Available Tables</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? [...Array(3)].map((_, index) => (
                        <tr key={index}>
                          <td><Skeleton width={100} /></td>
                          <td><Skeleton width={50} /></td>
                          <td><Skeleton width={50} /></td>
                        </tr>
                      ))
                    : branches.map((branch, index) => {
                        const branchTables = tables.filter((table) => table.branch_id === branch.id);
                        const bookedTables = branchTables.filter((table) => table.booked).length;
                        const totalTables = branchTables.length;
                        return (
                          <tr key={branch.id}>
                            <td>{index + 1}</td>
                            <td>{branch.name}({branch.location})</td>
                            <td>{bookedTables}</td>
                            <td>{totalTables - bookedTables}</td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card">
            <div className="card-header">
              <h4>Food Management</h4>
            </div>
            <div className="card-body">
              <button className="btn btn-success w-100" onClick={() => navigate("/add-food")}>
                {loading ? <Skeleton width={150} height={30} /> : "Manage Foods"}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card">
            <div className="card-header">
              <h4>Coupon Management</h4>
            </div>
            <div className="card-body">
              <button className="btn btn-success w-100" onClick={() => navigate("/coupon-management")}>
                {loading ? <Skeleton width={150} height={30} /> : "Manage Coupons"}
              </button>
            </div>
          </div>
        </div>
      </div>


    
    </div>
  );
};

export default AdminDashboard;
