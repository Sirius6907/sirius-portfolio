"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

function NoiseFilter() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-20"
      style={{ opacity: 0.08, mixBlendMode: "soft-light" }}
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.6"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="1" />
    </svg>
  );
}

function GradientOrbs() {
  // Japanese dark fantasy orb palette — amber sun, crimson leaves, ember glow
  const orbs = useMemo(() => [
    {
      color: "hsla(35, 75%, 50%, 0.12)",
      position: { x: "-20vw", y: "-30vh" },
      size: { width: "90vw", height: "90vh" },
      animation: { x: [0, 30, 0], y: [0, -15, 0] },
    },
    {
      color: "hsla(354, 63%, 35%, 0.10)",
      position: { x: "40vw", y: "-15vh" },
      size: { width: "70vw", height: "70vh" },
      animation: { x: [0, -40, 0], y: [0, 25, 0] },
    },
    {
      color: "hsla(5, 82%, 55%, 0.08)",
      position: { x: "50vw", y: "45vh" },
      size: { width: "60vw", height: "60vh" },
      animation: { x: [0, 20, 0], y: [0, -30, 0] },
    },
    {
      color: "hsla(48, 60%, 45%, 0.06)",
      position: { x: "-10vw", y: "55vh" },
      size: { width: "50vw", height: "50vh" },
      animation: { x: [0, 25, 0], y: [0, 20, 0] },
    },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-[150px]"
          style={{
            background: `radial-gradient(circle, ${orb.color}, transparent)`,
            mixBlendMode: "screen",
            ...orb.position,
            ...orb.size,
          }}
          animate={orb.animation}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 18 + index * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingEmbers() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  /* Deterministic seeded PRNG */
  const particles = useMemo(() => {
    if (!mounted) return [];
    const seed = (n: number) => {
      const x = Math.sin(n * 9973) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 15 }).map((_, i) => {
      const isCoral = seed(i * 19 + 3) > 0.5;
      return {
        id: i,
        x: Math.round(seed(i * 1) * 10000) / 100,
        y: Math.round(seed(i * 3 + 7) * 10000) / 100,
        size: Math.round((1.5 + seed(i * 5 + 11) * 2.5) * 10000) / 10000,
        duration: 5 + seed(i * 7 + 13) * 8,
        delay: seed(i * 11 + 17) * 5,
        color: isCoral ? "hsl(5, 82%, 60%)" : "hsl(35, 75%, 62%)",
        yRange: -30 - seed(i * 23 + 29) * 40,
      };
    });
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px hsla(35, 75%, 62%, 0.25)`,
          }}
          animate={{
            y: [0, p.yRange, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export const Background = () => {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setMode(html.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: mode === "dark"
            ? "radial-gradient(ellipse 100% 90% at 50% 0%, #0a0504 0%, #0d0705 30%, #050302 70%, #000000 100%)"
            : "radial-gradient(ellipse 100% 90% at 50% 0%, #f5ebe0 0%, #e8d5c4 60%, #d4b8a0 100%)",
        }}
      />
      <GradientOrbs />
      <FloatingEmbers />
      <NoiseFilter />
    </div>
  );
};
