import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { DoctorContext } from "../../context/DoctorContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const logout = () => {
    if (aToken) {
      localStorage.removeItem("aToken");
      setAToken("");
    }
    if (dToken) {
      localStorage.removeItem("dToken");
      setDToken("");
    }
    navigate("/admin");
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-8 py-3 border-b bg-white shadow-sm h-16 sticky top-0 z-40">
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() =>
          navigate(aToken ? "/admin/dashboard" : "/admin/doctor-dashboard")
        }
      >
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">Rx</span>
        </div>
        <span className="text-lg font-bold text-gray-800">MedCare</span>
        <span className="hidden sm:inline-block border px-2.5 py-0.5 rounded-full border-gray-300 text-gray-500 text-xs">
          {aToken ? "Admin" : "Doctor"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Patient Site
        </button>
        <button
          onClick={logout}
          className="bg-primary hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-xl transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
