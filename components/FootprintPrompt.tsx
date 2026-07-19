"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

export default function FootprintPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already left a footprint or dismissed the prompt
    const hasLeft = localStorage.getItem("has_left_footprint") === "true";
    const isDismissed = localStorage.getItem("footprint_prompt_dismissed") === "true";

    if (!hasLeft && !isDismissed) {
      // Display the toast after a short delay (e.g. 5 seconds) to let page content load first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("footprint_prompt_dismissed", "true");
  };

  const handleAction = () => {
    setIsVisible(false);
    const targetSection = document.getElementById("traveler-constellation");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Look for the "Leave Your Footprint" button in the canvas and simulate a click to make it super seamless
      setTimeout(() => {
        const btn = targetSection.querySelector("button[disabled='false']");
        if (btn) {
          (btn as HTMLButtonElement).click();
        } else {
          // If already clicked or active, try finding by text/aria
          const buttons = targetSection.querySelectorAll("button");
          buttons.forEach((b) => {
            if (b.textContent?.includes("Leave Your Footprint")) {
              b.click();
            }
          });
        }
      }, 800);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-start gap-3"
        >
          {/* Sparkle Icon */}
          <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white flex-shrink-0 animate-pulse">
            <Sparkles className="w-4 h-4 text-white fill-white" />
          </div>

          {/* Prompt Body */}
          <div className="flex-1 space-y-2">
            <h4 className="text-xs font-bold text-white tracking-wide">
              Leave your mark in space
            </h4>
            <p className="text-[11px] text-gray-400 leading-normal">
              You&apos;ve landed on this digital planet. Plant your glowing star in the shared visitor constellation!
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleAction}
                className="text-[10px] font-bold text-white hover:text-zinc-300 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Plant Star
              </button>
              <button
                onClick={handleDismiss}
                className="text-[10px] font-medium text-gray-500 hover:text-gray-400 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Direct Close Button */}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-gray-600 hover:text-gray-400 transition-colors cursor-pointer"
            aria-label="Dismiss prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
