const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require("nodemailer");
const WebSocket = require("ws"); // ✅ Import WebSocket

const twilio = require("twilio");

require("dotenv").config({ path: __dirname + '/.env' });

const app = express();
app.use(express.json());
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:4173'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // be permissive during local dev
  },
  credentials: true
}));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const wss = new WebSocket.Server({ port: 8080 });

// Initialize Twilio only if valid credentials are provided
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("Twilio initialized successfully");
  } catch (err) {
    console.log("Twilio initialization failed, SMS features disabled:", err.message);
  }
} else {
  console.log("Twilio credentials not configured, SMS features disabled");
}

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.E_MAIL,
    pass: process.env.PWD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  secure: false,
  connectionTimeout: 10000,
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    dbHealthy: dbHealthy,
    dbHost: process.env.DB_HOST || null,
    dbName: process.env.DB_NAME || null
  });
});





// DB health flag
let dbHealthy = false;

// First connect without database to create it
const dbInit = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Create database if not exists
dbInit.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
  if (err) {
    console.error("Error creating database:", err.message);
    return;
  } else {
    console.log("Database created or already exists");
  }
  
  // Now connect to the database
  dbInit.changeUser({ database: process.env.DB_NAME }, (err) => {
    if (err) {
      console.error("Error switching to database:", err.message);
      dbHealthy = false;
      return;
    } else {
      console.log("Connected to database");
    }
    
    // Create tables
    createTables(dbInit);

    // Upgrade to pooled connections for better performance and concurrency
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    // verify connectivity
    pool.getConnection((perr, conn) => {
      if (perr) {
        console.error("Database pool connection failed:", perr.message);
        dbHealthy = false;
      } else {
        dbHealthy = true;
        conn.release();
        console.log("Database pool initialized");
      }
    });
    db = pool;
  });
});

