"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Star {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    twinkleSpeed: number | null;
}

export const StarsBackground = ({
    starDensity = 0.00015,
    allStarsTwinkle = true,
    twinkleProbability = 0.7,
    minTwinkleSpeed = 0.5,
    maxTwinkleSpeed = 1,
    className,
}: {
    starDensity?: number;
    allStarsTwinkle?: boolean;
    twinkleProbability?: number;
    minTwinkleSpeed?: number;
    maxTwinkleSpeed?: number;
    className?: string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Helper to generate stars
        const generateStars = (width: number, height: number): Star[] => {
            const area = width * height;
            const numStars = Math.floor(area * starDensity);
            return Array.from({ length: numStars }).map(() => {
                const shouldTwinkle =
                    allStarsTwinkle || Math.random() < twinkleProbability;
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 0.05 + 0.5,
                    opacity: Math.random() * 0.5 + 0.5,
                    twinkleSpeed: shouldTwinkle
                        ? minTwinkleSpeed +
                          Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
                        : null,
                };
            });
        };

        // Resize handler (runs outside React state)
        const updateStars = () => {
            const rect = canvas.getBoundingClientRect();
            
            // Check if actual size changed to avoid redundant calculations
            if (canvas.width === rect.width && canvas.height === rect.height) {
                return;
            }

            canvas.width = rect.width;
            canvas.height = rect.height;
            starsRef.current = generateStars(rect.width, rect.height);
        };

        updateStars();

        const resizeObserver = new ResizeObserver(() => {
            // Use requestAnimationFrame to debounce resize checks during scrolling
            requestAnimationFrame(updateStars);
        });
        resizeObserver.observe(canvas);

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const stars = starsRef.current;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();

                if (star.twinkleSpeed !== null) {
                    star.opacity =
                        0.5 +
                        Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [
        starDensity,
        allStarsTwinkle,
        twinkleProbability,
        minTwinkleSpeed,
        maxTwinkleSpeed,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("h-full w-full absolute inset-0 z-0", className)}
        />
    );
};

