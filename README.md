# 🍽️ Restaurant Reservation and Seating Management System

A modern web application that empowers both diners and restaurant staff with a seamless table reservation experience. Designed to handle real-time booking, intuitive management, and responsive interactions across devices.

---

## 📖 Description

The **Restaurant Reservation System** is a full-stack web application enabling customers to book tables online. Through a sleek and user-friendly interface, diners can view availability, make reservations, and manage their bookings. On the other side, restaurant staff benefit from a powerful admin dashboard to oversee tables, customers, and reservations with ease.

---

## ✨ Features

- 📅 Real-time table availability and booking  
- 👥 Customer account registration and management  
- 🛠️ Admin dashboard for managing reservations & tables  
- 🔄 Create, update, and cancel reservations  
- 📬 Email notifications for confirmed bookings  
- 📱 Fully responsive design for desktop and mobile  
- 🔒 Secure and organized data management  

---

## 🛠️ Tech Stack

### 🔹 Frontend
- **HTML5** – Structuring the interface  
- **CSS3** – Styling and layout  
- **JavaScript** – Client-side scripting  
- **React.js** – Dynamic and modular UI  

### 🔹 Backend
- **Node.js** – Runtime for server-side JavaScript  
- **Express.js** – API and server framework  

### 🔹 Database
- **MySQL** – Relational database system for persistent storage  

### 🔹 Development Tools
- **Git** – Version control for collaborative development  
- **npm** – Dependency and script management  
- **Postman** – API testing and debugging  

---

## 🚀 Installation

### ✅ Prerequisites

- Node.js (v14 or higher)  
- npm (v6 or higher)  
- MySQL (v8.0 or higher)  
- Git  

### 📦 Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/restaurant-reservation-system.git
   cd restaurant-reservation-system
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up the database**
   - Create a new MySQL database.
   - Import the schema from:
     ```
     database/schema.sql
     ```

5. **Run development servers**

   - **Backend:**
     ```bash
     cd server
     npm start
     ```

   - **Frontend:**
     ```bash
     cd client
     npm start
     ```

---

## 📦 Dependencies

- **express** – Web framework for Node.js  
- **mysql** – MySQL client for Node  
- **react** – JavaScript library for building UIs  
- **axios** – HTTP client for making API calls  
- *(Include other key packages from `package.json` as needed)*  

---

## ⚙️ Configuration

Ensure you configure your environment files and database connections properly. You can create a `.env` file in the `server` directory with the following structure:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=restaurant_db
PORT=5000
```

---

## ▶️ Usage

- Customers can:  
  - Register / Login  
  - Browse available time slots  
  - Book, edit, or cancel reservations  

- Restaurant staff can:  
  - View and manage all reservations  
  - Add or update table information  
  - Send notifications to customers  

---

