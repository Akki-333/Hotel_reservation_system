import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Hotels.css"; // Custom CSS for floating effect

const HotelDetailsPage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]); // State to store branch data
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);

  // Fetch branches from API
  useEffect(() => {
    axios.get("http://localhost:5000/branches")
      .then(response => {
        setHotels(response.data);
        setFilteredHotels(response.data);
      })
      .catch(error => {
        console.error("Error fetching branch data:", error);
      });
  }, []);

  // Handle search functionality
  useEffect(() => {
    const results = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(results);
  }, [searchTerm, hotels]);

  const handleBooking = (hotel) => {
    navigate('/booking-form',  { state: { selectedHotel: hotel } });
  };

  // Helper function to highlight matched text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
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

  return (
    <div className="container-fluid p-5">
      {/* Search Input */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search hotels by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        {filteredHotels.map((hotel, index) => (
          <div key={index} className="col-md-4 col-sm-12 mb-4">
            <div className="card floating-card">
              <img
                src={`http://localhost:5000${hotel.hotel_front_img}`} // Adjust the path
                alt={hotel.name}
                className="card-img-top rounded"
                onError={(e) => (e.target.src = "https://th.bing.com/th?id=OIP.EZrb_W935zKQpTgcBTAXBgHaEc&w=322&h=193&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2")}
              />
              <div className="card-body">
                <h5 className="card-title">{highlightText(hotel.name, searchTerm)}</h5>
                <p className="card-text">Experience the best hospitality.</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Address: {highlightText(hotel.location, searchTerm)}
                  </li>
                  <li className="list-group-item">Phone: {hotel.contactNo}</li>
                </ul>
                <button className="btn btn-primary mt-3" onClick={() => handleBooking(hotel)}>
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredHotels.length === 0 && searchTerm && (
          <p className="text-center">No hotels found matching your search.</p>
        )}
        {filteredHotels.length === 0 && !searchTerm && (
          <p className="text-center">Loading hotels...</p>
        )}
      </div>
    </div>
  );
};

export default HotelDetailsPage;
