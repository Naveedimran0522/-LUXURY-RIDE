
import {
  ShieldCheck,
  Headphones,
  CreditCard,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Reservations",
    description: "A protected booking experience with secure account authentication.",
  },
  {
    icon: Sparkles,
    title: "Premium Comfort",
    description: "Thoughtfully designed travel experiences with comfort in mind.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Convenient and secure online payment options.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Get assistance whenever you need help with your journey.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="lux-container py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-[#c5a66b] tracking-[0.3em] text-xs mb-4">
          THE LUXRIDE PROMISE
        </p>

        <h2 className="playfair text-4xl md:text-5xl mb-5">
          Travel Better. Travel Beautifully.
        </h2>

        <p className="text-gray-400 leading-7">
          Every detail is thoughtfully considered to make your
          travel experience more enjoyable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="border border-white/10 bg-[#13221a] p-8 hover:border-[#c5a66b]/60 transition"
          >
            <div className="w-14 h-14 border border-[#c5a66b]/50 flex items-center justify-center text-[#c5a66b] mb-7">
              <Icon size={26} />
            </div>

            <h3 className="playfair text-2xl mb-4">{title}</h3>

            <p className="text-gray-400 text-sm leading-7">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
