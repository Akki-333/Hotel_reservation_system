import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table, Button, Container, Spinner } from "react-bootstrap";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // Assuming user is stored in localStorage



  useEffect(() => {
    if (!userId) {
      toast.error("You must be logged in to view bookings!");
      return;
    }

    axios
      .get(`http://localhost:5000/my_bookings/${userId}`)
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings.");
        setLoading(false);
      });
  }, [userId]);

  const handleCancel = (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this history?")) return;

    axios
      .delete(`http://localhost:5000/cancel_booking/${bookingId}`)
      .then(() => {
        toast.success("Booking cancelled successfully!");
        setBookings(bookings.filter((b) => b.booking_id !== bookingId));
      })
      .catch((error) => {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to delete booking.");
      });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">My Bookings</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Hotel</th>
              <th>Location</th>
              <th>Table Number</th>
              <th>Booking Time</th>
              {/* <th>End Time</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.booking_id}>
                <td>{index + 1}</td>
                <td>{booking.hotel_name}</td>
                <td>{booking.location}</td>
                <td>{booking.table_name || "N/A"}</td>
                <td>{new Date(booking.booking_time).toLocaleString()}</td>
                {/* <td>{booking.event_end_time ? new Date(booking.event_end_time).toLocaleString() : "Not specified"}</td> */}
                <td>
                  <Button variant="danger" onClick={() => handleCancel(booking.booking_id)}>
                  <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyBookings;
