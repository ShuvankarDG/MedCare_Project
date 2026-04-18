export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F6EF7",
        "primary-dark": "#3955d8",
        "primary-light": "#EEF1FF",
        accent: "#0ECAD4",
        surface: "#F7F9FC",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill, minmax(200px, 1fr))",
      },
      boxShadow: {
        card: "0 2px 20px rgba(79,110,247,0.08)",
        "card-hover": "0 8px 40px rgba(79,110,247,0.18)",
        glow: "0 0 40px rgba(79,110,247,0.25)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        pulse2: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease forwards",
        fadeIn: "fadeIn 0.4s ease forwards",
        pulse2: "pulse2 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