function createTables(db) {
  // Users table
  db.query(`CREATE TABLE IF NOT EXISTS users (
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
  )`, (err) => { if (err) console.log("Users table error:", err.message); });

  // Branches table
  db.query(`CREATE TABLE IF NOT EXISTS branches (
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
  )`, (err) => { if (err) console.log("Branches table error:", err.message); });

  // Tables table
  db.query(`CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    table_type VARCHAR(20) DEFAULT '2-pair',
    chairs_list JSON,
    booked BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
  )`, (err) => { if (err) console.log("Tables table error:", err.message); });

  // Chairs table
  db.query(`CREATE TABLE IF NOT EXISTS chairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    chair_name VARCHAR(20) NOT NULL,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
  )`, (err) => { if (err) console.log("Chairs table error:", err.message); });

  // Bookings table
  db.query(`CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    table_id INT,
    date DATE NOT NULL,
    booking_time DATETIME NOT NULL,
    food_status VARCHAR(50) DEFAULT 'not ordered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
  )`, (err) => { if (err) console.log("Bookings table error:", err.message); });

  // Foods table
  db.query(`CREATE TABLE IF NOT EXISTS foods (
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
  )`, (err) => { if (err) console.log("Foods table error:", err.message); });

  // Coupons table
  db.query(`CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(5,2) NOT NULL,
    reason VARCHAR(100),
    expiry_date DATE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`, (err) => { if (err) console.log("Coupons table error:", err.message); });

  // User coupons table
  db.query(`CREATE TABLE IF NOT EXISTS user_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coupon_code VARCHAR(50) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`, (err) => { if (err) console.log("User coupons table error:", err.message); });

  // Notifications table
  db.query(`CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err) => { if (err) console.log("Notifications table error:", err.message); });

  console.log("All tables created successfully!");

  // Add performance indexes (ignore errors if they already exist)
  const indexStatements = [
    "ALTER TABLE users ADD INDEX idx_users_username (username)",
    "ALTER TABLE users ADD INDEX idx_users_email (email)",
    "ALTER TABLE branches ADD INDEX idx_branches_location (location)",
    "ALTER TABLE tables ADD INDEX idx_tables_branch (branch_id)",
    "ALTER TABLE bookings ADD INDEX idx_bookings_user (user_id)",
    "ALTER TABLE bookings ADD INDEX idx_bookings_hotel_date (hotel_id, date)",
    "ALTER TABLE orders ADD INDEX idx_orders_user (user_id)",
    "ALTER TABLE order_items ADD INDEX idx_order_items_order (order_id)",
    "ALTER TABLE foods ADD INDEX idx_foods_category (category)"
  ];
  indexStatements.forEach(stmt => {
    db.query(stmt, () => {});
  });
  
  // Insert default admin if not exists
  db.query("SELECT * FROM users WHERE username = 'admin'", (err, results) => {
    if (results.length === 0) {
      bcrypt.hash("admin123", 10).then(hash => {
        db.query("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)", 
          ["Admin", "admin", "admin@hotel.com", hash, "admin"], 
          (err) => { if (!err) console.log("Default admin user created!"); });
      });
    }
  });
  
  // Insert sample branches if empty
  db.query("SELECT COUNT(*) as count FROM branches", (err, results) => {
    if (err || !results || !results[0]) return;
    if (results[0].count === 0) {
      db.query("INSERT INTO branches (name, location, contact_no, description) VALUES ?", 
        [[
          ["The Lalit New Delhi", "New Delhi", "01144447777", "Luxury business hotel in the heart of the capital"],
          ["Vivanta Kolkata", "Kolkata", "03340001234", "Premium city hotel with contemporary design"],
          ["The Park Hyderabad", "Hyderabad", "04027701234", "Lifestyle hotel with vibrant nightlife"]
        ]], 
        (err) => { if (!err) console.log("Sample branches added!"); });
    }
  });
  
  // Insert sample foods if empty
  db.query("SELECT COUNT(*) as count FROM foods", (err, results) => {
    if (err || !results || !results[0]) return;
    if (results[0].count === 0) {
      db.query("INSERT INTO foods (name, category, price, description, calories, proteins, fibers) VALUES ?", 
        [[
          ["Grilled Chicken", "Main Course", 250.00, "Tender grilled chicken with herbs", "450", "35", "2"],
          ["Caesar Salad", "Starter", 150.00, "Fresh romaine lettuce with caesar dressing", "200", "8", "4"],
          ["Chocolate Cake", "Dessert", 120.00, "Rich chocolate lava cake", "350", "5", "2"],
          ["Fresh Juice", "Beverage", 80.00, "Freshly squeezed orange juice", "100", "1", "0"]
        ]], 
        (err) => { if (!err) console.log("Sample foods added!"); });
    }
  });
}

// Export db for use in routes
let db = dbInit;

app.post('/register', async (req, res) => {
  const { name, username, email, phone, dob, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = "user";
  
  const sql = "INSERT INTO users (name, username, email, phone, dob, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, username, email, phone, dob, hashedPassword, role], (err, result) => {
    if (err) return res.json({ success: false, message: "User already exists" });
    res.json({ success: true });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) return res.json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const role = results[0].role;
    const id = results[0].id;
    

    res.json({ 
      success: true, 
      role: role,
      id: id,
      message: `Login successful as ${role}` 
    });
    
  });
});


app.post('/check-username', (req, res) => {
    const { username } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        return res.json({ success: false, message: 'Database error' });
      }
      if (results.length > 0) {
        return res.json({ available: false });
      }
      return res.json({ available: true });
    });
  });



  app.get("/branches", (req, res) => {
    // Serve demo data if DB isn’t healthy to keep UI working
    if (!dbHealthy) {
      return res.status(200).json([
        { id: 1, name: "The Lalit New Delhi", location: "New Delhi", contact_no: "+91 98111 77777", hotel_front_img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1200&auto=format&fit=crop" },
        { id: 2, name: "Vivanta Kolkata", location: "Kolkata", contact_no: "+91 98301 23456", hotel_front_img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop" },
        { id: 3, name: "The Park Hyderabad", location: "Hyderabad", contact_no: "+91 98450 12345", hotel_front_img: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop" },
        { id: 4, name: "Taj Mahal Palace", location: "Mumbai", contact_no: "+91 99200 12345", hotel_front_img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop" },
        { id: 5, name: "Oberoi Amarvilas", location: "Agra", contact_no: "+91 98112 34567", hotel_front_img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop" },
        { id: 6, name: "ITC Grand Chola", location: "Chennai", contact_no: "+91 99400 00044", hotel_front_img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop" },
        { id: 7, name: "The Leela Palace Udaipur", location: "Udaipur", contact_no: "+91 98290 45530", hotel_front_img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop" },
        { id: 8, name: "Rambagh Palace", location: "Jaipur", contact_no: "+91 98151 60200", hotel_front_img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop" },
        { id: 9, name: "JW Marriott Juhu", location: "Mumbai", contact_no: "+91 99673 30000", hotel_front_img: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop" }
      ]);
    }
    const sql = "SELECT * FROM branches"; 
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Error fetching branches:", err); 
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json(result || []); 
    });
  });
  






app.post("/branches", upload.fields([
  { name: "home_img", maxCount: 1 },
  { name: "hotel_front_img", maxCount: 1 },
  { name: "hotel_img", maxCount: 1 },
  { name: "hotel_img2", maxCount: 1 },
]), (req, res) => {
  const { name, location, contactNo, description } = req.body;

  
  
  const home_img = req.files["home_img"] ? `/uploads/${req.files["home_img"][0].filename}` : null;
  const hotel_front_img = req.files["hotel_front_img"] ? `/uploads/${req.files["hotel_front_img"][0].filename}` : null;
  const hotel_img = req.files["hotel_img"] ? `/uploads/${req.files["hotel_img"][0].filename}` : null;
  const hotel_img2 = req.files["hotel_img2"] ? `/uploads/${req.files["hotel_img2"][0].filename}` : null;

  db.query(
    "INSERT INTO branches (name, location, contact_no, description, home_img, hotel_front_img, hotel_img, hotel_img2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, location, contactNo, description, home_img, hotel_front_img, hotel_img, hotel_img2],
    (err, result) => {
      if (err){ 
        console.error("❌ Error while adding branch", err.message);
        return res.status(500).json(err);
      }
      res.json({ message: "Branch added successfully", id: result.insertId });
    }
  );
});

app.put("/branches/:id", upload.fields([
  { name: "home_img", maxCount: 1 },
  { name: "hotel_front_img", maxCount: 1 },
  { name: "hotel_img", maxCount: 1 },
  { name: "hotel_img2", maxCount: 1 },
]), (req, res) => {
  const { name, location, contactNo, description } = req.body;
  const id = req.params.id;

  db.query("SELECT home_img, hotel_front_img, hotel_img, hotel_img2 FROM branches WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    let existingImages = result[0];

    const home_img = req.files["home_img"] ? `/uploads/${req.files["home_img"][0].filename}` : existingImages.home_img;
    const hotel_front_img = req.files["hotel_front_img"] ? `/uploads/${req.files["hotel_front_img"][0].filename}` : existingImages.hotel_front_img;
    const hotel_img = req.files["hotel_img"] ? `/uploads/${req.files["hotel_img"][0].filename}` : existingImages.hotel_img;
    const hotel_img2 = req.files["hotel_img2"] ? `/uploads/${req.files["hotel_img2"][0].filename}` : existingImages.hotel_img2;

    db.query(
      "UPDATE branches SET name=?, location=?, contact_no=?, description=?, home_img=?, hotel_front_img=?, hotel_img=?, hotel_img2=? WHERE id=?",
      [name, location, contactNo, description, home_img, hotel_front_img, hotel_img, hotel_img2, id],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Branch updated successfully" });
      }
    );
  });
});



  
  // app.post("/branches", (req, res) => {
  //   const { name, location, contactNo, description  } = req.body;
  //   db.query("INSERT INTO branches (name, location, contactNo, description) VALUES (?, ?, ?, ?)", [name, location, contactNo, description], (err, result) => {
  //     if (err) return res.status(500).json(err);
  //     res.json({ success: true, message: "Branch added" });
  //   });
  // });
  
  // app.put("/branches/:id", (req, res) => {
  //   const { name, location, contactNo, description } = req.body;
  //   db.query(
  //     "UPDATE branches SET name = ?, location = ?, contactNo = ?, description = ? WHERE id = ?",
  //     [name, location, contactNo, description, req.params.id],
  //     (err, result) => {
  //       if (err) return res.status(500).json(err);
  //       res.json({ success: true, message: "Branch updated" });
  //     }
  //   );
  // });
  
  app.delete("/branches/:id", (req, res) => {
    db.query("DELETE FROM branches WHERE id = ?", [req.params.id], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, message: "Branch deleted" });
    });
  });
  
  app.get("/tables", (req, res) => {
    const sql = `
   SELECT 
    tables.id, 
    tables.booked, 
    tables.table_name, 
    tables.table_type, 
    tables.branch_id, 
    branches.location AS branch_location, 
    GROUP_CONCAT(chairs.chair_name ORDER BY chairs.id) AS chairs_list
FROM tables
JOIN branches ON tables.branch_id = branches.id
LEFT JOIN chairs ON tables.id = chairs.table_id
GROUP BY tables.id;

    `;
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);

    });
  });



  app.get("/table/:id", (req, res) => {
    const { id } = req.params;

    // console.log("Fetching tables for branch_id:", id, "Type:", typeof id); // Log ID and type

    const query = "SELECT * FROM tables WHERE branch_id = ?";
    
    db.query(query, [parseInt(id)], (err, result) => { // Ensure ID is integer if needed
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database query failed", details: err });
        }

        // console.log("Executed Query:", query, "with ID:", id);
        // console.log("Query Result:", result);

        res.json(result);
    });
});


  
  
  app.get("/chairs", (req, res) => {
    db.query("SELECT * FROM chairs", (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });
  



  app.post("/tables", (req, res) => {
    const { branch_id, table_name, booked, table_type, chair_count, price } = req.body;

    if (!chair_count || chair_count < 1) {
        return res.status(400).json({ error: "Invalid chair count" });
    }

    // Insert Table
    const sql = "INSERT INTO tables (branch_id, table_name, booked, table_type, chair_count, price) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [branch_id, table_name, booked, table_type, chair_count, price], (err, result) => {
        if (err) return res.status(500).send(err);

        const table_id = result.insertId; // Get inserted table ID

        // Get the last chair number from DB
        const lastChairSql = "SELECT MAX(CAST(SUBSTRING_INDEX(chair_name, 'C', -1) AS UNSIGNED)) AS last_chair FROM chairs";
        db.query(lastChairSql, (err, chairResult) => {
            if (err) return res.status(500).send(err);

            let lastChairNumber = chairResult[0].last_chair ? parseInt(chairResult[0].last_chair) : 0;

            const chairInserts = [];
            for (let i = 1; i <= chair_count; i++) {
                lastChairNumber++; 
                chairInserts.push([table_id, `C${lastChairNumber}`]); 
            }


            const chairSql = "INSERT INTO chairs (table_id, chair_name) VALUES ?";
            db.query(chairSql, [chairInserts], (err) => {
                if (err) return res.status(500).send(err);
                res.json({ message: "Table and chairs added successfully" });
            });
        });
    });
});

  
  app.delete("/tables/:id", (req, res) => {
    const tableId = req.params.id;
  
    db.query("DELETE FROM chairs WHERE table_id = ?", [tableId], (err) => {
      if (err) return res.status(500).send(err);
  
      db.query("DELETE FROM tables WHERE id = ?", [tableId], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Table and its chairs deleted" });
      });
    });
  });


  app.put("/tables/:id", (req, res) => {
    const { id } = req.params;
    const { table_name, booked } = req.body;
  
    db.query(
      "UPDATE tables SET table_name=?, booked=? WHERE id=?",
      [table_name, booked, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Table updated successfully" });
      }
    );
  });
  
 

  

  app.post("/bookings", (req, res) => {
    const {
        user_id, hotel_id, table_id, date, time, email, phone, name, table_name,
        hotel_location, hotel_name, table_size, food_status // ✅ Added food_status
    } = req.body;

    console.log("Body", req.body);

    if (!user_id || !hotel_id || !table_id || !date || !time) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const fullDateTime = `${date} ${time}:00`;
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
if (!/^\+\d{10,15}$/.test(formattedPhone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
}


    const insertQuery = `
        INSERT INTO bookings 
        (user_id, hotel_id, table_id, date, booking_time, food_status) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    const updateQuery = `UPDATE tables SET booked = 1 WHERE id = ?`;

    db.beginTransaction((err) => {
        if (err) {
            console.error("❌ Transaction Error:", err);
            return res.status(500).json({ error: "Transaction Error: " + err.message });
        }

        // Insert booking
        db.query(insertQuery, [user_id, hotel_id, table_id, date, fullDateTime, food_status], (err, result) => {
            if (err) {
                console.error("❌ Booking Insert Failed:", err);
                return db.rollback(() => {
                    res.status(500).json({ error: "Booking Failed: " + err.message });
                });
            }

            // Update table status
            db.query(updateQuery, [table_id], (err) => {
                if (err) {
                    console.error("❌ Table Update Failed:", err);
                    return db.rollback(() => {
                        res.status(500).json({ error: "Table Update Failed: " + err.message });
                    });
                }

                // Commit transaction
                db.commit((err) => {
                    if (err) {
                        console.error("❌ Commit Failed:", err);
                        return db.rollback(() => {
                            res.status(500).json({ error: "Commit Failed: " + err.message });
                        });
                    }

                    // **Send Email Notification**
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "Booking Confirmation",
                        text:
                            `Hello ${name}, your table is successfully booked at our restaurant.\n` +
                            `🔹 Table Name: ${table_name} (${table_size})\n` +
                            `🔹 Hotel Name: ${hotel_name} (${hotel_location})\n` +
                            `🔹 Arrival Time: ${time}\n` +
                            `🔹 Food Status: ${food_status}\n\n` +
                            `We look forward to serving you. Thank you!`,
                    };

                    console.log("No", formattedPhone);

                    transporter.sendMail(mailOptions, (error) => {
                        if (error) console.error("❌ Email error:", error);
                    });

                    // **Send SMS Notification**
                    twilioClient.messages.create({
                        body:
                            `Hello ${name}, your table is successfully booked at our restaurant.\n` +
                            `🔹 Table Name: ${table_name} (${table_size})\n` +
                            `🔹 Hotel Name: ${hotel_name} (${hotel_location})\n` +
                            `🔹 Arrival Time: ${time}\n` +
                            `🔹 Food Status: ${food_status}\n\n` +
                            `We look forward to serving you. Thank you!`,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: formattedPhone,
                    }).catch((err) => console.error("❌ SMS error:", err));

                    // **Format the Notification Message**
                    const message = `New booking for Table ${table_name} in ${hotel_name} (${food_status})`;

                    // **Save Notification in the Database**
                    const notificationQuery = `INSERT INTO notifications (message) VALUES (?)`;
                    db.query(notificationQuery, [message], (err) => {
                        if (err) {
                            console.error("❌ Error saving notification:", err);
                        } else {
                            console.log("✅ Notification saved to database");
                        }

                        // **Notify WebSocket Clients (Admin Dashboard)**
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ message }));
                            }
                        });

                        // ✅ **Final Response**
                        res.status(201).json({ success: true, message: "Booking successful! Notifications sent." });
                    });
                });
            });
        });
    });
});




