
import React from "react";
import {
  BusFront,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4z" />
    </svg>
  );
}

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Newsletter subscription will be connected in a future phase.");
  };

  return (
    <footer className="bg-[#080f0b] border-t border-[#c5a66b]/20 pt-16 pb-8">
      <div className="lux-container">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-14">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-7">
              <BusFront className="text-[#c5a66b]" size={32} />

              <span className="text-xl tracking-[0.2em] font-bold">
                LUX<span className="text-[#c5a66b]">RIDE</span>
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-7 max-w-xs">
              Discover a more refined way to travel.
              Your journey deserves something extraordinary.
            </p>

            <div className="flex gap-5 mt-7">

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-[#c5a66b] transition"
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-[#c5a66b] transition"
              >
                <FacebookIcon />
              </a>

            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-[#c5a66b] tracking-widest text-xs mb-7">
              QUICK LINKS
            </h3>

            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <a href="/" className="hover:text-white">Home</a>
              <a href="#destinations" className="hover:text-white">Destinations</a>
              <a href="#our-fleet" className="hover:text-white">Our Fleet</a>
              <a href="#booking" className="hover:text-white">Book a Journey</a>
            </div>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div>
            <h3 className="text-[#c5a66b] tracking-widest text-xs mb-7">
              CUSTOMER SUPPORT
            </h3>

            <div className="flex flex-col gap-5 text-sm text-gray-400">

              <a href="/support" className="flex gap-3 items-center hover:text-[#c5a66b]">
                <Phone size={17} /> Contact Support
              </a>

              <a href="/contact" className="flex gap-3 items-center hover:text-[#c5a66b]">
                <Mail size={17} /> Send an Enquiry
              </a>

              <span className="flex gap-3 items-center">
                <MapPin size={17} /> India
              </span>

            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-[#c5a66b] tracking-widest text-xs mb-7">
              TRAVEL UPDATES
            </h3>

            <p className="text-sm text-gray-400 leading-7 mb-5">
              Stay connected for travel updates and new experiences.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex border border-white/20"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="min-w-0 w-full bg-transparent p-3 text-sm outline-none text-white"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-[#c5a66b] text-black px-4 hover:bg-[#dfc58f] transition"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-500">

          <p>
            © {new Date().getFullYear()} LuxRide. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms & Conditions</a>
          </div>

        </div>

      </div>
    </footer>
  );
}
