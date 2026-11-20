
import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

import HeroSlider from "../components/home/HeroSlider";
import FeaturedDestinations from "../components/home/FeaturedDestinations";
import FleetShowcase from "../components/home/FleetShowcase";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";

import BusSearch from "../components/booking/BusSearch";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1511] text-white">

      <div className="bg-[#c5a66b] text-[#111a13] text-center py-2 text-xs tracking-wider">
        EXPERIENCE LUXURY TRAVEL — YOUR JOURNEY STARTS HERE
      </div>

      <Navbar onLogoClick={() => setSidebarOpen(true)} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <HeroSlider />

      <BusSearch />

      <FeaturedDestinations />

      <FleetShowcase />

      <WhyChooseUs />

      <Testimonials />

      <Footer />

    </div>
  );
}