app.get("/notifications", (req, res) => {
  const query = "SELECT * FROM notifications ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch notifications" });
    }
    res.json(results);
  });
});

// API to delete a notification
app.delete("/notifications/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM notifications WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete notification" });
    }
    res.json({ success: true, message: "Notification deleted" });
  });
});



app.get("/my_bookings/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT b.booking_id, b.booking_time, b.table_id, 
           h.name AS hotel_name, h.location, t.table_name 
    FROM bookings b
    JOIN branches h ON b.hotel_id = h.id
    LEFT JOIN tables t ON b.table_id = t.id
    WHERE b.user_id = ?
    ORDER BY b.booking_time DESC`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


app.delete("/cancel_booking/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const query = "DELETE FROM bookings WHERE booking_id = ?";

  db.query(query, [bookingId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting booking" });
    }
    res.json({ message: "History deleted successfully!" });
  });
});




app.post('/create-coupon', (req, res) => {
  const { user_id, coupon_code, discount, reason, expires_at } = req.body;

  const checkQuery = `SELECT * FROM coupons WHERE user_id = ?`;

  db.query(checkQuery, [user_id], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      return res.status(400).send('User already has an existing coupon!');
    }

    const query = `
      INSERT INTO coupons (user_id, coupon_code, discount, reason, expiry_date)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [user_id, coupon_code, discount, reason, expires_at], (err) => {
      if (err) return res.status(500).send(err);
      res.send('Coupon created and sent successfully!');
    });
  });
});




