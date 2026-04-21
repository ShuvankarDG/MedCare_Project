import React from "react";
import { useNavigate } from "react-router-dom";

const TEAM = [
  { name: "Dr. Shuvankar Das", role: "Chief Medical Officer", emoji: "👨🏻‍⚕️" },
  { name: "Dr.Ashraf Chowdhury", role: "Head of Technology", emoji: "👨‍💻" },
  { name: "Dr. Hrittika Dutta", role: "Patient Experience Lead", emoji: "👩‍🔬" },
];

const VALUES = [
  {
    icon: "🎯",
    title: "Efficiency",
    desc: "Streamlined appointment scheduling that fits into your busy lifestyle — no long waits, no paperwork.",
  },
  {
    icon: "🤝",
    title: "Trust",
    desc: "Every doctor on our platform is verified, licensed, and reviewed by real patients for your peace of mind.",
  },
  {
    icon: "💡",
    title: "Innovation",
    desc: "We continuously improve our platform using the latest health-tech to deliver a seamless experience.",
  },
  {
    icon: "🌍",
    title: "Accessibility",
    desc: "Healthcare should be available to everyone. We make it easy to find and book quality care anywhere.",
  },
];

const STATS = [
  { value: "500+", label: "Verified Doctors" },
  { value: "50k+", label: "Happy Patients" },
  { value: "30+", label: "Specialities" },
  { value: "4.9★", label: "Average Rating" },
];

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Hero */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-accent p-10 sm:p-16 text-white mb-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <span className="inline-block bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-800 leading-tight">
            Reimagining healthcare access
          </h1>
          <p className="mt-4 text-blue-100 leading-relaxed text-base">
            MedCare was founded with a simple mission — make quality healthcare
            accessible to everyone, everywhere, with zero friction.
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="mt-6 inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-2xl hover:shadow-lg transition-all text-sm"
          >
            Meet Our Doctors →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-6 text-center shadow-card border border-gray-100 card-lift"
          >
            <p className="text-3xl font-display font-800 text-primary">
              {s.value}
            </p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14 items-center">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Our Story
          </span>
          <h2 className="text-3xl font-display font-700 text-gray-900 mt-2 leading-tight">
            Built for patients, by people who care
          </h2>
          <p className="text-gray-500 mt-4 leading-relaxed text-sm">
            We started MedCare after experiencing firsthand how frustrating
            booking a doctor's appointment can be — long hold times, confusing
            portals, and no transparency.
          </p>
          <p className="text-gray-500 mt-3 leading-relaxed text-sm">
            Today, MedCare connects thousands of patients with verified
            specialists every day, making healthcare feel human again.
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary-light to-blue-50 rounded-3xl p-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-7xl font-display font-800 text-primary/20">MedCare</p>
            <p className="text-primary font-semibold mt-2">Est. 2026</p>
            <p className="text-gray-400 text-sm">Chattogram, Bangladesh</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-700 text-gray-900">
            What We Stand For
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 card-lift group hover:border-primary/30 transition-all"
            >
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-display font-700 text-gray-900 mb-1.5">
                {v.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-700 text-gray-900">
            Leadership Team
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            The people driving our mission forward
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEAM.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 text-center shadow-card border border-gray-100 card-lift"
            >
              <div className="text-5xl mb-3">{t.emoji}</div>
              <p className="font-display font-700 text-gray-900">{t.name}</p>
              <p className="text-primary text-sm font-medium mt-0.5">
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-display font-800 text-white">
          Ready to get started?
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Join 50,000+ patients who trust MedCare.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-2xl transition-all shadow-glow"
          >
            Create Free Account
          </button>
          <button
            onClick={() => navigate("/doctors")}
            className="border border-gray-700 text-gray-300 hover:border-gray-500 font-semibold px-8 py-3 rounded-2xl transition-all"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
