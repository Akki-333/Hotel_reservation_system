import { useState, useEffect } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';

const CouponCreation = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [reason, setReason] = useState('5_bookings');
    const [expiryDate, setExpiryDate] = useState('');

    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/eligible-users');
                setUsers(res.data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/create-coupon', {
                user_id: selectedUser,
                coupon_code: couponCode,
                discount,
                reason,
                expiry_date: expiryDate
            });
            toast.success(`Coupon added user ${users[0].name}`)
        } catch (err) {
            const error = err.response?.data || "Failed to create coupon, Please try again";
            toast.warning(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create Coupon</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Select User</label>
                    <select
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        required
                    >
                        <option value="">Choose user</option>
                        {Array.isArray(users) && users.length > 0 ? (
  users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name} ({user.email})
    </option>
  ))
) : (
  <option disabled>No users available</option>
)}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Coupon Code</label>
                    <input
                        type="text"
                        className="form-control"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Discount (%)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <select
                        className="form-select"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        <option value="5_bookings">5 Successful Bookings</option>
                        <option value="promotion">Promotion</option>
                        <option value="loyalty">Loyalty Reward</option>
                        <option value="special_offer">Special Offer</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Create Coupon
                </button>
            </form>
        </div>
    );
};

export default CouponCreation;
