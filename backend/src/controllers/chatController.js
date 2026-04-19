import contactModel from "../models/contactModel.js";

// ──────────────────────────────────────────────────────────────────────────────
//  CHATBOT CONTROLLER
//  Primary:  Google Gemini API (FREE — gemini-1.5-flash)
//            Sign up at https://aistudio.google.com/apikey
//  Fallback: Rule-based smart responder (works even without a key)
// ──────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a highly intelligent, friendly, and conversational AI assistant.

Your goals:
- Provide clear, accurate, and helpful answers to any user question
- Communicate naturally like a human (not robotic)
- Adapt your tone based on the user's style (casual or formal)
- Keep responses concise by default, but expand when the user needs more detail
- Explain complex topics in simple, easy-to-understand language

Guidelines:
- Be polite, warm, and engaging
- Avoid unnecessary repetition or filler
- Use examples when helpful
- If unsure, say you're not certain instead of guessing
- Do not make up facts

Health-related queries:
- Do NOT diagnose medical conditions
- Provide general guidance only
- Encourage consulting a qualified doctor or specialist when needed
- For serious symptoms (e.g., chest pain, breathing issues), advise immediate emergency help

Conversation style:
- Feel like a real assistant who genuinely wants to help
- Be helpful, not overly formal
- Keep answers structured and easy to read

Your priority is to be genuinely useful, trustworthy, and easy to talk to.`;

// ─── Gemini API call ───────────────────────────────────────────────────────
const callGemini = async (messages) => {
  // Build conversation history for Gemini
  const contents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 800,
        },
      }),
    },
  );

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(`Gemini API error: ${JSON.stringify(errData)}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// ─── Rule-based fallback ───────────────────────────────────────────────────
const RULES = [
  {
    keywords: ["book", "appointment", "schedule", "reserve"],
    response:
      "To book an appointment, go to the **Doctors** page, choose your specialist, pick a date and time slot, then click 'Confirm Appointment'. It takes less than 2 minutes! 📅",
  },
  {
    keywords: ["pay", "payment", "stripe", "cost", "fee", "price", "charge"],
    response:
      "We use **Stripe** for secure payments. Once your appointment is booked, click 'Pay Online' on your My Appointments page. We accept all major credit and debit cards. 💳",
  },
  {
    keywords: ["cancel", "reschedule", "refund"],
    response:
      "You can cancel any upcoming appointment from your **My Appointments** page. Refunds are processed within 3–5 business days via Stripe. 🔄",
  },
  {
    keywords: ["skin", "rash", "acne", "eczema", "derma"],
    response:
      "For skin concerns like rashes, acne, or eczema, a **Dermatologist** would be the right specialist. You can find one on our Doctors page! 🩺",
  },
  {
    keywords: ["child", "baby", "infant", "kid", "pediatric"],
    response:
      "For children's health concerns, our **Pediatricians** are the best choice. They're specialists in child and infant care. 👶",
  },
  {
    keywords: ["headache", "migraine", "neuro", "brain", "nerve", "seizure"],
    response:
      "For headaches, migraines, or neurological concerns, I'd recommend booking with a **Neurologist** on our platform. 🧠",
  },
  {
    keywords: [
      "stomach",
      "gut",
      "digestion",
      "gastro",
      "bowel",
      "nausea",
      "vomit",
    ],
    response:
      "Digestive issues are best addressed by a **Gastroenterologist**. They specialise in stomach, intestinal, and liver conditions. 🏥",
  },
  {
    keywords: [
      "women",
      "gynecol",
      "pregnancy",
      "period",
      "menstrual",
      "ovarian",
    ],
    response:
      "For women's health, pregnancy, or gynaecological concerns, our **Gynaecologists** are here to help. Book a confidential appointment today. 💜",
  },
  {
    keywords: [
      "fever",
      "cold",
      "flu",
      "cough",
      "general",
      "checkup",
      "routine",
    ],
    response:
      "For general symptoms like fever, cold, or routine checkups, a **General Physician** is your go-to doctor. They handle a wide range of conditions. 👨‍⚕️",
  },
  {
    keywords: ["doctor", "specialist", "which", "who", "recommend"],
    response:
      "We have specialists in: **General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist,** and **Gastroenterologist**. Tell me your symptoms and I'll point you to the right one! 🩺",
  },
  {
    keywords: ["login", "sign up", "register", "account", "password"],
    response:
      "You can create a free account or log in from the **Login** page. Click the 'Create Account' tab to register, or just enter your email and password to sign in. 🔐",
  },
  {
    keywords: ["profile", "update", "photo", "info", "personal"],
    response:
      "To update your profile photo or personal details, go to **My Profile** after logging in. You can edit your name, contact info, date of birth, and more. 👤",
  },
  {
    keywords: [
      "emergency",
      "urgent",
      "chest pain",
      "heart attack",
      "stroke",
      "breathing",
      "unconscious",
    ],
    response:
      "⚠️ **This sounds like a medical emergency.** Please call **emergency services (911 / 999 / 112)** immediately. Do not wait for an online appointment.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    response:
      "Hello! 👋 I'm MedCare's AI health assistant. I can help you find the right doctor, explain how booking works, or answer health questions. What can I help you with today?",
  },
  {
    keywords: ["thank", "thanks", "great", "helpful"],
    response:
      "You're welcome! 😊 If you have any more questions or need help booking an appointment, feel free to ask. Your health is our priority! 💙",
  },
];

const fallbackResponse = (message) => {
  const lower = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.response;
  }
  return "I'm here to help! 😊 You can ask me about finding the right doctor, booking appointments, payments, or general health questions. What would you like to know?";
};

// ─── Main handler ──────────────────────────────────────────────────────────
// POST /api/chat
// Body: { messages: [{ role: 'user'|'assistant', content: string }] }
export const chatWithBot = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0)
      return res.json({
        success: false,
        message: "Messages array is required",
      });

    const lastMessage = messages[messages.length - 1]?.content || "";

    // Try Gemini first if key is configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const reply = await callGemini(messages);
        return res.json({ success: true, reply, source: "gemini" });
      } catch (geminiError) {
        console.warn("Gemini API failed, using fallback:", geminiError.message);
      }
    }

    // Fallback to rule-based responses
    const reply = fallbackResponse(lastMessage);
    res.json({ success: true, reply, source: "fallback" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ─── Contact Form Submission ───────────────────────────────────────────────
// POST /api/contact/submit
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message)
      return res.json({ success: false, message: "All fields are required" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.json({ success: false, message: "Invalid email address" });

    await new contactModel({ name, email, subject, message }).save();

    // Optional email notification (only if EMAIL_USER is configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const { default: nodemailer } = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `[MedCare Contact] ${subject}`,
          html: `<h3>New Contact Message</h3>
                 <p><b>From:</b> ${name} (${email})</p>
                 <p><b>Subject:</b> ${subject}</p>
                 <p><b>Message:</b><br>${message}</p>`,
        });
      } catch (emailErr) {
        console.warn(
          "Email notification failed (non-critical):",
          emailErr.message,
        );
      }
    }

    res.json({
      success: true,
      message: "Message sent! We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
