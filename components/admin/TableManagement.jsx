import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/TableManagement.css'
import { toast } from "react-toastify";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [booked, setBooked] = useState(false);
  const [tableType, setTableType] = useState("2-pair");
  const [tableName, setTableName] = useState("");
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [price, setPrice] = useState("");

  const [editTable, setEditTable] = useState(null);
  const [editTableName, setEditTableName] = useState("");
  const [editBookedStatus, setEditBookedStatus] = useState(false);


  useEffect(() => {
    fetchTables();
    fetchBranches();
  }, []);

  const fetchTables = () => {
    axios
      .get("http://localhost:5000/tables")
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Error fetching tables:", err));
  };

  const fetchBranches = () => {
    axios
      .get("http://localhost:5000/branches")
      .then((res) => setBranches(res.data))
      .catch((err) => console.error("Error fetching branches:", err));
  };

  const handleBranchInput = (e) => {
    const inputValue = e.target.value;
    setBranchId(inputValue);

    if (inputValue.length > 0) {
      const filtered = branches.filter(
        (branch) =>
          branch.id.toString().includes(inputValue) ||
          branch.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches([]);
    }
  };

  const selectBranch = (id) => {
    setBranchId(id);
    setFilteredBranches([]);
  };

  const getChairCount = (type) => {
    switch (type) {
      case "2-pair":
        return 2;
      case "4-pair":
        return 4;
      case "8-pair":
        return 8;
      default:
        return 2;
    }
  };

  const handleAddTable = () => {
    if (!branchId || !tableName) {
      // alert("Please enter Branch ID and Table Name!");
      toast.warning("Please enter Branch ID and Table Name!");
      return;
    }
  
    const chairCount = getChairCount(tableType);
    const chairsList = Array.from({ length: chairCount }, (_, i) => i + 1);
  
    axios
      .post("http://localhost:5000/tables", {
        branch_id: branchId,
        table_name: tableName,
        booked,
        table_type: tableType,
        chair_count: chairCount,
        chairs_list: chairsList,
        price: price
      })
      .then(() => {
        fetchTables();
        setTableName("");
        
        setTableType("2-pair");
        toast.success("Table created successfully");
      })
      .catch((err) =>{
        const errormsg = err.response?.data || 'Something went wrong, Please try again';
        toast.error(errormsg);
        console.error("Error adding table:", err)});
  };
  
  

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/tables/${id}`).then(() => {
      setTables((prevTables) => prevTables.filter((table) => table.id !== id));
    });
  };

  const handleEdit = (table) => {
    setEditTable(table);
    setEditTableName(table.table_name);
    setEditBookedStatus(Boolean(table.booked));
  };

  const handleSaveEdit = () => {
    axios
      .put(`http://localhost:5000/tables/${editTable.id}`, {
        table_name: editTableName,
        booked: editBookedStatus,
      })
      .then(() => {
        fetchTables();
        setEditTable(null);
      })
      .catch((err) => console.error("Error updating table:", err));
  };

  return (
    <div className="container mt-4">
      <h2>Table Management</h2>

      {/* Add Table Form */}
      <div className="mb-3 position-relative">
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Branch ID or Name"
          value={branchId}
          onChange={handleBranchInput}
        />
        {filteredBranches.length > 0 && (
          <ul
            className="list-group position-absolute w-100"
            style={{ zIndex: 10 }}
          >
            {filteredBranches.map((branch) => (
              <li
                key={branch.id}
                className="list-group-item list-group-item-action"
                onClick={() => selectBranch(branch.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "lightgrey",
                  borderColor: "black",
                }}
              >
                {branch.name} - {branch.location}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Table Name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Price of the table"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <select
        className="form-control mb-2"
        value={tableType}
        onChange={(e) => setTableType(e.target.value)}
      >
        <option value="2-pair">2-Pair Table (2 Chairs)</option>
        <option value="4-pair">4-Pair Table (4 Chairs)</option>
        <option value="8-pair">8-Pair Table (8 Chairs)</option>
      </select>
      <button className="btn btn-primary mt-2" onClick={handleAddTable}>
        Add Table
      </button>

      {/* Table List */}
      
      <h4 style={{padding:8}}>Available Tables</h4>
      <table className="table table-bordered table-fixed">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Table Name</th>
      <th>Type</th>
      <th>Chairs</th>
      <th>Availability</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {tables.length > 0 ? (
      tables.map((table, index) => (
        <tr key={table.id}>
          <td>{index + 1}</td> {/* Serial Number */}
          <td>{table.table_name}</td>
          <td>{table.table_type}</td>
          <td>{Array.isArray(table.chairs_list) ? table.chairs_list.join(", ") : table.chairs_list}</td>
          <td>{table.booked ? "Booked" : "Available"}</td>
          <td className="d-flex gap-2">
            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(table)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(table.id)}>Delete</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center">No tables available</td>
      </tr>
    )}
  </tbody>
</table>






      {/* Modal for Editing */}
      {editTable && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Table</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditTable(null)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editTableName}
                  onChange={(e) => setEditTableName(e.target.value)}
                />
                <select
                  className="form-control"
                  value={editBookedStatus}
                  onChange={(e) => setEditBookedStatus(e.target.value === "true")}
                >
                  <option value="false">Available</option>
                  <option value="true">Booked</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditTable(null)}>Cancel</button>
                <button className="btn btn-success" onClick={handleSaveEdit}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
