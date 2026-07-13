"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Compass, Globe, Info, MousePointerClick } from "lucide-react";
import { getDeviceId } from "@/lib/device";
import { Footprint } from "@/types";

const COLOR_PRESETS = [
  { name: "Purple", key: "purple", value: "from-violet-400 to-purple-600", glow: "rgba(167, 139, 250, 0.4)", text: "text-violet-400" },
  { name: "Blue", key: "blue", value: "from-cyan-400 to-blue-600", glow: "rgba(34, 211, 238, 0.4)", text: "text-cyan-400" },
  { name: "Green", key: "green", value: "from-emerald-400 to-teal-600", glow: "rgba(52, 211, 153, 0.4)", text: "text-emerald-400" },
  { name: "Yellow", key: "yellow", value: "from-amber-400 to-orange-500", glow: "rgba(251, 191, 36, 0.4)", text: "text-amber-400" },
  { name: "Pink", key: "pink", value: "from-pink-400 to-rose-600", glow: "rgba(247, 114, 138, 0.4)", text: "text-pink-400" },
  { name: "Fuchsia", key: "fuchsia", value: "from-fuchsia-400 to-pink-600", glow: "rgba(232, 121, 249, 0.4)", text: "text-fuchsia-400" },
];

const EMOJI_PRESETS = ["✨", "🚀", "🪐", "👾", "👽", "💫", "💻", "🍀", "🌸", "🔥", "🌈", "🎈"];

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
}

