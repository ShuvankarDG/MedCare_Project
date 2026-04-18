# MedCare 🏥 — Doctor Appointment Booking App

A full-stack doctor appointment booking platform built with the **MERN stack**. Patients can browse doctors, book appointments, and pay online. Doctors and admins have dedicated dashboards.

---

## 🚀 Features

- 👤 Patient registration, login, profile management
- 🩺 Browse & filter doctors by specialty
- 📅 Book, cancel & track appointments
- 💳 Stripe payment integration
- 🤖 Groq-powered AI chatbot (LLaMA 3)
- 🖼️ Cloudinary image uploads
- ⭐ Doctor ratings & reviews
- 🔒 JWT authentication
- 🛡️ Rate limiting on all endpoints
- 👨‍💼 Admin dashboard (add/remove doctors, view revenue, manage appointments)

---

## 🗂️ Project Structure

prescripto/
├── backend/                   # Node.js + Express REST API
│   ├── src/
│   │   ├── config/            # MongoDB & Cloudinary setup
│   │   ├── controllers/       # userController, doctorController, adminController, chatController
│   │   ├── middlewares/       # JWT auth, multer
│   │   ├── models/            # User, Doctor, Appointment, Contact
│   │   └── routes/            # API routes
│   ├── server.js
│   └── package.json
└── frontend/                  # React + Vite (User panel + Admin panel)
    ├── src/
    │   ├── components/        # Navbar, Footer, Chatbot, DoctorCard, etc.
    │   ├── context/           # AppContext, AdminContext, DoctorContext
    │   └── pages/             # All user and admin pages
    ├── index.html
    └── package.json

    ---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Payments | Stripe |
| Storage | Cloudinary |
| AI Chatbot | Groq (LLaMA 3.3 70B) |

---

## 🛠️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/prescripto.git
cd prescripto
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

See `backend/.env.example` for all required variables including:
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `GROQ_API_KEY`

---


---

## 👨‍💻 Developer

Built by **TEAM SAST** as a full-stack course project.