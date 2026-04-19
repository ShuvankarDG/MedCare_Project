import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">Rx</span>
              </div>
              <span className="text-xl font-display font-800 text-white">
                MedCare
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted partner for booking appointments with verified
              doctors. Healthcare made simple, accessible, and reliable.
            </p>
            <div className="flex gap-3 mt-5">
              {["twitter", "linkedin", "facebook"].map((s) => (
                <div
                  key={s}
                  className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="text-xs capitalize text-gray-300">
                    {s[0].toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-semibold mb-4">Quick Links</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ["Home", "/"],
                ["Find Doctors", "/doctors"],
                ["About Us", "/about"],
                ["Contact", "/contact"],
              ].map(([l, p]) => (
                <li key={p}>
                  <button
                    onClick={() => navigate(p)}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold mb-4">Contact Us</p>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📍</span>Mozaffor Nogor, Chattogram
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>+880-1818-100200
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>support@medcare.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 MedCare. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