const moment = require('moment');

app.post('/coupons/validate', (req, res) => {
    const { user_id, coupon_code } = req.body;
    console.log("Body", req.body);

    const couponQuery = `SELECT * FROM coupons WHERE coupon_code = ?`;
    db.query(couponQuery, [coupon_code], (err, results) => {
        if (err) {
            console.log("Error:", err.message);
            return res.status(500).send(err);
        }

        if (results.length === 0) return res.status(400).send('Invalid coupon.');

        const coupon = results[0];

        // Check if coupon is expired
        if (moment().isAfter(moment(coupon.expiry_date))) {
            console.log("Expired");
            return res.status(400).send('Coupon has expired.');
        }

        // Check if user has already used this coupon
        const usageQuery = `SELECT * FROM user_coupons WHERE user_id = ? AND coupon_code = ?`;
        db.query(usageQuery, [user_id, coupon_code], (err, usageResults) => {
            if (err) {
                console.log("Error:", err.message);
                return res.status(500).send(err);
            }

            if (usageResults.length > 0) return res.status(400).send('Coupon already used.');

            res.json({
                message: 'Coupon is valid!',
                discount: coupon.discount
            });
        });
    });
});


// Mark coupon as used
app.post('/coupons/use', (req, res) => {
  const { user_id, coupon_code } = req.body;
  const query = `INSERT INTO user_coupons (user_id, coupon_code, used_at) VALUES (?, ?, NOW())`;

  db.query(query, [user_id, coupon_code], (err) => {
      if (err) return res.status(500).send(err);
      res.send('Coupon applied successfully!');
  });
});



