
import { UserRound, Headphones } from "lucide-react";

const links = [
  "Home",
  "Destinations",
  "Our Fleet",
  "My Bookings",
];

export default function Navbar({ onLogoClick }) {
  return (
    <header className="relative z-50 border-b border-white/10 bg-[#0b1511]">
      <div className="lux-container min-h-20 flex flex-wrap items-center justify-between gap-4 py-3">

        {/* LOGO — OPENS SIDEBAR */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 text-left cursor-pointer shrink-0"
          aria-label="Open navigation sidebar"
        >
          <div className="w-11 h-11 border border-[#c5a66b] flex items-center justify-center text-[#c5a66b] text-xl playfair">
            LR
          </div>

          <div>
            <h1 className="text-xl tracking-[0.22em] font-bold text-white">
              LUX<span className="text-[#c5a66b]">RIDE</span>
            </h1>

            <p className="text-[9px] tracking-[0.3em] text-gray-400">
              JOURNEY IN LUXURY
            </p>
          </div>
        </button>

        {/* NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm text-gray-300">
          {links.map((link) => (
            <a
              key={link}
              href={
                link === "Home"
                  ? "/"
                  : link === "My Bookings"
                  ? "/bookings"
                  : `/#${link.toLowerCase().replaceAll(" ", "-")}`
              }
              className="hover:text-[#c5a66b] transition whitespace-nowrap"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="hidden lg:flex items-center gap-4">

          <a
            href="/login"
            className="flex items-center gap-2 text-sm hover:text-[#c5a66b] transition"
          >
            <UserRound size={17} />
            Sign In
          </a>

          <a
            href="/support"
            className="text-[#c5a66b] hover:text-white transition"
            aria-label="Support"
          >
            <Headphones size={20} />
          </a>

          <a
            href="/register"
            className="lux-button text-sm whitespace-nowrap"
          >
            Get Started
          </a>

        </div>
      </div>
    </header>
  );
}
