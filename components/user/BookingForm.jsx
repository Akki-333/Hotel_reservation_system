import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify"; 
import { Modal, Button, Form , Table} from "react-bootstrap";
import { use } from "react";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    tableId: "",
    coupon: "",
  });
  
  const location = useLocation();
  const selectedHotel = location.state?.selectedHotel;
  const userId = localStorage.getItem('userId');
  const [tables, setTables] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [showTableModal, setShowTableModal] = useState(false);
  const [coupon, setCoupon] = useState("");
  
  const [selectedTable, setSelectedTable] = useState({
    id: null,
    capacity: null,
    isAvailable: false,
    name: ""
  });
  // const [selectedFoods, setSelectedFoods] = useState([]);
  // const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showFoodModal, setShowFoodModal] = useState(false);
  
 
  const [foods, setFoods] = useState([]);
 


const [order, setOrder] = useState({
  starter: "",
  mainCourse: "",
  dessert: "",
  beverage: "",
  specialInstructions: ""
});



useEffect(() => {
    const fetchMenu = async () => {
        try {
            const response = await axios.get("http://localhost:5000/get-foods");
            setFoods(response.data);
        } catch (error) {
            console.error("Failed to fetch menu:", error.message);
            toast.error("Failed to load menu options.");
        }
    };

    fetchMenu();
}, []);


const groupedFoods = foods.reduce((acc, food) => {
  if (!acc[food.category]) acc[food.category] = [];
  acc[food.category].push(food);
  return acc;
}, {});

const selectedMainCourse = groupedFoods["Main Course"]?.find(food => food.name === order.mainCourse);