app.get('/eligible-users', (req, res) => {
  const query = `
      SELECT u.id, u.name, u.email, COUNT(b.user_id) AS booking_count
      FROM users u
      JOIN bookings b ON u.id = b.user_id
      GROUP BY u.id
      HAVING booking_count >= 5;
  `;

  db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});



app.post('/add-food', upload.single('image'), (req, res) => {
  const { name, category, price, description, calories, proteins, fibers } = req.body;

  const sql = 'INSERT INTO foods (name, category, price, description, calories, proteins, fibers ) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, category, price, description, calories, proteins, fibers], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add food', details: err });
      res.status(201).json({ message: 'Food added successfully' });
  });
});

// 2️⃣ Get all foods
app.get('/get-foods', (req, res) => {
  const sql = 'SELECT * FROM foods';
  db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch foods', details: err });
      res.json(results);
  });
});


app.put('/update-food/:id', (req, res) => {
  const { name, category, price, description, calories, proteins, fibers } = req.body;
  const { id } = req.params;

  console.log("Body", req.body);

  const query = 'UPDATE foods SET name = ?, category = ?, price = ?, description = ?, calories = ?, proteins = ?, fibers = ? WHERE id = ?';
  db.query(query, [name, category, price, description, calories, proteins, fibers, id], (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to update food item' });
      }
      res.status(200).json({ message: 'Food item updated successfully' });
  });
});

