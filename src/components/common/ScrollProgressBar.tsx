"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(354, 63%, 49%), hsl(35, 75%, 62%))",
        boxShadow: "0 0 8px hsl(35, 75%, 62% / 0.5)",
      }}
    />
  );
};
