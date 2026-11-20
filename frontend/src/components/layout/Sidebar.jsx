
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — PREMIUM SIDEBAR
REACT ROUTER NAVIGATION
*/

import {
  LayoutDashboard,
  Ticket,
  MapPin,
  Heart,
  UserRound,
  Settings,
  X,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const items = [
  {
    name: "My Bookings",
    path: "/bookings",
    icon: Ticket,
  },

  {
    name: "My Profile",
    path: "/profile",
    icon: UserRound,
  },
 
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogout = () => {
    localStorage.removeItem("luxride_token");
    localStorage.removeItem("token");
    onClose?.();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-[100]">

      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close sidebar"
      />

      {/* SIDEBAR */}

      <aside className="relative flex flex-col w-[290px] h-full bg-[#13221a] border-r border-[#c5a66b]/20 p-7 shadow-2xl overflow-y-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-12">

          <button
            type="button"
            onClick={() => {
              navigate("/");
              onClose?.();
            }}
            className="playfair text-2xl text-[#c5a66b]"
          >
            LuxRide
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-[#c5a66b] transition"
            aria-label="Close sidebar"
          >
            <X size={23} />
          </button>

        </div>

        {/* ACCOUNT SECTION */}

        <p className="text-xs tracking-[0.2em] text-gray-500 mb-6">
          YOUR ACCOUNT
        </p>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-3">

          {items.map(({ name, path, icon: Icon, end }) => (

            <NavLink
              key={name}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg p-3 transition-all duration-300 ${
                  isActive
                    ? "bg-[#263f31] text-[#c5a66b] border border-[#c5a66b]/20"
                    : "text-gray-300 hover:bg-[#263f31] hover:text-[#c5a66b]"
                }`
              }
            >

              <Icon size={19} />

              <span className="text-sm font-medium">
                {name}
              </span>

            </NavLink>

          ))}

        </nav>

        {/* LOGOUT */}

        <div className="mt-auto pt-10">

          <div className="border-t border-white/10 pt-6">

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-4 w-full rounded-lg p-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
            >
              <LogOut size={19} />

              <span className="text-sm font-medium">
                Logout
              </span>

            </button>

          </div>

          <p className="text-[10px] tracking-[0.2em] text-gray-600 text-center mt-8">
            LUXRIDE PREMIUM TRAVEL
          </p>

        </div>

      </aside>

    </div>
  );
}
