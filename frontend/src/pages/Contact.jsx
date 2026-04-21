import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Browse doctors, select your preferred specialist, choose a date and time slot, then confirm your booking. It takes less than 2 minutes.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: 'Yes! You can cancel any upcoming appointment from your "My Appointments" page. Refunds are processed within 3-5 business days.',
  },
  {
    q: "How does online payment work?",
    a: "We use Stripe for secure payments. You can pay with any major credit or debit card. Your payment details are never stored on our servers.",
  },
  {
    q: "Are the doctors verified?",
    a: "Absolutely. Every doctor on MedCare goes through a rigorous verification process including license checks and background verification.",
  },
];

const Contact = () => {
  const { backendUrl } = useContext(AppContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/contact/submit`,
        form,
      );
      if (data.success) {
        toast.success(
          "Message sent! We'll get back to you within 24 hours. 📬",
        );
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-primary-light text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
          Contact
        </span>
        <h1 className="text-4xl font-display font-800 text-gray-900">
          We'd love to hear from you
        </h1>
        <p className="text-gray-500 mt-3 text-base max-w-md mx-auto">
          Have a question or feedback? Our team is here to help, 7 days a week.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: "📍",
            title: "Office",
            lines: ["Mozaffor Nogor, Polytechnic", "Chattogram, Bangladesh"],
          },
          {
            icon: "📞",
            title: "Phone",
            lines: ["+880-1818-100200", "24/7 customer support"],
          },
          {
            icon: "✉️",
            title: "Email",
            lines: ["support@medare.com", "We reply within 24 hours"],
          },
        ].map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 text-center card-lift"
          >
            <div className="text-3xl mb-3">{c.icon}</div>
            <p className="font-display font-700 text-gray-900 mb-1">
              {c.title}
            </p>
            {c.lines.map((l) => (
              <p key={l} className="text-gray-500 text-sm">
                {l}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Form + FAQ grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Form */}
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
          <h2 className="text-xl font-display font-700 text-gray-900 mb-6">
            Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="John Doe"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <input
                value={form.subject}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subject: e.target.value }))
                }
                required
                placeholder="How can we help?"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                required
                rows={5}
                placeholder="Tell us more about your question or feedback..."
                className={`${inputCls} resize-none`}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-2xl transition-all shadow-md hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "📤 Send Message"
              )}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-display font-700 text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${openFaq === i ? "border-primary/30 shadow-card" : "border-gray-100"}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <p className="text-sm font-semibold text-gray-800 pr-4">
                    {faq.q}
                  </p>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${openFaq === i ? "bg-primary text-white rotate-180" : "bg-gray-100 text-gray-500"}`}
                  >
                    ↓
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40" : "max-h-0"}`}
                >
                  <p className="text-sm text-gray-500 leading-relaxed px-5 pb-5">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Response time */}
          <div className="mt-6 bg-gradient-to-br from-primary-light to-blue-50 rounded-2xl p-5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm font-semibold text-gray-800">
                Average response time: &lt; 2 hours
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Our support team is available Monday–Friday, 9am–6pm EST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
