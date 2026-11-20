
import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  SkipForward,
  ShieldCheck,
  Armchair,
  MapPinned,
  Clock3,
  Sparkles,
} from "lucide-react";

const slides = [
  {
    tag: "WELCOME TO LUXRIDE",
    title: "Discover The Art Of Luxury Travel.",
    description:
      "Step into a world where every journey is designed around comfort, elegance and unforgettable experiences.",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=85",
    icon: Sparkles,
  },
  {
    tag: "EXCEPTIONAL COMFORT",
    title: "Your Seat. Your Sanctuary.",
    description:
      "Enjoy thoughtfully designed interiors, spacious seating and an elevated travel experience.",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1400&q=85",
    icon: Armchair,
  },
  {
    tag: "EXPLORE MORE",
    title: "Beautiful Journeys Await.",
    description:
      "Discover exciting destinations and convenient routes with a seamless booking experience.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=85",
    icon: MapPinned,
  },
  {
    tag: "EFFORTLESS BOOKINGS",
    title: "Your Journey, Simplified.",
    description:
      "Find your bus, choose your seat and confirm your ticket in just a few simple steps.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85",
    icon: Clock3,
  },
  {
    tag: "TRAVEL WITH CONFIDENCE",
    title: "Luxury Meets Peace Of Mind.",
    description:
      "Enjoy secure booking, convenient payments and dedicated journey support.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85",
    icon: ShieldCheck,
  },
];

export default function Onboarding({ onComplete }) {
  const [active, setActive] = useState(0);

  const slide = slides[active];
  const Icon = slide.icon;

  const next = () => {
    if (active === 4) {
      onComplete();
    } else {
      setActive((previous) => previous + 1);
    }
  };

  const previous = () => {
    setActive((previous) => Math.max(0, previous - 1));
  };

  return (
    <main className="min-h-screen bg-[#0b1511] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid md:grid-cols-2 border border-[#c5a66b]/20 bg-[#13221a] overflow-hidden">

        <div
          className="relative min-h-[320px] md:min-h-[650px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(0deg,rgba(8,18,13,.65),transparent),url("${slide.image}")`,
          }}
        >
          <div className="absolute top-6 left-6 text-[#c5a66b] tracking-[0.25em] text-xs">
            LUXRIDE
          </div>

          <div className="absolute bottom-8 left-8">
            <p className="text-white/80 text-sm tracking-widest">
              EXPERIENCE THE EXTRAORDINARY
            </p>
            <p className="playfair text-3xl mt-2">
              Travel Beautifully.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 md:p-14 min-h-[500px]">
          <div className="flex items-center justify-between mb-14">
            <span className="text-[#c5a66b] tracking-[0.2em] text-xs">
              {slide.tag}
            </span>

            <button
              onClick={onComplete}
              className="text-gray-400 hover:text-[#c5a66b] text-sm flex gap-2 items-center"
            >
              Skip <SkipForward size={15} />
            </button>
          </div>

          <div className="text-[#c5a66b] mb-7">
            <Icon size={38} />
          </div>

          <h1 className="playfair text-4xl md:text-5xl leading-tight mb-6">
            {slide.title}
          </h1>

          <p className="text-gray-400 leading-8 mb-12">
            {slide.description}
          </p>

          <div className="flex gap-2 mb-10">
            {slides.map((item, index) => (
              <div
                key={item.tag}
                className={`h-1.5 transition-all duration-300 ${
                  active === index
                    ? "w-12 bg-[#c5a66b]"
                    : "w-5 bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              0{active + 1} / 05
            </span>

            <div className="flex gap-3">
              {active > 0 && (
                <button
                  onClick={previous}
                  className="w-12 h-12 border border-white/20 flex items-center justify-center hover:border-[#c5a66b]"
                  aria-label="Previous"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              <button
                onClick={next}
                className="lux-button flex items-center gap-3"
              >
                {active === 4 ? "Get Started" : "Continue"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
