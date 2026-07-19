"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────── */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5; // Must be odd for center alignment
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

/* ─────────────────────────────────────────────
   Scroll Wheel Column
   ───────────────────────────────────────────── */

interface WheelColumnProps {
  items: { value: number; label: string }[];
  selectedValue: number;
  onChange: (value: number) => void;
  width?: string;
}

function WheelColumn({ items, selectedValue, onChange, width = "w-20" }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number>(0);
  const isInitialMount = useRef(true);

  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  // Scroll to the selected item on mount and when value changes externally
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targetScroll = selectedIndex * ITEM_HEIGHT;

    if (isInitialMount.current) {
      container.scrollTop = targetScroll;
      isInitialMount.current = false;
    } else {
      container.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [selectedIndex]);

  const snapToNearest = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentScroll = container.scrollTop;
    const nearestIndex = Math.round(currentScroll / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, items.length - 1));

    container.scrollTo({ top: clampedIndex * ITEM_HEIGHT, behavior: "smooth" });

    if (items[clampedIndex] && items[clampedIndex].value !== selectedValue) {
      onChange(items[clampedIndex].value);
    }
  }, [items, selectedValue, onChange]);

  // Handle scroll end detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isDragging.current) {
          snapToNearest();
        }
      }, 80);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [snapToNearest]);

  // Touch / Mouse handlers for momentum scrolling
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScroll.current = containerRef.current?.scrollTop ?? 0;
    lastY.current = e.clientY;
    lastTime.current = Date.now();
    velocity.current = 0;
    cancelAnimationFrame(rafId.current);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const deltaY = startY.current - e.clientY;
    containerRef.current.scrollTop = startScroll.current + deltaY;

    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (lastY.current - e.clientY) / dt;
    }
    lastY.current = e.clientY;
    lastTime.current = now;
  };

  const handlePointerUp = () => {
    isDragging.current = false;

    // Apply momentum
    if (Math.abs(velocity.current) > 0.3 && containerRef.current) {
      const container = containerRef.current;
      let v = velocity.current * 8;

      const animate = () => {
        v *= 0.92;
        container.scrollTop += v;

        if (Math.abs(v) > 0.5) {
          rafId.current = requestAnimationFrame(animate);
        } else {
          snapToNearest();
        }
      };
      rafId.current = requestAnimationFrame(animate);
    } else {
      snapToNearest();
    }
  };

  return (
    <div className={`relative ${width} select-none`} style={{ height: VISIBLE_ITEMS * ITEM_HEIGHT }}>
      {/* Gradient masks */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: CENTER_INDEX * ITEM_HEIGHT,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.2))",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: CENTER_INDEX * ITEM_HEIGHT,
          background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))",
        }}
      />

      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 z-[5] border-y border-violet-500/30 bg-violet-500/[0.08] rounded-lg pointer-events-none"
        style={{
          top: CENTER_INDEX * ITEM_HEIGHT,
          height: ITEM_HEIGHT,
        }}
      />

      {/* Scrollable area */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll scrollbar-none cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Top padding */}
        <div style={{ height: CENTER_INDEX * ITEM_HEIGHT }} />

        {items.map((item, index) => {
          const isSelected = item.value === selectedValue;
          return (
            <div
              key={`${item.value}-${index}`}
              className={`flex items-center justify-center transition-all duration-150 ${
                isSelected
                  ? "text-white font-semibold text-base"
                  : "text-gray-500 text-sm"
              }`}
              style={{ height: ITEM_HEIGHT }}
              onClick={() => {
                onChange(item.value);
              }}
            >
              {item.label}
            </div>
          );
        })}

        {/* Bottom padding */}
        <div style={{ height: CENTER_INDEX * ITEM_HEIGHT }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Date Picker
   ───────────────────────────────────────────── */

interface ScrollDatePickerProps {
  onSelect: (dateString: string) => void;
  onCancel: () => void;
}

export default function ScrollDatePicker({ onSelect, onCancel }: ScrollDatePickerProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [year, setYear] = useState(2000);

  // Generate options
  const currentYear = now.getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => {
    const y = currentYear - i;
    return { value: y, label: String(y) };
  });

  const months = MONTHS.map((m, i) => ({
    value: i + 1,
    label: m.substring(0, 3),
  }));

  // Calculate days in the selected month/year
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    value: i + 1,
    label: String(i + 1).padStart(2, "0"),
  }));

  // Clamp day if month changes
  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [month, year, day, daysInMonth]);

  const handleConfirm = () => {
    // Validate the date is not in the future
    const selected = new Date(year, month - 1, day);
    if (selected >= now) return;

    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onSelect(dateStr);
  };

  // Check if selected date is valid (not in the future)
  const selectedDate = new Date(year, month - 1, day);
  const isValid = selectedDate < now;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        {/* Picker container */}
        <div className="relative flex items-center gap-1 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-2xl shadow-black/40">
          {/* Columns */}
          <WheelColumn
            items={months}
            selectedValue={month}
            onChange={setMonth}
            width="w-16"
          />

          <WheelColumn
            items={days}
            selectedValue={day}
            onChange={setDay}
            width="w-12"
          />

          <WheelColumn
            items={years}
            selectedValue={year}
            onChange={setYear}
            width="w-16"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-xs text-gray-400 hover:text-gray-200 transition-colors border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
              isValid
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 hover:text-violet-200"
                : "bg-white/[0.03] text-gray-600 border border-white/[0.05] cursor-not-allowed"
            }`}
          >
            See my survival ✨
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