// Delete food
app.delete('/delete-food/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM foods WHERE id = ?';
  db.query(query, [id], (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to delete food item' });
      }
      res.status(200).json({ message: 'Food item deleted successfully' });
  });
});



app.get('/coupon/:code', async (req, res) => {
  const { code } = req.params;

  try {
      const [coupon] = await db.promise().query(
          'SELECT * FROM coupons WHERE coupon_code = ? AND expiry_date >= CURDATE()',
          [code]
      );

      if (coupon.length === 0) {
          return res.status(404).json({ message: 'Invalid or expired coupon' });
      }

      res.json(coupon[0]);
  } catch (error) {
      console.error('Error fetching coupon:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/coupons/:couponCode', (req, res) => {
  const { couponCode } = req.params;

  const deleteQuery = 'DELETE FROM coupons WHERE coupon_code = ?';

  db.query(deleteQuery, [couponCode], (error, result) => {
      if (error) {
          console.error('❌ Error deleting coupon:', error);
          return res.status(500).send({ message: 'Failed to delete coupon' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).send({ message: 'Coupon not found' });
      }

      res.status(200).send({ message: 'Coupon deleted successfully' });
  });
});




// Initialize database - Add OTP columns if not exist
app.get('/init-otp-columns', (req, res) => {
  const checkSql = "SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'otp'";
  db.query(checkSql, [process.env.DB_NAME], (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });
    
    if (results.length === 0) {
      const alterSql = "ALTER TABLE users ADD COLUMN otp VARCHAR(6) NULL, ADD COLUMN otp_expiry DATETIME NULL";
      db.query(alterSql, (err) => {
        if (err) return res.json({ success: false, message: "Failed to add OTP columns" });
        return res.json({ success: true, message: "OTP columns added successfully" });
      });
    } else {
      return res.json({ success: true, message: "OTP columns already exist" });
    }
  });
});

// Forgot Password - Verify User
app.post('/forgot-password-verify', (req, res) => {
  const { username, email } = req.body;
  
  const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(sql, [username, email], async (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });
    if (results.length === 0) return res.json({ success: false, message: "User not found" });
    
    const user = results[0];
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP temporarily (in real app, use a separate table or Redis)
    // For simplicity, we'll send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Email error:", error);
        return res.json({ success: false, message: "Failed to send OTP" });
      }
      
      // Store OTP in database (add otp and otp_expiry columns to users table)
      const updateSql = "UPDATE users SET otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE id = ?";
      db.query(updateSql, [otp, user.id], (err) => {
        if (err) return res.json({ success: false, message: "Failed to store OTP" });
        res.json({ success: true, message: "OTP sent to your email", userId: user.id });
      });
    });
  });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { userId, otp } = req.body;
  
  const sql = "SELECT * FROM users WHERE id = ? AND otp = ? AND otp_expiry > NOW()";
  db.query(sql, [userId, otp], (err, results) => {
    if (err) return res.json({ success: false, message: "Database error" });
    if (results.length === 0) return res.json({ success: false, message: "Invalid or expired OTP" });
    
    res.json({ success: true, message: "OTP verified" });
  });
});