export default function FootprintCanvas() {
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<Footprint | null>(null);
  const [deviceId, setDeviceId] = useState("");
  
  // Placement Flow State
  const [showFormModal, setShowFormModal] = useState(false);
  const [placementMode, setPlacementMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    emoji: "✨",
    message: "",
    color: "purple",
  });
  
  // Placement Interaction State
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hasLeftFootprint, setHasLeftFootprint] = useState(false);

  useEffect(() => {
    // Client-only initialization
    const id = getDeviceId();
    setDeviceId(id);
    
    const left = localStorage.getItem("has_left_footprint") === "true";
    setHasLeftFootprint(left);

    fetchFootprints();
  }, []);

  const fetchFootprints = async () => {
    try {
      const res = await fetch("/api/footprints");
      if (res.ok) {
        const data = await res.json();
        setFootprints(data);
      }
    } catch (err) {
      console.error("Failed to load footprints", err);
    } finally {
      setLoading(false);
    }
  };

  // Track cursor position inside the map container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleContainerClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placementMode || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Trigger local particle burst at click spot
    triggerBurst(x, y, formData.color);

    // Disable placement mode immediately to prevent multiple clicks
    setPlacementMode(false);

    try {
      const res = await fetch("/api/footprints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          name: formData.name || "Anonymous Traveler",
          emoji: formData.emoji,
          message: formData.message,
          color: formData.color,
          x,
          y,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          // Append new star to the list
          setFootprints((prev) => [...prev, result.footprint]);
          setHasLeftFootprint(true);
          localStorage.setItem("has_left_footprint", "true");
        }
      }
    } catch (err) {
      console.error("Failed to save footprint", err);
    }
  };

  const triggerBurst = (x: number, y: number, colorKey: string) => {
    const selectedColor = COLOR_PRESETS.find(c => c.key === colorKey) || COLOR_PRESETS[0];
    const newParticles: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 3,
      color: selectedColor.glow,
    }));
    
    setParticles(newParticles);

    // Fade out particles
    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  // Helper to calculate distance between footprints to draw lines
  const getConstellationLines = () => {
    const lines: { id: string; p1: Footprint; p2: Footprint }[] = [];
    const maxDistance = 18; // Max distance percentage to draw a line

    for (let i = 0; i < footprints.length; i++) {
      for (let j = i + 1; j < footprints.length; j++) {
        const p1 = footprints[i];
        const p2 = footprints[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          lines.push({
            id: `${p1.id}-${p2.id}`,
            p1,
            p2,
          });
        }
      }
    }
    return lines;
  };

  const selectedPreset = COLOR_PRESETS.find((c) => c.key === formData.color) || COLOR_PRESETS[0];

  return (
    <section className="relative py-24 px-4 overflow-hidden border-t border-white/[0.04] bg-black">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-950/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header Block */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-medium tracking-wide">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            The Traveler Constellation
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Leave a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
              Footprint
            </span>{" "}
            in Space
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Every visitor on this planet leaves a unique mark. Plant your star in the sky, choose your aura, and tell us where you are traveling from.
          </p>
        </div>

        {/* Constellation Container */}
        <div className="relative">
          {/* Main Map Box */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringContainer(true)}
            onMouseLeave={() => setIsHoveringContainer(false)}
            onClick={handleContainerClick}
            className={`relative w-full h-[450px] md:h-[500px] bg-white/[0.01] border rounded-3xl overflow-hidden backdrop-blur-sm transition-all duration-300 ${
              placementMode
                ? "border-violet-500/50 cursor-crosshair shadow-lg shadow-violet-500/5"
                : "border-white/[0.08]"
            }`}
          >
            {/* Dark grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Constellation Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <AnimatePresence>
                {getConstellationLines().map((line) => (
                  <motion.line
                    key={line.id}
                    x1={`${line.p1.x}%`}
                    y1={`${line.p1.y}%`}
                    x2={`${line.p2.x}%`}
                    y2={`${line.p2.y}%`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="stroke-violet-400/30 stroke-[0.75]"
                  />
                ))}
              </AnimatePresence>
            </svg>

            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-violet-400 animate-spin" />
                Reading the stars...
              </div>
            ) : footprints.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <p className="text-gray-500 text-sm mb-1">The digital sky is quiet.</p>
                <p className="text-gray-600 text-xs">Be the first star to guide the path.</p>
              </div>
            ) : null}

            {/* Render Constellation Stars */}
            {footprints.map((star) => {
              const colorPreset = COLOR_PRESETS.find((c) => c.key === star.color) || COLOR_PRESETS[0];
              const isHovered = hoveredStar?.id === star.id;

              return (
                <div
                  key={star.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  style={{ left: `${star.x}%`, top: `${star.y}%` }}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                >
                  {/* Pulsing Core Star */}
                  <button
                    className={`relative w-3.5 h-3.5 rounded-full bg-gradient-to-r ${
                      colorPreset.value
                    } transition-transform duration-300 ${
                      isHovered ? "scale-150" : "scale-100"
                    }`}
                    style={{
                      boxShadow: `0 0 14px 4px ${colorPreset.glow}`,
                    }}
                    aria-label={`Visitor ${star.name}`}
                  >
                    {/* Tiny Centered Emoji Indicator */}
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {star.emoji}
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Click/Touch Placement Preview Star */}
            {placementMode && isHoveringContainer && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedPreset.value} animate-pulse`}
                  style={{ boxShadow: `0 0 16px 6px ${selectedPreset.glow}` }}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] text-white py-0.5 px-2 rounded border border-white/10 whitespace-nowrap">
                  Click to plant {formData.emoji}
                </div>
              </div>
            )}

            {/* Particle Explosion effect elements */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 1, scale: 1 }}
                animate={{
                  left: `${p.x + Math.cos(p.angle) * p.speed * 3}%`,
                  top: `${p.y + Math.sin(p.angle) * p.speed * 3}%`,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute w-1.5 h-1.5 rounded-full z-40"
                style={{
                  backgroundColor: p.color,
                  boxShadow: `0 0 8px ${p.color}`,
                }}
              />
            ))}

            {/* Holographic Tooltip Popover */}
            <AnimatePresence>
              {hoveredStar && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-6 left-6 right-6 md:left-8 md:right-auto md:w-80 p-5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 z-40 pointer-events-none shadow-2xl flex flex-col gap-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{hoveredStar.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm truncate">
                        {hoveredStar.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                        {new Date(hoveredStar.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-400 font-medium">
                      <Compass className="w-3 h-3 text-violet-400" />
                      <span className="max-w-[70px] truncate">{hoveredStar.city}</span>
                    </div>
                  </div>

                  {hoveredStar.message && (
                    <div className="text-xs text-gray-300 italic bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg leading-relaxed relative">
                      &ldquo;{hoveredStar.message}&rdquo;
                    </div>
                  )}

                  <div className="text-[9px] text-gray-600 self-end">
                    Origin: {hoveredStar.country}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Panel */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl">
            <div className="flex items-center gap-2.5 text-xs text-gray-500 text-center sm:text-left">
              <Info className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span>
                {placementMode
                  ? "Click anywhere inside the dark grid boundaries above to place your star."
                  : `Currently tracking ${footprints.length} visitor marks from around the globe.`}
              </span>
            </div>

            {!placementMode && (
              <button
                onClick={() => {
                  if (hasLeftFootprint) {
                    alert("You have already left your star in the sky! Thank you for traveling through.");
                    return;
                  }
                  setShowFormModal(true);
                }}
                disabled={hasLeftFootprint}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                  hasLeftFootprint
                    ? "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-200 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600 fill-violet-600" />
                {hasLeftFootprint ? "Mark Planted ✨" : "Leave Your Footprint"}
              </button>
            )}

            {placementMode && (
              <button
                onClick={() => setPlacementMode(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Cancel Placement
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Glassmorphic Form Dialog Modal */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowFormModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-violet-400" />
                  Traveler Details
                </h3>
                <p className="text-xs text-gray-500">
                  Configure your star before planting it in the constellation.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="traveler-name" className="text-xs font-semibold text-gray-400">
                    Your Name / Alias
                  </label>
                  <input
                    id="traveler-name"
                    type="text"
                    maxLength={20}
                    placeholder="e.g. Elena, Explorer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                {/* Emoji Select */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-400 block">
                    Choose Your Mood Symbol
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setFormData({ ...formData, emoji })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                          formData.emoji === emoji
                            ? "bg-violet-500/20 border border-violet-500 text-white"
                            : "bg-white/5 border border-transparent text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Traveler Note */}
                <div className="space-y-1.5">
                  <label htmlFor="traveler-note" className="text-xs font-semibold text-gray-400">
                    Traveler Note (Optional)
                  </label>
                  <input
                    id="traveler-note"
                    type="text"
                    maxLength={60}
                    placeholder="e.g. Designing from the stars. (Max 60 chars)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>

                {/* Aura Color Preset */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-400 block">
                    Select Your Glow Aura
                  </span>
                  <div className="grid grid-cols-6 gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.key}
                        onClick={() => setFormData({ ...formData, color: preset.key })}
                        className={`h-9 rounded-xl flex items-center justify-center transition-all border ${
                          formData.color === preset.key
                            ? "border-white bg-white/10"
                            : "border-white/5 bg-white/5 hover:bg-white/10"
                        }`}
                        title={preset.name}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${preset.value}`}
                          style={{ boxShadow: `0 0 8px 1px ${preset.glow}` }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Trigger */}
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setPlacementMode(true);
                }}
                className="w-full py-3 rounded-2xl bg-white text-black hover:bg-gray-200 active:scale-[0.98] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MousePointerClick className="w-4 h-4 text-violet-600" />
                Select Star Position on Map
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
