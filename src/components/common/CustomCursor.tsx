"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onHoverIn = () => setHovered(true);
    const onHoverOut = () => setHovered(false);

    document.addEventListener("pointermove", move);

    // Attach to all interactive elements
    const selectors =
      "a, button, [role=button], input, select, textarea, label, [data-cursor-hover]";
    const els = document.querySelectorAll(selectors);
    els.forEach((el) => {
      el.addEventListener("mouseenter", onHoverIn);
      el.addEventListener("mouseleave", onHoverOut);
    });

    return () => {
      document.removeEventListener("pointermove", move);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onHoverIn);
        el.removeEventListener("mouseleave", onHoverOut);
      });
    };
  }, [cursorX, cursorY]);

  // Only show on devices with fine pointer
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!finePointer) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
    >
      {/* Outer ring — CSS transitions instead of framer animate (CSS vars can't be interpolated) */}
      <div
        style={{
          width: hovered ? 42 : 28,
          height: hovered ? 42 : 28,
          borderRadius: "50%",
          border: "1.5px solid",
          borderColor: hovered
            ? "hsl(var(--accent) / 0.7)"
            : "hsl(var(--foreground) / 0.35)",
          background: hovered
            ? "hsl(var(--accent) / 0.08)"
            : "transparent",
          transition: "all 0.15s ease",
        }}
      />
      {/* Inner dot */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: hovered ? 6 : 4,
          height: hovered ? 6 : 4,
          background: hovered
            ? "hsl(var(--accent) / 0.9)"
            : "hsl(var(--foreground) / 0.6)",
          translateX: "-50%",
          translateY: "-50%",
          transition: "all 0.1s ease",
        }}
      />
    </motion.div>
  );
}
