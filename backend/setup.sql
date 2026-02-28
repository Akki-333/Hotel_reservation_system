-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hotel_booking;
USE hotel_booking;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    dob DATE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp VARCHAR(6) DEFAULT NULL,
    otp_expiry DATETIME DEFAULT NULL
);

-- Branches table (Hotels)
CREATE TABLE IF NOT EXISTS branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20),
    description TEXT,
    home_img VARCHAR(255),
    hotel_front_img VARCHAR(255),
    hotel_img VARCHAR(255),
    hotel_img2 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables table
CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    table_type VARCHAR(20) DEFAULT '2-pair',
    chairs_list JSON,
    booked BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    branch_id INT NOT NULL,
    table_id INT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    guests INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
);

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    calories VARCHAR(20),
    proteins VARCHAR(20),
    fibers VARCHAR(20),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'preparing', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(5,2) NOT NULL,
    reason VARCHAR(100),
    expiry_date DATE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, username, email, phone, password, role) 
VALUES ('Admin', 'admin', 'admin@hotel.com', '1234567890', '$2b$10$rBV2JzS9V7rKr8h3P5K5YOX5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample branches
INSERT INTO branches (name, location, contact_no, description) VALUES 
('Grand Hotel', 'New York', '1234567890', 'Luxury hotel in downtown'),
('Seaside Resort', 'Miami Beach', '9876543210', 'Beachfront resort with ocean view'),
('Mountain Lodge', 'Denver', '5551234567', 'Cozy mountain retreat')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample tables for each branch
INSERT INTO tables (branch_id, table_name, table_type, chairs_list, booked, price) VALUES
(1, 'Table 1', '2-pair', '[1, 2]', false, 50.00),
(1, 'Table 2', '4-pair', '[1, 2, 3, 4]', false, 100.00),
(1, 'Table 3', '8-pair', '[1, 2, 3, 4, 5, 6, 7, 8]', false, 200.00),
(2, 'Table 1', '2-pair', '[1, 2]', false, 50.00),
(2, 'Table 2', '4-pair', '[1, 2, 3, 4]', false, 100.00),
(3, 'Table 1', '4-pair', '[1, 2, 3, 4]', false, 80.00)
ON DUPLICATE KEY UPDATE table_name=table_name;

-- Insert sample foods
INSERT INTO foods (name, category, price, description, calories, proteins, fibers) VALUES
('Grilled Chicken', 'Main Course', 250.00, 'Tender grilled chicken with herbs', '450', '35', '2'),
('Caesar Salad', 'Starter', 150.00, 'Fresh romaine lettuce with caesar dressing', '200', '8', '4'),
('Chocolate Cake', 'Dessert', 120.00, 'Rich chocolate lava cake', '350', '5', '2'),
('Fresh Juice', 'Beverage', 80.00, 'Freshly squeezed orange juice', '100', '1', '0')
ON DUPLICATE KEY UPDATE name=name;

SELECT 'Database setup completed successfully!' as message;
