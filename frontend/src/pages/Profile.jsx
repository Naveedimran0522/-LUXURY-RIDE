
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — PREMIUM MY PROFILE
DYNAMIC USER INITIAL AVATAR
*/

import { useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Ticket,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0b1511] flex items-center justify-center px-4">
        <section className="w-full max-w-md rounded-3xl border border-[#c5a66b]/30 bg-[#14231c] p-8 text-center text-white">
          <UserRound size={42} className="mx-auto mb-4 text-[#c5a66b]" />

          <h1 className="text-2xl font-semibold">
            Welcome to LuxRide
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Please log in to view your profile.
          </p>

          <button
            className="mt-7 w-full rounded-xl bg-[#c5a66b] py-3 font-semibold text-[#101b15]"
            onClick={() => navigate("/login")}
          >
            LOGIN NOW
          </button>
        </section>
      </main>
    );
  }

  const displayName = user.name || "LuxRide Member";
  const displayEmail = user.email || "Email unavailable";

  // FIRST ALPHABET OF USER NAME
  const avatarLetter = displayName
    .trim()
    .charAt(0)
    .toUpperCase() || "L";

  const isVerified = Boolean(user.emailVerified);

  return (
    <main className="min-h-screen bg-[#0b1511] px-4 py-8 text-white sm:py-12">

      <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-[30px] border border-[#c5a66b]/25 bg-gradient-to-b from-[#1b3025] to-[#101b15] shadow-2xl">

        {/* HEADER */}
        <div className="relative border-b border-white/10 px-6 pb-9 pt-6 sm:px-10">

          <button
            onClick={() => navigate("/")}
            className="mb-9 flex items-center gap-2 text-sm text-[#c5a66b] transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>

          <div className="flex flex-col items-center text-center">

            {/* PREMIUM INITIAL AVATAR */}
            <div className="relative mb-6">

              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#e8cf91] via-[#b99558] to-[#72552c] p-[3px] shadow-[0_0_40px_rgba(197,166,107,0.22)]">

                <div className="flex h-full w-full items-center justify-center rounded-full border border-[#e5c88b]/40 bg-gradient-to-br from-[#263e30] to-[#0b1511]">

                  <span className="font-serif text-6xl font-bold text-[#e6c989]">
                    {avatarLetter}
                  </span>

                </div>
              </div>

              {/* VERIFIED BADGE */}
              {isVerified && (
                <div className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#14231c] bg-[#c5a66b] text-[#102017]">
                  <ShieldCheck size={19} />
                </div>
              )}

            </div>

            <p className="text-[10px] font-semibold tracking-[0.35em] text-[#c5a66b]">
              YOUR LUXRIDE ACCOUNT
            </p>

            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-wide sm:text-4xl">
              {displayName}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Welcome to a more refined journey.
            </p>

            <div className="mt-5 rounded-full border border-[#c5a66b]/30 bg-[#c5a66b]/10 px-5 py-2 text-[10px] font-semibold tracking-[0.2em] text-[#e2c68d]">
              LUXRIDE MEMBER
            </div>

          </div>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="px-6 py-8 sm:px-10">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#e5cf9e]">
              Personal Details
            </h2>

            <span className="text-[10px] tracking-widest text-gray-500">
              ACCOUNT
            </span>
          </div>

          <div className="space-y-3">

            {/* NAME */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="rounded-xl bg-[#c5a66b]/10 p-3 text-[#c5a66b]">
                <UserRound size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-widest text-gray-500">
                  FULL NAME
                </p>
                <p className="mt-1 truncate text-sm font-medium">
                  {displayName}
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="rounded-xl bg-[#c5a66b]/10 p-3 text-[#c5a66b]">
                <Mail size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-widest text-gray-500">
                  EMAIL ADDRESS
                </p>
                <p className="mt-1 break-all text-sm font-medium">
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* VERIFICATION */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="rounded-xl bg-[#c5a66b]/10 p-3 text-[#c5a66b]">
                <ShieldCheck size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-widest text-gray-500">
                  EMAIL VERIFICATION
                </p>

                <p className={`mt-1 text-sm font-medium ${
                  isVerified ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {isVerified ? "Verified Account" : "Not Verified"}
                </p>
              </div>
            </div>

            {/* ACCOUNT TYPE */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="rounded-xl bg-[#c5a66b]/10 p-3 text-[#c5a66b]">
                <CalendarDays size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-widest text-gray-500">
                  ACCOUNT TYPE
                </p>
                <p className="mt-1 text-sm font-medium capitalize">
                  {user.role || "Customer"}
                </p>
              </div>
            </div>

          </div>

          {/* MY BOOKINGS */}
          <button
            onClick={() => navigate("/bookings")}
            className="mt-8 flex w-full items-center gap-4 rounded-2xl border border-[#c5a66b]/30 bg-[#c5a66b]/10 p-5 text-left transition hover:bg-[#c5a66b]/20"
          >
            <div className="rounded-xl bg-[#c5a66b] p-3 text-[#101b15]">
              <Ticket size={21} />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-[#e8d3a4]">
                My Bookings
              </p>
              <p className="mt-1 text-xs text-gray-400">
                View your journeys and reservations
              </p>
            </div>

            <ChevronRight className="text-[#c5a66b]" size={20} />
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/5 py-4 font-semibold text-red-300 transition hover:bg-red-500/15"
          >
            <LogOut size={19} />
            SIGN OUT
          </button>

          <p className="mt-8 text-center text-[9px] tracking-[0.3em] text-gray-600">
            LUXRIDE • PREMIUM JOURNEY EXPERIENCE
          </p>

        </div>
      </section>
    </main>
  );
}
