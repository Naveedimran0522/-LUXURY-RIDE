
import { useEffect } from "react";
import { BusFront, Sparkles } from "lucide-react";

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <main className="fixed inset-0 z-[200] bg-[#0b1511] flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="w-24 h-24 mx-auto border border-[#c5a66b] flex items-center justify-center mb-7">
          <BusFront size={48} className="text-[#c5a66b]" />
        </div>

        <h1 className="playfair text-5xl tracking-[0.25em]">
          LUX<span className="text-[#c5a66b]">RIDE</span>
        </h1>

        <div className="flex justify-center items-center gap-2 mt-4 text-[#c5a66b]">
          <Sparkles size={13} />
          <p className="text-[10px] tracking-[0.4em]">
            JOURNEY IN LUXURY
          </p>
          <Sparkles size={13} />
        </div>

        <div className="w-36 h-[2px] bg-white/10 mx-auto mt-10 overflow-hidden">
          <div className="h-full bg-[#c5a66b] animate-[loading_2.5s_ease-in-out]" />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </main>
  );
}
