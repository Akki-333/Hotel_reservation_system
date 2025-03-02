import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Hotels.css"; // Custom CSS for floating effect

const HotelDetailsPage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]); // State to store branch data



  // Fetch branches from API
  useEffect(() => {
    axios.get("http://localhost:5000/branches")
      .then(response => {
        setHotels(response.data);
      })
      .catch(error => {
        console.error("Error fetching branch data:", error);
      });
  }, []);

  const handleBooking = (hotel) => {
    navigate('/booking-form',  { state: { selectedHotel: hotel } });
  };

  return (
    <div className="container-fluid p-5">
      <div className="row">
        {hotels.map((hotel, index) => (
          <div key={index} className="col-md-4 col-sm-12 mb-4">
            <div className="card floating-card">
              <img
                src={`http://localhost:5000${hotel.hotel_front_img}`} // Adjust the path
                alt={hotel.name}
                className="card-img-top rounded"
                onError={(e) => (e.target.src = "https://th.bing.com/th?id=OIP.EZrb_W935zKQpTgcBTAXBgHaEc&w=322&h=193&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2")}
              />
              <div className="card-body">
                <h5 className="card-title">{hotel.name}</h5>
                <p className="card-text">Experience the best hospitality.</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Address: {hotel.location}</li>
                  <li className="list-group-item">Phone: {hotel.contactNo}</li>
                </ul>
                <button className="btn btn-primary mt-3" onClick={() => handleBooking(hotel)}>
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
        {hotels.length === 0 && <p className="text-center">Loading hotels...</p>}
      </div>
    </div>
  );
};

export default HotelDetailsPage;
