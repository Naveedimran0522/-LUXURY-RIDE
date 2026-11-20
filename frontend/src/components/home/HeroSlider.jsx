
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const slides = [
  {
    subtitle: "THE ART OF LUXURY TRAVEL",
    title: "Travel Beyond\nExpectations.",
    description:
      "Experience extraordinary journeys with exceptional comfort, elegant interiors and premium hospitality.",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1800&q=85",
  },
  {
    subtitle: "DISCOVER A BETTER JOURNEY",
    title: "Your Comfort.\nOur Promise.",
    description:
      "Every journey deserves a beautiful beginning. Discover a new standard of luxury bus travel.",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1800&q=85",
  },
  {
    subtitle: "YOUR NEXT ADVENTURE AWAITS",
    title: "The Journey\nIs The Luxury.",
    description:
      "Find your perfect route and reserve your seat in just a few effortless steps.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  const changeSlide = (direction) => {
    setActive((current) =>
      (current + direction + slides.length) % slides.length
    );
  };

  return (
    <section
      id="home"
      className="relative min-h-[650px] md:min-h-[720px] overflow-hidden"
    >
      {slides.map((item, index) => (
        <div
          key={item.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8,18,13,.95) 0%, rgba(8,18,13,.78) 48%, rgba(8,18,13,.18) 100%), url("${item.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      <div className="relative lux-container min-h-[650px] md:min-h-[720px] flex items-center">
        <div className="max-w-2xl py-24">
          <div className="flex items-center gap-3 text-[#c5a66b] text-xs tracking-[0.3em] mb-8">
            <Sparkles size={17} />
            {slide.subtitle}
          </div>

          <h2 className="playfair text-6xl md:text-8xl leading-[1.05] whitespace-pre-line mb-8">
            {slide.title}
          </h2>

          <p className="max-w-lg text-gray-300 leading-8 text-base md:text-lg mb-10">
            {slide.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#booking" className="lux-button flex items-center gap-3">
              Explore Journeys
              <ArrowRight size={18} />
            </a>

            <a
              href="#our-fleet"
              className="border border-white/30 px-7 py-4 hover:border-[#c5a66b] hover:text-[#c5a66b] transition"
            >
              Discover Our Fleet
            </a>
          </div>

          <div className="flex gap-6 mt-12 text-sm text-gray-300">
            <span className="flex gap-2 items-center">
              <ShieldCheck className="text-[#c5a66b]" size={18} />
              Premium Comfort
            </span>
            <span className="flex gap-2 items-center">
              <Sparkles className="text-[#c5a66b]" size={18} />
              Elegant Journeys
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-[4%] flex items-center gap-4">
        <span className="text-[#c5a66b] text-sm">
          0{active + 1} / 0{slides.length}
        </span>

        <button
          onClick={() => changeSlide(-1)}
          className="w-12 h-12 border border-white/30 flex items-center justify-center hover:border-[#c5a66b]"
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => changeSlide(1)}
          className="w-12 h-12 border border-white/30 flex items-center justify-center hover:border-[#c5a66b]"
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
