
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Aarav Sharma",
    role: "Travel Enthusiast",
    review: "The booking experience felt effortless. The website design is beautiful and the overall experience was excellent.",
  },
  {
    name: "Priya Reddy",
    role: "Frequent Traveller",
    review: "I love the clean booking experience and the attention to detail. Looking forward to travelling with LuxRide.",
  },
  {
    name: "Rahul Mehta",
    role: "Business Traveller",
    review: "A refreshing approach to bus travel. Everything feels organised and easy to understand.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#13221a] py-24">
      <div className="lux-container">
        <div className="text-center mb-14">
          <p className="text-[#c5a66b] text-xs tracking-[0.3em] mb-4">
            TRAVELLER STORIES
          </p>

          <h2 className="playfair text-4xl md:text-5xl">
            Words From Our Guests
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="bg-[#0b1511] border border-white/10 p-8"
            >
              <Quote className="text-[#c5a66b] mb-6" size={32} />

              <div className="flex gap-1 text-[#c5a66b] mb-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={15} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-300 leading-8 mb-9">
                "{review.review}"
              </p>

              <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold">{review.name}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  {review.role}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Sample testimonials for website design preview.
        </p>
      </div>
    </section>
  );
}