// Reset Password
app.post('/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const sql = "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?";
  db.query(sql, [hashedPassword, userId], (err, result) => {
    if (err) return res.json({ success: false, message: "Failed to reset password" });
    res.json({ success: true, message: "Password reset successful" });
  });
});

// Resend OTP
app.post('/resend-otp', (req, res) => {
  const { userId } = req.body;
  
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], async (err, results) => {
    if (err || results.length === 0) return res.json({ success: false, message: "User not found" });
    
    const user = results[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP (Resent)",
      text: `Your new OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) return res.json({ success: false, message: "Failed to send OTP" });
      
      const updateSql = "UPDATE users SET otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE id = ?";
      db.query(updateSql, [otp, user.id], (err) => {
        if (err) return res.json({ success: false, message: "Failed to store OTP" });
        res.json({ success: true, message: "OTP resent successfully" });
      });
    });
  });
});

app.get('/init-otp-columns', (req, res) => {
  const alterQuery = `ALTER TABLE users ADD COLUMN IF NOT EXISTS otp VARCHAR(6) DEFAULT NULL, ADD COLUMN IF NOT EXISTS otp_expiry DATETIME DEFAULT NULL`;
  db.query(alterQuery, (err) => { if (err) console.log("OTP columns might already exist:", err.message); res.json({ success: true }); });
});

app.post('/forgot-password-verify', (req, res) => {
  const { username, email } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND email = ?";
  db.query(sql, [username, email], async (err, results) => {
    if (err || results.length === 0) return res.json({ success: false, message: "User not found" });
    const user = results[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const updateSql = "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?";
    db.query(updateSql, [otp, otpExpiry, user.id], async (err) => {
      if (err) return res.json({ success: false, message: "Failed to generate OTP" });
      const mailOptions = { from: process.env.E_MAIL, to: email, subject: "Password Reset OTP", text: `Your OTP is: ${otp}. Valid for 10 minutes.` };
      transporter.sendMail(mailOptions, (error) => { if (error) return res.json({ success: false, message: "Failed to send OTP" }); res.json({ success: true, userId: user.id }); });
    });
  });
});

app.post('/verify-otp', (req, res) => {
  const { userId, otp } = req.body;
  const sql = "SELECT * FROM users WHERE id = ? AND otp = ? AND otp_expiry > NOW()";
  db.query(sql, [userId, otp], (err, results) => { if (err || results.length === 0) return res.json({ success: false, message: "Invalid or expired OTP" }); res.json({ success: true }); });
});

app.post('/resend-otp', (req, res) => {
  const { userId } = req.body;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], async (err, results) => {
    if (err || results.length === 0) return res.json({ success: false, message: "User not found" });
    const user = results[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const updateSql = "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?";
    db.query(updateSql, [otp, otpExpiry, user.id], async (err) => {
      if (err) return res.json({ success: false, message: "Failed to regenerate OTP" });
      const mailOptions = { from: process.env.E_MAIL, to: user.email, subject: "Password Reset OTP - Resent", text: `Your new OTP is: ${otp}. Valid for 10 minutes.` };
      transporter.sendMail(mailOptions, (error) => { if (error) return res.json({ success: false, message: "Failed to send OTP" }); res.json({ success: true }); });
    });
  });
});

app.post('/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const sql = "UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?";
  db.query(sql, [hashedPassword, userId], (err) => { if (err) return res.json({ success: false, message: "Failed to reset password" }); res.json({ success: true }); });
});

app.listen(5000, () => { console.log("Server running on port 5000"); });
