
import { ArrowRight, Armchair, Wifi, Snowflake, Tv } from "lucide-react";

const fleet = [
  {
    name: "Luxury Sleeper",
    type: "PREMIUM SLEEPER",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&q=85",
    description: "Relax in spacious sleeper cabins designed for overnight comfort.",
    features: ["Private Sleeper", "Wi-Fi", "AC"],
  },
  {
    name: "Executive Seater",
    type: "BUSINESS CLASS",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&q=85",
    description: "Travel with elegant seating and exceptional convenience.",
    features: ["Recliner Seats", "Entertainment", "AC"],
  },
];

export default function FleetShowcase() {
  const icons = [Armchair, Wifi, Snowflake];

  return (
    <section id="our-fleet" className="bg-[#13221a] py-24">
      <div className="lux-container">
        <p className="text-[#c5a66b] tracking-[0.3em] text-xs mb-4">
          TRAVEL IN YOUR STYLE
        </p>

        <h2 className="playfair text-4xl md:text-5xl mb-12">
          Discover Our Fleet
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {fleet.map((bus) => (
            <article
              key={bus.name}
              className="bg-[#0b1511] border border-white/10 overflow-hidden group"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={bus.image}
                  alt={bus.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              <div className="p-8">
                <p className="text-[#c5a66b] text-xs tracking-[0.25em] mb-3">
                  {bus.type}
                </p>

                <h3 className="playfair text-3xl mb-4">
                  {bus.name}
                </h3>

                <p className="text-gray-400 leading-7 mb-7">
                  {bus.description}
                </p>

                <div className="flex flex-wrap gap-5 mb-8">
                  {bus.features.map((feature, index) => {
                    const Icon = icons[index];

                    return (
                      <span key={feature} className="flex gap-2 items-center text-xs text-gray-300">
                        <Icon size={16} className="text-[#c5a66b]" />
                        {feature}
                      </span>
                    );
                  })}
                </div>

                <a
                  href="#booking"
                  className="flex items-center gap-3 text-[#c5a66b] text-sm"
                >
                  Explore journeys <ArrowRight size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
