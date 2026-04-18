# Prescripto Backend v2 🏥

A production-ready Node.js/Express REST API for the Prescripto doctor appointment booking platform. Built to perfectly match the **prescripto-frontend-v2** interface.

---

## ✨ What's New in v2

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chatbot** | Groq-powered LLaMA 3 (free tier) with smart rule-based fallback |
| ⭐ **Doctor Reviews** | Patients can rate & review completed appointments |
| 📬 **Contact Form** | Messages saved to MongoDB + optional email notification |
| 📊 **Revenue Tracking** | Admin dashboard now shows total revenue |
| 🛡️ **Rate Limiting** | Protects all endpoints (auth: 10/15min, chat: 15/min) |
| 🗑️ **Delete Doctor** | Admin can remove doctors |
| 📥 **Contact Inbox** | Admin can view all contact form submissions |
| 🔒 **Duplicate Check** | Prevents duplicate user/doctor registrations |

---

## 🗂️ Project Structure

```
prescripto-backend/
├── config/
│   ├── mongodb.js          # MongoDB connection
│   └── cloudinary.js       # Cloudinary setup
├── controllers/
│   ├── userController.js   # Auth, profile, appointments, reviews
│   ├── doctorController.js # Doctor login, dashboard, appointments
│   ├── adminController.js  # Admin CRUD, dashboard, contact inbox
│   └── chatController.js   # AI chatbot + contact form submission
├── middlewares/
│   ├── auth.js             # authAdmin, authDoctor, authUser (combined)
│   └── multer.js           # File upload handling
├── models/
│   ├── userModel.js
│   ├── doctorModel.js      # + rating, totalReviews fields
│   ├── appointmentModel.js # + review field
│   └── contactModel.js     # NEW — contact messages
├── routes/
│   ├── userRoute.js
│   ├── doctorRoute.js
│   ├── adminRoute.js
│   └── chatRoute.js        # NEW — /api/chat and /api/contact/submit
├── server.js
├── .env.example
└── package.json
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Then fill in your values in .env
```

### 3. Run the server
```bash
npm run dev    # development (nodemon)
npm start      # production
```

---

## ⚙️ Environment Variables

```env
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key

ADMIN_EMAIL= admin@prescripto.com
ADMIN_PASSWORD=Admin@1234

CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

STRIPE_SECRET_KEY=sk_test_...

# FREE chatbot — sign up at https://console.groq.com/keys
GROQ_API_KEY=gsk_...

# Optional email notifications for contact form
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

---

## 🤖 Chatbot Setup (Groq — Completely Free)

The chatbot uses **Groq's free tier** with the **LLaMA 3.3 70B** model:

1. Go to **https://console.groq.com/keys**
2. Sign up (free, no credit card needed)
3. Create an API key
4. Add it to your `.env`: `GROQ_API_KEY=gsk_...`

**Free tier limits:** ~14,400 requests/day, 30 req/min — more than enough for testing and small production use.

**No key?** The chatbot automatically falls back to a smart rule-based system that handles the most common questions (booking, payments, specialists, symptoms).

---

## 📡 API Reference

### 👤 User (`/api/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login |
| GET | `/get-profile` | ✅ token | Get user profile |
| POST | `/update-profile` | ✅ token | Update profile + photo |
| POST | `/book-appointment` | ✅ token | Book a slot |
| GET | `/appointments` | ✅ token | List all appointments |
| POST | `/cancel-appointment` | ✅ token | Cancel appointment |
| POST | `/payment-stripe` | ✅ token | Create Stripe checkout session |
| POST | `/verify-stripe` | ✅ token | Confirm payment |
| POST | `/add-review` | ✅ token | Add rating & review to completed appointment |

### 🩺 Doctor (`/api/doctor`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/list` | — | All available doctors |
| GET | `/:docId/reviews` | — | Reviews for a doctor |
| POST | `/login` | — | Doctor login |
| GET | `/appointments` | ✅ dtoken | Doctor's appointments |
| POST | `/complete-appointment` | ✅ dtoken | Mark complete |
| POST | `/cancel-appointment` | ✅ dtoken | Cancel |
| GET | `/dashboard` | ✅ dtoken | Stats |
| GET | `/profile` | ✅ dtoken | Doctor profile |
| POST | `/update-profile` | ✅ dtoken | Update profile |

### 🔧 Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | — | Admin login |
| POST | `/add-doctor` | ✅ atoken | Add doctor + photo |
| GET | `/all-doctors` | ✅ atoken | All doctors |
| POST | `/change-availability` | ✅ atoken | Toggle availability |
| POST | `/delete-doctor` | ✅ atoken | Remove doctor |
| GET | `/appointments` | ✅ atoken | All appointments |
| POST | `/cancel-appointment` | ✅ atoken | Cancel appointment |
| GET | `/dashboard` | ✅ atoken | Stats + revenue |
| GET | `/contact-messages` | ✅ atoken | Contact form inbox |
| POST | `/mark-contact-read` | ✅ atoken | Mark message read |

### 🤖 Chat (`/api/chat`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | — | Chat with AI bot |

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "Which doctor should I see for skin issues?" }
  ]
}
```
**Response:**
```json
{
  "success": true,
  "reply": "For skin concerns, a Dermatologist would be perfect...",
  "source": "groq"
}
```

### 📬 Contact (`/api/contact`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/submit` | — | Submit contact form |

---

## 🔐 Authentication Headers

| Role | Header Name | Value |
|------|-------------|-------|
| User | `token` | JWT from login |
| Doctor | `dtoken` | JWT from doctor login |
| Admin | `atoken` | JWT from admin login |

---

## 🌐 CORS

By default allows requests from `FRONTEND_URL` (5173) and `ADMIN_URL` (5174). Update these in `.env` for production.

---

## 🛡️ Rate Limiting

| Scope | Limit |
|-------|-------|
| General API | 100 req / 15 min |
| Auth endpoints | 10 req / 15 min |
| Chat | 15 req / min |
