"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollDatePicker from "@/components/ScrollDatePicker";

/* ─────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────── */

const BIRTHDAY = new Date(2002, 9, 8); // Oct 8, 2002 (month is 0-indexed)

const SURVIVAL_QUOTES = [
  "Every day you wake up is another chance to change your life.",
  "In the end, it's not the years in your life that count. It's the life in your years. — Abraham Lincoln",
  "You only live once, but if you do it right, once is enough. — Mae West",
  "Don't count the days, make the days count. — Muhammad Ali",
  "Life is either a daring adventure or nothing at all. — Helen Keller",
  "The biggest adventure you can take is to live the life of your dreams. — Oprah Winfrey",
  "Keep going. Every heartbeat is proof that you're meant to be here.",
];

interface TimeUnits {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* ─────────────────────────────────────────────
   Life Counter Hook (local to this component)
   ───────────────────────────────────────────── */

function useLifeCounter(): TimeUnits | null {
  const [time, setTime] = useState<TimeUnits | null>(null);

  useEffect(() => {
    function calculate(): TimeUnits {
      const now = new Date();

      let years = now.getFullYear() - BIRTHDAY.getFullYear();
      let months = now.getMonth() - BIRTHDAY.getMonth();
      let days = now.getDate() - BIRTHDAY.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      return {
        years,
        months,
        days,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };
    }

    setTime(calculate());
    const interval = setInterval(() => setTime(calculate()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

/* ─────────────────────────────────────────────
   Counter Card Component
   ───────────────────────────────────────────── */

function CounterCard({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="group relative flex flex-col items-center gap-1.5 px-4 py-3 md:px-6 md:py-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] min-w-[70px] md:min-w-[100px] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-violet-500/0 group-hover:bg-violet-500/[0.04] transition-colors duration-300" />

      <span className="relative text-2xl md:text-4xl font-bold text-white tabular-nums tracking-tight">
        {String(value).padStart(2, "0")}
      </span>
      <span className="relative text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Counter Component
   ───────────────────────────────────────────── */

export default function SurvivalCounter() {
  const time = useLifeCounter();

  // Visitor survival calculator state
  const [visitorBirthday, setVisitorBirthday] = useState<string>("");
  const [visitorTime, setVisitorTime] = useState<TimeUnits | null>(null);
  const [showVisitorMode, setShowVisitorMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [survivalQuote, setSurvivalQuote] = useState("");

  useEffect(() => {
    if (!visitorBirthday) return;
    const bday = new Date(visitorBirthday);
    if (isNaN(bday.getTime()) || bday >= new Date()) return;

    function calc(): TimeUnits {
      const now = new Date();
      let years = now.getFullYear() - bday.getFullYear();
      let months = now.getMonth() - bday.getMonth();
      let days = now.getDate() - bday.getDate();
      if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      return {
        years,
        months,
        days,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };
    }

    setVisitorTime(calc());
    setShowVisitorMode(true);
    setSurvivalQuote(
      SURVIVAL_QUOTES[Math.floor(Math.random() * SURVIVAL_QUOTES.length)]
    );
    const interval = setInterval(() => setVisitorTime(calc()), 1000);
    return () => clearInterval(interval);
  }, [visitorBirthday]);

  const handleResetVisitor = () => {
    setShowVisitorMode(false);
    setVisitorBirthday("");
    setVisitorTime(null);
    setShowDatePicker(false);
  };

  const activeTime = showVisitorMode ? visitorTime : time;

  return (
    <div className="space-y-8 w-full flex flex-col items-center">
      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
      >
        {showVisitorMode ? "You" : "I"} have{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
          survived
        </span>
      </motion.h1>

      {/* Counter grid */}
      {activeTime ? (
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          <CounterCard value={activeTime.years} label="Years" delay={0.1} />
          <CounterCard value={activeTime.months} label="Months" delay={0.15} />
          <CounterCard value={activeTime.days} label="Days" delay={0.2} />
          <CounterCard value={activeTime.hours} label="Hours" delay={0.25} />
          <CounterCard value={activeTime.minutes} label="Minutes" delay={0.3} />
          <CounterCard value={activeTime.seconds} label="Seconds" delay={0.35} />
        </div>
      ) : (
        /* Placeholder to prevent layout shift during SSR hydration */
        <div className="h-[88px] md:h-[104px]" />
      )}

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 text-base md:text-lg flex items-center justify-center gap-2.5"
      >
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
        ...on this beautiful planet
      </motion.p>

      {/* Visitor survival calculator controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex flex-col items-center gap-3 w-full"
      >
        {showVisitorMode ? (
          /* Show motivational quote + back button */
          <div className="max-w-lg text-center space-y-3 px-4">
            <p className="text-sm md:text-base text-gray-400 italic leading-relaxed">
              &ldquo;{survivalQuote}&rdquo;
            </p>
            <button
              onClick={handleResetVisitor}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
            >
              ← Back to Pasindu&apos;s counter
            </button>
          </div>
        ) : showDatePicker ? (
          /* Show scroll date picker */
          <ScrollDatePicker
            onSelect={(dateStr) => setVisitorBirthday(dateStr)}
            onCancel={() => setShowDatePicker(false)}
          />
        ) : (
          /* Show calculate button */
          <button
            onClick={() => setShowDatePicker(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-xs font-medium hover:bg-violet-500/20 hover:border-violet-500/30 transition-all"
            id="calculate-yours-btn"
          >
            🎂 Calculate yours
          </button>
        )}
      </motion.div>
    </div>
  );
}
