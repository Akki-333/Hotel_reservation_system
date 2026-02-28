import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/BranchManagement.css';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editingBranch, setEditingBranch] = useState(null);
  const [description, setDescription] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [homeImg, setHomeImg] = useState(null);
  const [hotelFrontImg, setHotelFrontImg] = useState(null);
  const [hotelImg, setHotelImg] = useState(null);
  const [hotelImg2, setHotelImg2] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    axios.get("http://localhost:5000/branches").then((res) => setBranches(res.data));
  };

  // const handleAddBranch = () => {
  //   axios.post("http://localhost:5000/branches", { name, location, contactNo, description }).then(() => {
  //     fetchBranches();
  //   });
  // };

  const handleAddBranch = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("contactNo", contactNo);
    formData.append("description", description);

    if (homeImg) formData.append("home_img", homeImg);
    if (hotelFrontImg) formData.append("hotel_front_img", hotelFrontImg);
    if (hotelImg) formData.append("hotel_img", hotelImg);
    if (hotelImg2) formData.append("hotel_img2", hotelImg2);

    await axios.post("http://localhost:5000/branches", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setBranches("");
    setContactNo("");
    setDescription("");
    setLocation("");
    setHomeImg("");
    setHotelFrontImg("");
    setHotelImg("");
    setHotelImg2("");


    fetchBranches();
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/branches/${id}`).then(() => {
      fetchBranches();
    });
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", editingBranch.name);
    formData.append("location", editingBranch.location);
    formData.append("contactNo", editingBranch.contactNo);
    formData.append("description", editingBranch.description);

    if (homeImg) formData.append("home_img", homeImg);
    if (hotelFrontImg) formData.append("hotel_front_img", hotelFrontImg);
    if (hotelImg) formData.append("hotel_img", hotelImg);
    if (hotelImg2) formData.append("hotel_img2", hotelImg2);

    await axios.put(`http://localhost:5000/branches/${editingBranch.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchBranches();
    setEditingBranch(null);
  };
  

  return (
    <div className="container mt-4">
      <h2>Branch Management</h2>

      {/* Add Branch Form */}
      <div className="row">
        {/* Left Column - Text Inputs */}
        <div className="col-md-6">
          <label className="form-label">Branch Name</label>
          <input type="text" className="form-control" placeholder="Enter branch name" onChange={(e) => setName(e.target.value)} />

          <label className="form-label mt-2">Location</label>
          <input type="text" className="form-control" placeholder="Enter location" onChange={(e) => setLocation(e.target.value)} />

          <label className="form-label mt-2">Contact No</label>
          <input type="number" className="form-control" placeholder="Enter contact number" onChange={(e) => setContactNo(e.target.value)} />

          <label className="form-label mt-2">Description</label>
          <input type="text" className="form-control" placeholder="Enter description" onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Right Column - Image Uploads */}
        <div className="col-md-6">
          <label className="form-label">Home Image</label>
          <input type="file" className="form-control" onChange={(e) => setHomeImg(e.target.files[0])} />

          <label className="form-label mt-2">Hotel Front Image</label>
          <input type="file" className="form-control" onChange={(e) => setHotelFrontImg(e.target.files[0])} />

          <label className="form-label mt-2">Hotel Image 1</label>
          <input type="file" className="form-control" onChange={(e) => setHotelImg(e.target.files[0])} />

          <label className="form-label mt-2">Hotel Image 2</label>
          <input type="file" className="form-control" onChange={(e) => setHotelImg2(e.target.files[0])} />
        </div>
      </div>

      <button className="btn btn-primary mt-3" onClick={handleAddBranch}>Add Branch</button>

      {/* Branch List */}
      <h4 className="mt-4">Available Branches</h4>
      <table className="table table-bordered table-fixed">
  <thead>
    <tr>
      <th className="col-1">S.No</th>
      <th className="col-3">Name</th>
      <th className="col-4">Location</th>
      <th className="col-4">Contact No</th>
      <th className="col-4">Description</th>
      <th className="col-3">Action</th>
    </tr>
  </thead>
  <tbody>
    {branches.length > 0 ? (
      branches.map((branch, index) => (
        <tr key={branch.id}>
          <td className="fixed-cell">{index + 1}</td> {/* Serial Number */}
          <td className="fixed-cell">{branch.name}</td>
          <td className="fixed-cell">{branch.location}</td>
          <td className="fixed-cell">{branch.contactNo}</td>
          <td className="fixed-cell">{branch.description}</td>


          <td className="fixed-cell d-flex gap-2">
            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(branch)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(branch.id)}>Delete</button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center">No branches available</td>
      </tr>
    )}
  </tbody>
</table>



      {/* Edit Modal */}
      {editingBranch && (
  <div className="modal show d-block w-100">
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Branch</h5>
          <button className="btn-close" onClick={() => setEditingBranch(null)}></button>
        </div>
        <div className="modal-body">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <input 
                type="text" 
                className="form-control mb-2" 
                value={editingBranch.name} 
                onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })} 
              />
              <input 
                type="text" 
                className="form-control mb-2" 
                value={editingBranch.location} 
                onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })} 
              />
              <input 
                type="number" 
                className="form-control mb-2" 
                value={editingBranch.contactNo} 
                onChange={(e) => setEditingBranch({ ...editingBranch, contactNo: e.target.value })} 
              />
              <input 
                type="text" 
                className="form-control mb-2" 
                value={editingBranch.description} 
                onChange={(e) => setEditingBranch({ ...editingBranch, description: e.target.value })} 
              />
            </div>

            {/* Right Column - Image Uploads */}
            <div className="col-md-6">
              <label>Update Home Image</label>
              <input type="file" className="form-control mb-2" onChange={(e) => setHomeImg(e.target.files[0])} />
              {editingBranch.home_img && <img src={editingBranch.home_img} alt="Home" className="img-preview" />}

              <label>Update Hotel Front Image</label>
              <input type="file" className="form-control mb-2" onChange={(e) => setHotelFrontImg(e.target.files[0])} />
              {editingBranch.hotel_front_img && <img src={editingBranch.hotel_front_img} alt="Front" className="img-preview" />}

              <label>Update Hotel Image 1</label>
              <input type="file" className="form-control mb-2" onChange={(e) => setHotelImg(e.target.files[0])} />
              {editingBranch.hotel_img && <img src={editingBranch.hotel_img} alt="Hotel 1" className="img-preview" />}

              <label>Update Hotel Image 2</label>
              <input type="file" className="form-control mb-2" onChange={(e) => setHotelImg2(e.target.files[0])} />
              {editingBranch.hotel_img2 && <img src={editingBranch.hotel_img2} alt="Hotel 2" className="img-preview" />}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setEditingBranch(null)}>Cancel</button>
          <button className="btn btn-success" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default BranchManagement;
