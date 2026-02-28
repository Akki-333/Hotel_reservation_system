import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const OrderSummary = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [bookingData, setBookingData] = useState(null);
    const navigate = useNavigate();

    console.log("Booking Data", bookingData);

    useEffect(() => {
        const storedBooking = localStorage.getItem('pendingBooking');
        if (storedBooking) {
            setBookingData(JSON.parse(storedBooking));
        }
    }, []);

    if (!bookingData) return <p>Loading order summary...</p>;

    const tablePrice = parseFloat(bookingData.price) || 0;
    const discount = parseFloat(bookingData.discount) || 0;

    const chairCount = parseInt(queryParams.get('chairCount'), 10) || 1;
    const foodCategories = JSON.parse(queryParams.get('foodCategories') || '[]');

    const totalFoodPrice = foodCategories.reduce((sum, category) => sum + parseFloat(category.price || 0), 0);
    const multipliedFoodPrice = totalFoodPrice * chairCount;

    const totalPriceBeforeDiscount = tablePrice + multipliedFoodPrice;
    const discountAmount = (totalPriceBeforeDiscount * discount) / 100;
    const totalPrice = totalPriceBeforeDiscount - discountAmount;

    const handleBookingSubmit = async (event) => {
        event.preventDefault();
    
        const foodStatus = foodCategories.length > 0 ? "with_food" : "without_food";
    
        const finalBookingData = {
            ...bookingData,
            total_price: totalPrice,
            food_status: foodStatus // ✅ Adding the food status here
        };
    
        try {
            const response = await axios.post("http://localhost:5000/bookings", finalBookingData);
    
            Swal.fire({
                title: "Booking Confirmed!",
                text: `Table booked for ${bookingData.date} at ${bookingData.time}.`,
                icon: "success",
                confirmButtonText: "OK"
            });
    
            // Delete the applied coupon if exists
            if (bookingData.coupon) {
                await axios.delete(`http://localhost:5000/coupons/${bookingData.coupon}`);
            }
    
            // Clear local storage
            localStorage.removeItem('pendingBooking');
    
            navigate('/my-bookings');
        } catch (error) {
            console.error("Error submitting booking:", error);
            Swal.fire({
                title: "Booking Failed!",
                text: "Something went wrong.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };
    

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <Card className="shadow-lg p-4" style={{ width: '600px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4">🧾 Order Summary</h2>

                <Row className="mb-3">
                    <Col xs={6}><strong>Table Price:</strong></Col>
                    <Col xs={6} className="text-end">₹{tablePrice.toFixed(2)}</Col>
                </Row>

                {foodCategories.length > 0 ? (
                    <>
                        <Row className="mb-3">
                            <Col xs={6}><strong>Selected Food Categories:</strong></Col>
                            <Col xs={6} className="text-end">
                                {foodCategories.map((cat) => cat.name).join(', ')}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={6}><strong>Total Food Price (Per Chair):</strong></Col>
                            <Col xs={6} className="text-end">₹{totalFoodPrice.toFixed(2)}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={6}><strong>Number of Chairs:</strong></Col>
                            <Col xs={6} className="text-end">{chairCount}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={6}><strong>Total Food Price (For All Chairs):</strong></Col>
                            <Col xs={6} className="text-end">₹{multipliedFoodPrice.toFixed(2)}</Col>
                        </Row>
                    </>
                ) : (
                    <Row className="mb-3">
                        <Col xs={6}><strong>Food Selection:</strong></Col>
                        <Col xs={6} className="text-end text-danger">❌ Not Selected</Col>
                    </Row>
                )}

                {bookingData.coupon && (
                    <Row className="mb-3 text-success">
                        <Col xs={6}><strong>Coupon Applied:</strong></Col>
                        <Col xs={6} className="text-end">- ₹{discountAmount.toFixed(2)}</Col>
                    </Row>
                )}

                <hr />

                <Row className="mb-4 fw-bold fs-5">
                    <Col xs={6}><strong>Total Amount:</strong></Col>
                    <Col xs={6} className="text-end">₹{totalPrice.toFixed(2)}</Col>
                </Row>

                <div className="text-center">
                    <Button variant="success" className="px-5 py-2 fs-5" onClick={handleBookingSubmit}>
                        ✅ Confirm Booking
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default OrderSummary;
