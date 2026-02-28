<div align="center">

# 🏨 Stay & Dine — Hotel + Restaurant Reservations

[![Made with React](https://img.shields.io/badge/Frontend-React-61dafb?logo=react&logoColor=white)](#) 
[![Node.js](https://img.shields.io/badge/Backend-Node.js-43853d?logo=node.js&logoColor=white)](#) 
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)](#) 
[![MySQL](https://img.shields.io/badge/DB-MySQL-4479A1?logo=mysql&logoColor=white)](#) 
[![Vite](https://img.shields.io/badge/Build-Vite-8A2BE2?logo=vite&logoColor=white)](#)

Seamlessly reserve rooms and book restaurant tables in one modern, responsive web app.

</div>

---

## ✨ Highlights
- 📅 Real‑time hotel/branch listings with search and smart image handling
- 🍽️ “Delicious Dishes” menu with calories/proteins and polished cards
- 🌐 Google Translate widget, placed just below the navbar for UX clarity
- 🧭 Full‑width nav with balanced spacing, retro‑inspired theme background
- 🔐 Login + Registration flow (open registration with `/login#`)
- 🗄️ MySQL schema ready: hotels, rooms, bookings, payments, reviews, amenities
- 🧰 Robust backend fallback: demo hotels served if DB is not reachable

> Tech Stack: React + Bootstrap (Vite), Node.js + Express, MySQL

---

## 🗂️ Project Structure
```
Hotel_reservation_system-main/
├─ backend/
│  ├─ server.cjs                # Express API server (CORS, routes, demo fallback)
│  ├─ full_schema.sql           # Complete MySQL DDL/DML: tables, FKs, indexes
│  ├─ full_schema_tests.sql     # Test script for procedures/triggers/views
│  └─ .env.example              # Sample env (create .env from this)
├─ components/
│  ├─ common/                   # Layout, Navbar, Footer, Translate
│  ├─ user/                     # Home, Hotels, Booking views
│  ├─ auth/                     # Login & Register
│  └─ styles/                   # CSS for pages and globals
├─ src/
│  └─ assets/                   # Images and menu/food data
└─ README.md
```

---

## 🚀 Quick Start

1) Install dependencies
```bash
cd Hotel_reservation_system-main/Hotel_reservation_system-main
npm install
```

2) Run the frontend (Vite)
```bash
npm run dev
# Local: http://localhost:5173/
```

3) Run the backend API
```bash
node backend/server.cjs
# API:   http://localhost:5000/
```

The API serves a demo list of Indian hotels if MySQL is not configured yet, so the UI is always usable.

---

## ⚙️ Backend Environment
Create `backend/.env` based on the following:
```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hotel_booking

E_MAIL=your_gmail@example.com
PWD=your_app_password
```

> Using root without a password is fine for local dev only. For production, create a dedicated DB user.

---

## 🧱 Database Setup (MySQL)

1) Load the schema
```sql
SOURCE /absolute/path/to/backend/full_schema.sql;
```

2) Run the tests (optional)
```sql
SOURCE /absolute/path/to/backend/full_schema_tests.sql;
```

Schema includes:
- Tables: users, hotels, rooms, bookings, payments, reviews, amenities, hotel_amenities, audit_log
- Constraints: PKs, FKs, NOT NULL, UNIQUE, CHECK, cascade rules
- Indexes: email/username, hotel/location, room types, booking dates, payment status
- Procedures: booking creation/cancel, price calc, availability check, auth
- Triggers: auto room inventory updates and booking/payment audits
- Views: available rooms today, booking summary, revenue report

---

## 🖼️ Frontend UI Notes
- Hotels page loads 9 Indian hotels with clean, hotel‑relevant images.
- If an image fails to load, a high‑quality fallback is applied automatically.
- Navbar spans the full width; language widget is pinned just below it.
- Retro background applied to pages and “Delicious Dishes” section.
- `/login#` opens the registration form directly.

---

## 🔌 Common API Endpoints
- `GET /branches` — List hotels/branches (returns demo data if DB is offline)
- `POST /register` — Create user
- `POST /login` — Login and fetch role/id
- `GET /health` — API health with DB status flag

---

## 📸 Screenshots (optional)
Add screenshots in a `/screenshots` folder and showcase the landing, hotels list, and login/registration.

---

## 🧭 Roadmap
- Room availability search + booking flow integrated with DB procedures
- Admin dashboard for branches, rooms, menus, and orders
- Payment gateway stub → live provider integration

---

## 📝 License
MIT — free to use, modify, and distribute.

---

### 💡 Credits
- Inspired by modern reservation systems and best practices for full‑stack React/Node apps.
- Built with a focus on clear UX, resilient backend fallbacks, and maintainable code.

