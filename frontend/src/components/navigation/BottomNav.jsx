
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* LUXRIDE — BOTTOM NAVIGATION */

import {
  House,
  Search,
  Ticket,
  Heart,
  UserRound,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const items = [
  { label: "Home", path: "/", icon: House },
  { label: "Explore", path: "/search", icon: Search },
  { label: "Bookings", path: "/bookings", icon: Ticket },
  { label: "Saved", path: "/saved", icon: Heart },
  { label: "Profile", path: "/profile", icon: UserRound },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#13221a]/95 backdrop-blur-xl border-t border-[#c5a66b]/20">
      <div className="flex justify-around items-center py-3">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] ${
                isActive
                  ? "text-[#c5a66b]"
                  : "text-gray-400"
              }`
            }
          >
            <Icon size={21} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
