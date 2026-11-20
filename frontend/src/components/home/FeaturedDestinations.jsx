
import { ArrowUpRight, MapPin } from "lucide-react";

const destinations = [
  {
    name: "Bangalore",
    region: "THE GARDEN CITY",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&q=85",
  },
  {
    name: "Goa",
    region: "THE COASTAL ESCAPE",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=85",
  },
  {
    name: "Mumbai",
    region: "THE CITY OF DREAMS",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=85",
  },
  {
    name: "Hyderabad",
    region: "THE CITY OF PEARLS",
    image: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=900&q=85",
  },
];

export default function FeaturedDestinations() {
  return (
    <section id="destinations" className="lux-container py-24">
      <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
        <div>
          <p className="text-[#c5a66b] tracking-[0.3em] text-xs mb-4">
            EXPLORE THE EXTRAORDINARY
          </p>
          <h2 className="playfair text-4xl md:text-5xl">
            Destinations Worth Discovering
          </h2>
        </div>

        <p className="text-gray-400 max-w-sm leading-7">
          Discover beautiful destinations and make every journey
          a memorable experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {destinations.map((destination, index) => (
          <article
            key={destination.name}
            className="group relative h-[390px] overflow-hidden"
          >
            <img
              src={destination.image}
              alt={destination.name}
              loading="lazy"
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[#c5a66b] text-[10px] tracking-[0.25em] mb-3">
                {destination.region}
              </p>

              <div className="flex justify-between items-center">
                <h3 className="playfair text-3xl">
                  {destination.name}
                </h3>

                <span className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center group-hover:bg-[#c5a66b] group-hover:text-black transition">
                  <ArrowUpRight size={19} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