const handleOrderChange = (e) => {
  const { name, value } = e.target;
  setOrder({ ...order, [name]: value });
};

  useEffect(() => {
  }, [selectedHotel]);

  useEffect(() => {
    if (selectedHotel && selectedHotel.id) {
      
      axios.get(`http://localhost:5000/table/${selectedHotel.id}`)
        .then(response => {
          
          if (response.data && Array.isArray(response.data)) {
            // Transform API data to the format needed for the table layout
            const formattedTables = response.data.map((table, index) => ({
              id: table.id,
              name: table.table_name || `Table ${index + 1}`,
              capacity: getCapacityFromType(table.table_type),
              shape: getShapeFromType(table.table_type),
              position: getTablePosition(index), // Position tables in a grid
              isAvailable: table.booked === 0,
              price: table.price
            }));
            
            setTables(formattedTables);
          } else {
            console.error("Invalid table data format", response.data);
            toast.error("Error loading tables. Please try again.");
          }
        })
        .catch(error => {
          console.error("Error fetching tables:", error);
          toast.error("Failed to load tables. Please try again later.");
        });
    } else {
      console.error("No hotel selected or invalid hotel ID");
    }
  }, [selectedHotel]);

  // Helper function to determine capacity from table_type
  const getCapacityFromType = (tableType) => {
    if (!tableType) return 4; // Default if no type
    
    if (tableType.includes("2")) return 2;
    if (tableType.includes("4")) return 4;
    if (tableType.includes("8")) return 8;
    return 4; // Default
  };

  // Helper function to determine shape from table_type
  const getShapeFromType = (tableType) => {
    if (!tableType) return "round"; // Default if no type
    
    // You can customize this based on your needs
    if (tableType.includes("8")) return "square";
    return "round"; // Default for 2 and 4 seaters
  };

  // Helper function to position tables in a grid layout
  const getTablePosition = (index) => {
    const tablesPerRow = 3;
    const horizontalSpacing = 200;
    const verticalSpacing = 180;
    
    const row = Math.floor(index / tablesPerRow);
    const col = index % tablesPerRow;
    
    return {
      top: 50 + row * verticalSpacing,
      left: 50 + col * horizontalSpacing
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [e.target.name]: e.target.value });
    setOrder({ ...order, [name]: value });
  };

  const getSelectedFoodDetails = () => {
    const selectedFoods = [];

    if (order.starter) {
        const starter = groupedFoods.Starter.find(food => food.name === order.starter);
        if (starter) selectedFoods.push(starter);
    }

    if (order.mainCourse) {
        const mainCourse = groupedFoods["Main Course"].find(food => food.name === order.mainCourse);
        if (mainCourse) selectedFoods.push(mainCourse);
    }

    if (order.dessert) {
        const dessert = groupedFoods.Dessert.find(food => food.name === order.dessert);
        if (dessert) selectedFoods.push(dessert);
    }

    if (order.beverage) {
        const beverage = groupedFoods.Beverage.find(food => food.name === order.beverage);
        if (beverage) selectedFoods.push(beverage);
    }

    return selectedFoods;
};


  const handleTableClick = (table) => {
    if (table.isAvailable) {
      setSelectedTable({
        id: table.id,
        capacity: table.capacity,
        isAvailable: true,
        name: table.name, 
        price: table.price
      });
      
      // Update the form data
      setFormData({
        ...formData,
        tableId: table.id
      });
    } else {
      setSelectedTable({
        id: table.id,
        capacity: table.capacity,
        isAvailable: false,
        name: table.name
      });
    }
  };

  const confirmTableSelection = () => {
    if (selectedTable.isAvailable) {
      setShowTableModal(false);
    } else {
      toast.error("Please select an available table!");
    }
  };


  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
        toast.error("You must be logged in to book a table!");
        return;
    }

    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time || !formData.tableId) {
        Swal.fire({
            title: "Error!",
            text: "Please fill in all required fields.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    const selectedTableData = tables.find(table => table.id === parseInt(formData.tableId));

    if (!selectedTableData) {
        Swal.fire({
            title: "Error!",
            text: "Please select a valid table.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    // If coupon is provided, validate it
    let discount = 0;
    let validatedCoupon = null;

    if (formData.coupon) {
        try {
            const couponResponse = await axios.post("http://localhost:5000/coupons/validate", {
                user_id: userId,
                coupon_code: formData.coupon
            });

            validatedCoupon = couponResponse.data;
            discount = validatedCoupon.discount;

            Swal.fire({
                title: "Coupon Applied!",
                text: `${couponResponse.data.message} Discount: ${couponResponse.data.discount}%`,
                icon: "success",
                confirmButtonText: "OK"
            });

        } catch (error) {
            console.error("Coupon validation error:", error.response?.data || error.message);
            Swal.fire({
                title: "Invalid Coupon!",
                text: error.response?.data || "Failed to validate coupon.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return; // Stop booking if coupon is invalid
        }
    }

    const bookingData = {
        user_id: userId,
        hotel_id: selectedHotel.id,
        table_id: formData.tableId,
        phone: formData.phone,
        email: formData.email,
        name: formData.name,
        date: formData.date,
        time: formData.time,
        table_name: selectedTableData.name,
        hotel_name: selectedHotel.name,
        hotel_location: selectedHotel.location,
        table_size: `${selectedTableData.capacity}_pair`,
        coupon: validatedCoupon ? formData.coupon : null,
        discount, // percentage discount from validated coupon
        price: selectedTable.price
    };

    console.log("Booking Data:", bookingData);
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

    // Open food selection modal
    setShowFoodModal(true);
};


// const handleConfirmFood = async () => {
//   const bookingData = {
//       user_id: userId,
//       hotel_id: selectedHotel.id,
//       table_id: formData.tableId,
//       phone: formData.phone,
//       email: formData.email,
//       name: formData.name,
//       date: formData.date,
//       time: formData.time,
//       table_name: selectedTable.name,
//       hotel_name: selectedHotel.name,
//       hotel_location: selectedHotel.location,
//       table_size: `${selectedTable.capacity}_pair`,
//       coupon: formData.coupon,
//       food_selection: order
//   };

//   try {
//       await axios.post("http://localhost:5000/bookings", bookingData);
//       Swal.fire({
//           title: "Booking Confirmed!",
//           text: `Table booked for ${formData.date} at ${formData.time}.`,
//           icon: "success",
//           confirmButtonText: "OK"
//       });

//       setFormData({
//           name: "",
//           phone: "",
//           email: "",
//           date: "",
//           time: "",
//           tableId: "",
//           coupon: ""
//       });

//       setOrder({
//           appetizers: "",
//           mainCourse: "",
//           drinks: "",
//           specialInstructions: ""
//       });

//       setShowFoodModal(false);
//   } catch (error) {
//       Swal.fire({
//           title: "Booking Failed!",
//           text: "Something went wrong.",
//           icon: "error",
//           confirmButtonText: "OK"
//       });
//   }
// };





const handleConfirmFood = () => {
  const tableId = selectedTable.id;
  const tablePrice = selectedTable.price;
  const chairCount = selectedTable.capacity;
  

  const selectedFoods = getSelectedFoodDetails();

 

  const queryParams = new URLSearchParams({
      tableId,
      tablePrice,
      chairCount,
      foodCategories: JSON.stringify(selectedFoods), // Array of selected foods
      coupon: JSON.stringify(appliedCoupon) // Coupon from DB
    });

  window.location.href = `/order-summary?${queryParams.toString()}`;
};


const handleSkipFood = () => {
  const tableId = selectedTable.id;
  const tablePrice = selectedTable.price;
  const chairCount = selectedTable.chairs;

  const queryParams = new URLSearchParams({
      tableId,
      tablePrice,
      chairCount,
      foodCategories: JSON.stringify([]), // Empty food selection
      coupon: null
  });

  window.location.href = `/order-summary?${queryParams.toString()}`;
};




  // const handleBookingSubmit = (event) => {
  //   event.preventDefault();

  //   if (!userId) {
  //     toast.error("You must be logged in to book a table!");   
  //     return;
  //   }

  //   if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time || !formData.tableId) {
  //     Swal.fire({ title: "Error!", text: "Please fill in all required fields.", icon: "error", confirmButtonText: "OK" });
  //     return;
  //   }

  //   const selectedTableData = tables.find(table => table.id === parseInt(formData.tableId));
    
  //   if (!selectedTableData) {
  //     Swal.fire({ title: "Error!", text: "Please select a valid table.", icon: "error", confirmButtonText: "OK" });
  //     return;
  //   }
    
  //   const bookingData = {
  //     user_id: userId,
  //     hotel_id: selectedHotel.id,
  //     table_id: formData.tableId,
  //     phone: formData.phone,
  //     email: formData.email,
  //     name: formData.name,
  //     date: formData.date,
  //     time: formData.time,
  //     table_name: selectedTableData.name,
  //     hotel_name: selectedHotel.name,
  //     hotel_location: selectedHotel.location,
  //     table_size: `${selectedTableData.capacity}_pair`,
  //     coupon: formdata.coupon,
  //     total_price: selectedTableData.price
  //   }; 

    



  //   axios
  //     .post("http://localhost:5000/bookings", bookingData)
  //     .then((response) => {
  //       Swal.fire({
  //         title: "Booking Confirmed!",
  //         text: `Table booked for ${formData.date} at ${formData.time}.`,
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });

  //       setFormData({
  //         name: "",
  //         phone: "",
  //         email: "",
  //         date: "",
  //         time: "",
  //         tableId: "",
  //         coupon:""
  //       });
  //       setSelectedTable({
  //         id: null,
  //         capacity: null,
  //         isAvailable: false,
  //         name: ""
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error submitting booking:", error);
  //       Swal.fire({ title: "Booking Failed!", text: "Something went wrong.", icon: "error", confirmButtonText: "OK" });
  //     });
  // };

  // Generate chair numbers based on table shape

  const renderChairNumbers = (shape, capacity) => {
    const chairs = [];
    
    for (let i = 1; i <= capacity; i++) {
      chairs.push(
        <span 
          key={i} 
          className="table-number"
          style={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            lineHeight: '24px',
            textAlign: 'center',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '0.7em',
            fontWeight: 'normal',
            ...(shape === 'square' 
              ? getSquareTableChairPosition(i, capacity) 
              : getRoundTableChairPosition(i, capacity))
          }}
        >
          {i}
        </span>
      );
    }
    
    return chairs;
  };
  
  // Square table chair positions
  const getSquareTableChairPosition = (index, capacity) => {
    if (capacity === 8) {
      switch(index) {
        case 1: return { top: '-30px', left: '5px' }; // Top left 
        case 2: return { top: '-30px', left: '50px' }; // Top middle
        case 3: return { top: '-5px', right: '-30px' }; // Right top
        case 4: return { top: '28px', right: '-30px' }; // Right middle
        case 5: return { bottom: '-30px', right: '5px' }; // Bottom right
        case 6: return { bottom: '-30px', left: '5px' }; // Bottom left
        case 7: return { top: '28px', left: '-30px' }; // Left middle
        case 8: return { top: '-5px', left: '-30px' }; // Left top
        default: return {};
      }
    } else {
      switch(index) {
        case 1: return { top: '-30px', left: '5px' }; // Top left 
        case 2: return { top: '-30px', left: '50px' }; // Top middle
        case 3: return { top: '-5px', right: '-30px' }; // Right top
        case 4: return { bottom: '-30px', right: '5px' }; // Bottom right
        case 5: return { bottom: '-30px', left: '5px' }; // Bottom left
        case 6: return { top: '-5px', left: '-30px' }; // Left top
        case 7: return { top: '28px', left: '-30px' }; // Left middle
        case 8: return { top: '28px', right: '-30px' }; // Right middle
        default: return {};
      }
    }
  };
  
  // Round table chair positions
  const getRoundTableChairPosition = (index, capacity) => {
    if (capacity === 2) {
      switch(index) {
        case 1: return { top: '-28px', left: '28px' }; // Top
        case 2: return { bottom: '-28px', left: '28px' }; // Bottom
        default: return {};
      }
    } else if (capacity === 4) {
      switch(index) {
        case 1: return { top: '-28px', left: '28px' }; // Top
        case 2: return { top: '28px', right: '-25px' }; // Right
        case 3: return { bottom: '-28px', left: '28px' }; // Bottom
        case 4: return { top: '28px', left: '-25px' }; // Left
        default: return {};
      }
    } else {
      switch(index) {
        case 1: return { top: '-28px', left: '28px' }; // Top
        case 2: return { top: '8px', right: '-25px' }; // Upper right
        case 3: return { top: '48px', right: '-25px' }; // Lower right
        case 4: return { bottom: '-28px', left: '28px' }; // Bottom
        case 5: return { top: '48px', left: '-25px' }; // Lower left
        case 6: return { top: '8px', left: '-25px' }; // Upper left
        default: return {};
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Booking Form - 2/3 of Page */}
        <div className="col-md-8">
          <form onSubmit={handleBookingSubmit} className="card p-4 shadow">
            <h4 className="fw-bold">Booking Form</h4>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Time</label>
                <input type="time" className="form-control" name="time" value={formData.time} onChange={handleChange} required />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Select Table</label>
                <div className="d-flex">
                  <button 
                    type="button" 
                    className="btn btn-outline-primary w-100"
                    onClick={() => setShowTableModal(true)}
                  >
                    {formData.tableId 
                      ? `Selected: ${tables.find(t => t.id === parseInt(formData.tableId))?.name || 'Table'} (${tables.find(t => t.id === parseInt(formData.tableId))?.capacity} chairs)` 
                      : tables.length === 0 
                        ? "No Tables are available or all are booked" 
                        : "Click to select tables"}
                  </button>
                </div>
              </div>              
            </div>
            <div className="row">
            <div className="col-md-6 mb-3">
                <label className="form-label">Coupon (If applicable)</label>
                <input type="text" className="form-control" name="coupon" value={formData.coupon} onChange={handleChange}/>
              </div>
                      
            </div>
            <button type="submit" className="btn btn-primary w-100">Book and Customize your food</button>


          </form>

          <Modal show={showFoodModal} onHide={() => setShowFoodModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>🍽️ Customize Your Order</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            {/* Starter Selection */}
            <Form.Group className="mb-3">
                <Form.Label>🥢 Starter</Form.Label>
                <Form.Select name="starter" value={order.starter} onChange={handleChange}>
                    <option value="">Select a starter</option>
                    {groupedFoods.Starter?.map((food) => (
                        <option key={food.id} value={food.name}>
                            {food.name} - ₹{food.price}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Main Course Selection */}
            <Form.Group className="mb-3">
                <Form.Label>🍽️ Main Course</Form.Label>
                <Form.Select name="mainCourse" value={order.mainCourse} onChange={handleChange}>
                    <option value="">Select a main course</option>
                    {groupedFoods["Main Course"]?.map((food) => (
                        <option key={food.id} value={food.name}>
                            {food.name} - ₹{food.price}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Nutritional Details Table (Only Visible if a Main Course is Selected) */}
            {order.mainCourse && selectedMainCourse && (
                <div className="mt-3">
                    <h6>📊 Nutritional Information</h6>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Nutrient</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Calories</td>
                                <td>{selectedMainCourse.calories || "N/A"} kcal</td>
                            </tr>
                            <tr>
                                <td>Proteins</td>
                                <td>{selectedMainCourse.proteins || "N/A"} g</td>
                            </tr>
                            <tr>
                                <td>Fibers</td>
                                <td>{selectedMainCourse.fibers || "N/A"} g</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Dessert Selection */}
            <Form.Group className="mb-3">
                <Form.Label>🍰 Dessert</Form.Label>
                <Form.Select name="dessert" value={order.dessert} onChange={handleChange}>
                    <option value="">Select a dessert</option>
                    {groupedFoods.Dessert?.map((food) => (
                        <option key={food.id} value={food.name}>
                            {food.name} - ₹{food.price}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Beverage Selection */}
            <Form.Group className="mb-3">
                <Form.Label>🥤 Beverage</Form.Label>
                <Form.Select name="beverage" value={order.beverage} onChange={handleChange}>
                    <option value="">Select a beverage</option>
                    {groupedFoods.Beverage?.map((food) => (
                        <option key={food.id} value={food.name}>
                            {food.name} - ₹{food.price}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Special Instructions */}
            <Form.Group className="mb-3">
                <Form.Label>📝 Special Instructions</Form.Label>
                <Form.Control
                    as="textarea"
                    name="specialInstructions"
                    value={order.specialInstructions}
                    onChange={handleChange}
                    placeholder="E.g. Less spicy, no onions"
                />
            </Form.Group>
        </Form>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="secondary" onClick={handleSkipFood}>
            Skip Food Selection
        </Button>
        <Button variant="success" onClick={handleConfirmFood}>
            Confirm Order & Book Table
        </Button>
    </Modal.Footer>
</Modal>

        </div>

        {/* Carousel Section - 1/3 of Page */}
        <div className="col-md-4">
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
            </div>
            <div className="carousel-inner rounded">
              <div className="carousel-item active">
                <img src="https://wallpaperaccess.com/full/6688068.jpg" className="d-block w-100" alt="Hotel 1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Selection Modal */}
      {showTableModal && (
        <div className="modal-backdrop fade show" style={{ opacity: 0.5 }}></div>
      )}
      
      <div className={`modal fade ${showTableModal ? 'show' : ''}`} 
           style={{ display: showTableModal ? 'block' : 'none' }}
           tabIndex="-1" 
           role="dialog" 
           aria-labelledby="tableModalLabel" 
           aria-hidden="true">
        <div className="modal-dialog" style={{ maxWidth: '800px' }}>
          <div className="modal-content" style={{ minHeight: '520px' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="tableModalLabel">Restaurant Layout</h5>
              <button 
                type="button" 
                className="close" 
                onClick={() => setShowTableModal(false)}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{ overflow: 'visible', padding: '20px' }}>
              <div className="mb-3">
                <div className="d-flex justify-content-start align-items-center mb-2">
                  <div className="me-3">
                    <span className="d-inline-block" style={{ width: '20px', height: '20px', backgroundColor: '#2E8B57', border: '1px solid #000' }}></span>
                    <span className="ms-2">Available</span>
                  </div>
                  <div>
                    <span className="d-inline-block" style={{ width: '20px', height: '20px', backgroundColor: 'lightgrey', border: '1px solid #000' }}></span>
                    <span className="ms-2">Booked</span>
                  </div>
                </div>
              </div>
              
              <div 
                className="restaurant-container" 
                style={{
                  width: '750px',
                  height: '550px',
                  border: '2px solid #333',
                  padding: '20px',
                  position: 'relative',
                  backgroundColor: '#f8f9fa',
                  margin: '0 auto'
                }}
              >
                {tables.length > 0 ? (
                  tables.map((table) => (
                    <div 
                      key={table.id}
                      className={`table table-${table.shape} ${table.isAvailable ? 'available' : 'booked'}`}
                      onClick={() => handleTableClick(table)}
                      style={{
                        position: 'absolute',
                        top: `${table.position.top}px`,
                        left: `${table.position.left}px`,
                        width: '80px',
                        height: '80px',
                        borderRadius: table.shape === 'round' ? '50%' : '0',
                        border: '1px solid #000',
                        padding: '5px',
                        textAlign: 'center',
                        cursor: table.isAvailable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        backgroundColor: table.isAvailable ? '#2E8B57' : 'lightgrey',
                        color: table.isAvailable ? 'black' : 'black',
                        
                        boxShadow: selectedTable.id === table.id ? '0 0 10px rgba(0,0,0,0.5)' : 'none'
                      }}
                    >
                      {table.name}                
                      {renderChairNumbers(table.shape, table.capacity)}
                     
                    </div>
                    
                  ))
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <p className="text-center">No tables available for this restaurant</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <div id="selectedTableInfo" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                      Selected table: {' '}
                      <span>
                        {selectedTable.id 
                          ? (selectedTable.isAvailable 
                              ? `${selectedTable.name} (Capacity: ${selectedTable.capacity}) (Price: ${selectedTable.price})` 
                              : `Table ${selectedTable.name} is already booked`) 
                          : 'None'}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 text-right d-flex gap-3">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowTableModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      disabled={!selectedTable.isAvailable}
                      onClick={confirmTableSelection}
                    >
                      Confirm Selection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
