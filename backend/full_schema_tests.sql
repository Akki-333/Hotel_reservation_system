USE hotel_booking;

INSERT INTO users(name, username, email, phone, password_hash, role)
VALUES
('Admin','admin','admin@hotel.com','9999999999','admin_hash','admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO hotels(name, location, contact_no, description, hotel_front_img)
VALUES
('Taj Mahal Palace','Mumbai','02266653366','Iconic sea-facing hotel','https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop'),
('Leela Palace Udaipur','Udaipur','02942455300','Lake-side luxury','https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop')
ON DUPLICATE KEY UPDATE description=VALUES(description);

INSERT INTO rooms(hotel_id, room_number, room_type, capacity, nightly_rate, status)
VALUES
((SELECT id FROM hotels WHERE name='Taj Mahal Palace' LIMIT 1),'101','deluxe',2,12000,'available'),
((SELECT id FROM hotels WHERE name='Taj Mahal Palace' LIMIT 1),'102','suite',3,18000,'available'),
((SELECT id FROM hotels WHERE name='Leela Palace Udaipur' LIMIT 1),'201','double',2,10000,'available')
ON DUPLICATE KEY UPDATE nightly_rate=VALUES(nightly_rate);

INSERT INTO hotel_amenities(hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.code IN ('wifi','pool','restaurant') WHERE h.name='Taj Mahal Palace'
ON DUPLICATE KEY UPDATE hotel_id=hotel_id;

INSERT INTO hotel_amenities(hotel_id, amenity_id)
SELECT h.id, a.id FROM hotels h JOIN amenities a ON a.code IN ('wifi','spa','gym') WHERE h.name='Leela Palace Udaipur'
ON DUPLICATE KEY UPDATE hotel_id=hotel_id;

SET @user_id = (SELECT id FROM users WHERE email='admin@hotel.com');
SET @hotel_id = (SELECT id FROM hotels WHERE name='Taj Mahal Palace');
SET @room_id = (SELECT id FROM rooms WHERE hotel_id=@hotel_id AND room_number='101');

CALL sp_check_room_availability(@hotel_id, @room_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), @avail);
SELECT @avail AS available_before;

CALL sp_create_booking(@user_id, @hotel_id, @room_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 2, @booking_id);
SELECT @booking_id AS new_booking_id;

CALL sp_calculate_price(@room_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), @price);
SELECT @price AS booking_price;

CALL sp_record_payment(@booking_id, @price, 'card', CONCAT('TXN', @booking_id), 'paid');

SELECT * FROM vw_booking_summary WHERE booking_id=@booking_id;
SELECT * FROM vw_revenue_report WHERE revenue_date=CURDATE();
SELECT COUNT(*) AS rooms_available_today FROM vw_available_rooms_today;

CALL sp_cancel_booking(@booking_id, @user_id);
SELECT status FROM bookings WHERE id=@booking_id;

