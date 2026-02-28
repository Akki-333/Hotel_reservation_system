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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sampleHotels = [
    {
      id: 1,
      name: "The Lalit New Delhi",
      location: "New Delhi",
      contact_no: "+91 98111 77777",
      hotel_front_img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Vivanta Kolkata",
      location: "Kolkata",
      contact_no: "+91 98301 23456",
      hotel_front_img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "The Park Hyderabad",
      location: "Hyderabad",
      contact_no: "+91 98450 12345",
      hotel_front_img: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Taj Mahal Palace",
      location: "Mumbai",
      contact_no: "+91 99200 12345",
      hotel_front_img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Oberoi Amarvilas",
      location: "Agra",
      contact_no: "+91 98112 34567",
      hotel_front_img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "ITC Grand Chola",
      location: "Chennai",
      contact_no: "+91 99400 00044",
      hotel_front_img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "The Leela Palace Udaipur",
      location: "Udaipur",
      contact_no: "+91 98290 45530",
      hotel_front_img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Rambagh Palace",
      location: "Jaipur",
      contact_no: "+91 98151 60200",
      hotel_front_img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 9,
      name: "JW Marriott Juhu",
      location: "Mumbai",
      contact_no: "+91 99673 30000",
      hotel_front_img: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop"
    },
  ];

  const fetchHotels = () => {
    setLoading(true);
    setError("");
    axios.get("/branches")
      .then(response => {
        let data = Array.isArray(response.data) ? response.data : [];
        const normalized = data.map(h => ({
          ...h,
          contact_no: h.contact_no || h.contactNo || "",
          hotel_front_img: h.hotel_front_img || h.hotel_img || ""
        }));
        // Replace any non-Indian seed data with Indian equivalents (with fresh, relevant images)
        const replacements = [
          { name: "The Lalit New Delhi", location: "New Delhi", contact_no: "+91 98111 77777", hotel_front_img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1200&auto=format&fit=crop" },
          { name: "Vivanta Kolkata", location: "Kolkata", contact_no: "+91 98301 23456", hotel_front_img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop" },
          { name: "The Park Hyderabad", location: "Hyderabad", contact_no: "+91 98450 12345", hotel_front_img: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop" },
        ];
        const needsReplace = (h) => {
          const norm = (s) => (s || "").toString().trim().toLowerCase();
          const badNames = ["grand hotel","seaside resort","mountain lodge"];
          const badLocs = ["new york","miami beach","denver"];
          return badNames.includes(norm(h.name)) || badLocs.includes(norm(h.location));
        };
        let replaceIdx = 0;
        let finalList = normalized.map(h => {
          if (needsReplace(h) && replaceIdx < replacements.length) {
            const r = replacements[replaceIdx++];
            return { ...h, ...r };
          }
          return h;
        });
        if (finalList.length < 9) {
          const existingNames = new Set(finalList.map(h => h.name));
          const extras = sampleHotels.filter(h => !existingNames.has(h.name)).slice(0, 9 - finalList.length);
          finalList = [...finalList, ...extras];
        }
        setHotels(finalList);
        setFilteredHotels(finalList);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching branch data:", err);
        // Show demo data so UI isn't empty; keep error message visible
        setHotels(sampleHotels);
        setFilteredHotels(sampleHotels);
        setError("Unable to load hotels from server. Showing demo data.");
        setLoading(false);
      });
  };

  // Fetch branches from API
  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchHotels();
    return () => { isMounted = false };
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
  const buildImageSrc = (hotel) => {
    const raw = hotel.hotel_front_img || hotel.hotel_img || "";
    if (raw && /^https?:\/\//i.test(raw)) {
      if (raw.includes("images.unsplash.com") && !raw.includes("auto=format")) {
        const joiner = raw.includes("?") ? "&" : "?";
        return `${raw}${joiner}auto=format&fit=crop&w=1200&q=80`;
      }
      return raw;
    }
    if (raw) {
      return `${axios.defaults.baseURL || ""}${raw}`;
    }
    return `https://picsum.photos/seed/${encodeURIComponent(hotel.name || "hotel")}/1200/800`;
  };

  const handleImgError = (e, hotel) => {
    if (e?.target?.dataset?.fallbackSet === "true") return;
    e.target.dataset.fallbackSet = "true";
    e.target.src = `https://picsum.photos/seed/${encodeURIComponent(hotel.name || "hotel")}/1200/800`;
  };

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
        {loading && (
          [...Array(6)].map((_, i) => (
            <div key={i} className="col-md-4 col-sm-12 mb-4">
              <div className="card floating-card placeholder-glow">
                <div className="card-img-top bg-secondary placeholder" style={{height: 200}} />
                <div className="card-body">
                  <h5 className="card-title placeholder col-6"></h5>
                  <p className="card-text placeholder col-9"></p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item placeholder col-7"></li>
                    <li className="list-group-item placeholder col-5"></li>
                  </ul>
                  <button className="btn btn-primary mt-3 disabled placeholder col-4">&nbsp;</button>
                </div>
              </div>
            </div>
          ))
        )}
        {!loading && error && (
          <div className="col-12 text-center mb-3">
            <div className="text-danger mb-2">{error}</div>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchHotels}>Retry</button>
          </div>
        )}
        {!loading && !error && filteredHotels.map((hotel, index) => (
          <div key={index} className="col-md-4 col-sm-12 mb-4">
            <div className="card floating-card">
              <img
                src={buildImageSrc(hotel)}
                alt={hotel.name}
                className="card-img-top rounded"
                onError={(e) => handleImgError(e, hotel)}
              />
              <div className="card-body">
                <h5 className="card-title">{highlightText(hotel.name, searchTerm)}</h5>
                <p className="card-text">Experience the best hospitality.</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Address: {highlightText(hotel.location, searchTerm)}
                  </li>
                  <li className="list-group-item">Phone: {hotel.contactNo || hotel.contact_no || 'N/A'}</li>
                </ul>
                <button className="btn btn-primary mt-3" onClick={() => handleBooking(hotel)}>
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && filteredHotels.length === 0 && searchTerm && (
          <p className="text-center">No hotels found matching your search.</p>
        )}
        
      </div>
    </div>
  );
};

export default HotelDetailsPage;
