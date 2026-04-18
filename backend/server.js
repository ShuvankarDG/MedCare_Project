import express from "express";
import cors from "cors";
import "dotenv/config";
import rateLimit from "express-rate-limit";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import adminRouter from "./src/routes/adminRoute.js";
import doctorRouter from "./src/routes/doctorRoute.js";
import userRouter from "./src/routes/userRoute.js";
import chatRouter from "./src/routes/chatRoute.js";

// ─── App Setup ─────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4000;

// ─── Database & Services ───────────────────────────────────────────────────
connectDB();
connectCloudinary();

// ─── Rate Limiters ─────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: {
    success: false,
    message: "Chat rate limit exceeded. Please slow down.",
  },
});

// ─── Middlewares ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "token",
      "atoken",
      "dtoken",
      "origin",
    ],
  }),
);

// ─── Routes ────────────────────────────────────────────────────────────────
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatLimiter, chatRouter);
app.use("/api/contact", chatRouter); // shares the same router (submitContact lives at /contact/submit)

// ─── Health Check ──────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Prescripto API v2 is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      admin: "/api/admin",
      doctor: "/api/doctor",
      user: "/api/user",
      chat: "/api/chat    POST { messages: [{role, content}] }",
      contact: "/api/contact/submit  POST { name, email, subject, message }",
    },
  });
});

// ─── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// 404
app.use((req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
    });
});

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Prescripto API v2 running on http://localhost:${PORT}`);
  console.log(
    `   Chatbot: ${process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "gsk_your_groq_api_key_here" ? "✅ Groq AI (LLaMA 3)" : "⚠️  Rule-based fallback (add GROQ_API_KEY for AI)"}`,
  );
  console.log(
    `   Email notifications: ${process.env.EMAIL_USER ? "✅ Enabled" : "⚠️  Disabled (optional)"}`,
  );
});
