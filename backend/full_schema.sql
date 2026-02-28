SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_mode = 'STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS hotel_booking;
USE hotel_booking;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  dob DATE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(150) NOT NULL,
  contact_no VARCHAR(20),
  description TEXT,
  home_img VARCHAR(255),
  hotel_front_img VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_hotels_name_location (name, location)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_amenities (
  hotel_id INT NOT NULL,
  amenity_id INT NOT NULL,
  PRIMARY KEY (hotel_id, amenity_id),
  CONSTRAINT fk_hotel_amenities_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT fk_hotel_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  room_type ENUM('single','double','deluxe','suite') NOT NULL,
  capacity INT NOT NULL,
  nightly_rate DECIMAL(10,2) NOT NULL,
  status ENUM('available','reserved','out_of_service') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_room_hotel_number (hotel_id, room_number),
  CONSTRAINT chk_rooms_capacity CHECK (capacity >= 1),
  CONSTRAINT chk_rooms_rate CHECK (nightly_rate > 0),
  CONSTRAINT fk_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  hotel_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL,
  status ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_booking_dates CHECK (check_in < check_out),
  CONSTRAINT chk_booking_guests CHECK (guests >= 1),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  method ENUM('card','upi','cash','wallet') NOT NULL,
  status ENUM('initiated','paid','failed','refunded') NOT NULL DEFAULT 'initiated',
  transaction_ref VARCHAR(100),
  paid_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_payments_amount CHECK (amount >= 0),
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  user_id INT NOT NULL,
  booking_id INT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(64) NOT NULL,
  operation VARCHAR(16) NOT NULL,
  record_id BIGINT NULL,
  user_id INT NULL,
  details JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_hotels_location ON hotels(location);
CREATE INDEX idx_rooms_hotel_type ON rooms(hotel_id, room_type);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_hotel_dates ON bookings(hotel_id, check_in, check_out);
CREATE INDEX idx_bookings_room_dates ON bookings(room_id, check_in, check_out);
CREATE INDEX idx_payments_booking_status ON payments(booking_id, status);
CREATE INDEX idx_reviews_hotel_user ON reviews(hotel_id, user_id);

DELIMITER $$
CREATE PROCEDURE sp_audit(IN p_table VARCHAR(64), IN p_op VARCHAR(16), IN p_record BIGINT, IN p_user INT, IN p_details JSON)
BEGIN
  INSERT INTO audit_log(table_name, operation, record_id, user_id, details) VALUES(p_table, p_op, p_record, p_user, p_details);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_auth_user(IN p_email VARCHAR(150), IN p_hash VARCHAR(255), OUT p_user_id INT)
BEGIN
  DECLARE v_id INT DEFAULT NULL;
  SELECT id INTO v_id FROM users WHERE email = p_email AND password_hash = p_hash AND status='active' LIMIT 1;
  SET p_user_id = v_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_check_room_availability(IN p_hotel_id INT, IN p_room_id INT, IN p_check_in DATE, IN p_check_out DATE, OUT p_available BOOLEAN)
BEGIN
  DECLARE v_count INT DEFAULT 0;
  SELECT COUNT(*) INTO v_count
    FROM bookings
   WHERE hotel_id = p_hotel_id AND room_id = p_room_id
     AND status IN ('pending','confirmed')
     AND NOT (p_check_out <= check_in OR p_check_in >= check_out);
  SET p_available = (v_count = 0);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_calculate_price(IN p_room_id INT, IN p_check_in DATE, IN p_check_out DATE, OUT p_total DECIMAL(10,2))
BEGIN
  DECLARE v_rate DECIMAL(10,2);
  DECLARE v_nights INT;
  SELECT nightly_rate INTO v_rate FROM rooms WHERE id = p_room_id FOR UPDATE;
  SET v_nights = DATEDIFF(p_check_out, p_check_in);
  IF v_nights <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Invalid dates';
  END IF;
  SET p_total = ROUND(v_rate * v_nights * 1.12, 2);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_create_booking(
  IN p_user_id INT,
  IN p_hotel_id INT,
  IN p_room_id INT,
  IN p_check_in DATE,
  IN p_check_out DATE,
  IN p_guests INT,
  OUT p_booking_id INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Booking failed';
  END;
  START TRANSACTION;
  IF p_check_in >= p_check_out OR p_guests < 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Invalid booking input';
  END IF;
  SELECT 1 FROM rooms WHERE id=p_room_id AND hotel_id=p_hotel_id AND status<>'out_of_service' FOR UPDATE;
  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Invalid room';
  END IF;
  IF EXISTS (
    SELECT 1 FROM bookings
     WHERE room_id=p_room_id AND status IN ('pending','confirmed')
       AND NOT (p_check_out <= check_in OR p_check_in >= check_out)
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Room not available';
  END IF;
  INSERT INTO bookings(user_id, hotel_id, room_id, check_in, check_out, guests, status)
  VALUES(p_user_id, p_hotel_id, p_room_id, p_check_in, p_check_out, p_guests, 'pending');
  SET p_booking_id = LAST_INSERT_ID();
  UPDATE rooms SET status='reserved' WHERE id=p_room_id;
  CALL sp_audit('bookings','INSERT', p_booking_id, p_user_id, JSON_OBJECT('check_in', p_check_in, 'check_out', p_check_out));
  COMMIT;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_cancel_booking(IN p_booking_id INT, IN p_user_id INT)
BEGIN
  DECLARE v_room INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Cancel failed';
  END;
  START TRANSACTION;
  SELECT room_id INTO v_room FROM bookings WHERE id=p_booking_id FOR UPDATE;
  UPDATE bookings SET status='cancelled' WHERE id=p_booking_id;
  IF NOT EXISTS (SELECT 1 FROM bookings WHERE room_id=v_room AND status IN ('pending','confirmed')) THEN
    UPDATE rooms SET status='available' WHERE id=v_room;
  END IF;
  CALL sp_audit('bookings','UPDATE', p_booking_id, p_user_id, JSON_OBJECT('status','cancelled'));
  COMMIT;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_record_payment(
  IN p_booking_id INT,
  IN p_amount DECIMAL(10,2),
  IN p_method ENUM('card','upi','cash','wallet'),
  IN p_txn VARCHAR(100),
  IN p_status ENUM('initiated','paid','failed','refunded')
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Payment failed';
  END;
  START TRANSACTION;
  INSERT INTO payments(booking_id, amount, method, status, transaction_ref, paid_at)
  VALUES(p_booking_id, p_amount, p_method, p_status, p_txn, IF(p_status='paid', NOW(), NULL));
  IF p_status='paid' THEN
    UPDATE bookings SET status='confirmed' WHERE id=p_booking_id;
  END IF;
  CALL sp_audit('payments','INSERT', LAST_INSERT_ID(), NULL, JSON_OBJECT('booking_id', p_booking_id, 'status', p_status));
  COMMIT;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_bookings_after_insert
AFTER INSERT ON bookings FOR EACH ROW
BEGIN
  UPDATE rooms SET status='reserved' WHERE id=NEW.room_id;
  CALL sp_audit('bookings','AFTER_INSERT', NEW.id, NEW.user_id, JSON_OBJECT('status', NEW.status));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_bookings_after_update
AFTER UPDATE ON bookings FOR EACH ROW
BEGIN
  IF NEW.status IN ('cancelled','completed') THEN
    IF NOT EXISTS (SELECT 1 FROM bookings WHERE room_id=NEW.room_id AND status IN ('pending','confirmed')) THEN
      UPDATE rooms SET status='available' WHERE id=NEW.room_id;
    END IF;
  END IF;
  CALL sp_audit('bookings','AFTER_UPDATE', NEW.id, NEW.user_id, JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_payments_after_insert
AFTER INSERT ON payments FOR EACH ROW
BEGIN
  IF NEW.status='paid' THEN
    UPDATE bookings SET status='confirmed' WHERE id=NEW.booking_id;
  END IF;
  CALL sp_audit('payments','AFTER_INSERT', NEW.id, NULL, JSON_OBJECT('booking_id', NEW.booking_id, 'status', NEW.status));
END$$
DELIMITER ;

CREATE OR REPLACE VIEW vw_available_rooms_today AS
SELECT r.*
FROM rooms r
LEFT JOIN (
  SELECT room_id FROM bookings 
  WHERE status IN ('pending','confirmed') 
    AND CURDATE() BETWEEN check_in AND DATE_SUB(check_out, INTERVAL 1 DAY)
) b ON r.id=b.room_id
WHERE b.room_id IS NULL AND r.status='available';

CREATE OR REPLACE VIEW vw_booking_summary AS
SELECT b.id AS booking_id, b.status, b.check_in, b.check_out, b.guests,
       u.id AS user_id, u.name AS user_name, u.email,
       h.id AS hotel_id, h.name AS hotel_name, h.location,
       r.room_number, r.room_type, r.nightly_rate
FROM bookings b
JOIN users u ON b.user_id=u.id
JOIN hotels h ON b.hotel_id=h.id
JOIN rooms r ON b.room_id=r.id;

CREATE OR REPLACE VIEW vw_revenue_report AS
SELECT h.id AS hotel_id, h.name AS hotel_name, DATE(p.paid_at) AS revenue_date,
       SUM(CASE WHEN p.status='paid' THEN p.amount ELSE 0 END) AS total_revenue,
       COUNT(CASE WHEN p.status='paid' THEN 1 END) AS paid_transactions
FROM payments p
JOIN bookings b ON p.booking_id=b.id
JOIN hotels h ON b.hotel_id=h.id
GROUP BY h.id, DATE(p.paid_at);

INSERT INTO amenities(code, name)
VALUES
('wifi','Wi-Fi'),
('pool','Swimming Pool'),
('spa','Spa'),
('parking','Parking'),
('gym','Gym'),
('restaurant','Restaurant')
ON DUPLICATE KEY UPDATE name=VALUES(name);

