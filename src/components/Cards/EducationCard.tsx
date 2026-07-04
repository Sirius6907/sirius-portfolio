import { FC, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PiGraduationCapFill } from "react-icons/pi";
import { HiMapPin } from "react-icons/hi2";

import { Card } from "../ui/card";

interface EducationCardProps {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  grade: string;
  index?: number;
}

export const EducationCard: FC<EducationCardProps> = ({
  degree,
  institution,
  location,
  duration,
  grade,
  index = 0,
}) => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: false,
    margin: "-50px",
    amount: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      key={index}
      initial={{ opacity: 0, x: -50, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, scale: 1 }
          : { opacity: 0, x: -50, scale: 0.95 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: {
          duration: 0.3,
          type: "spring" as const,
          stiffness: 400,
          damping: 25,
        },
      }}
      className="relative flex items-start space-x-8 group"
    >
      {/* Timeline dot */}
      <motion.div
        className="mt-6 flex-shrink-0"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
      >
        <div className="w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full border-2 border-background shadow-lg" />
        <div className="w-px h-20 bg-gradient-to-b from-primary/50 to-transparent mx-auto mt-2" />
      </motion.div>

      {/* Content */}
      <motion.div className="flex-1">
        <Card
          className="relative overflow-hidden backdrop-blur-xl border transition-all duration-500 shadow-xl hover:shadow-2xl group-hover:shadow-luxury-hover-glow/20"
          style={{
            background: "hsl(var(--glass-bg))",
            borderColor: "hsl(var(--glass-border))",
          }}
        >
          {/* Glass shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ background: "var(--shimmer)" }}
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          <div className="relative z-10 p-6">
            <motion.div
              className="flex items-start gap-4 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              <motion.div
                className="p-3 rounded-lg bg-primary/10 flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PiGraduationCapFill
                  className="w-6 h-6"
                  style={{ color: "hsl(var(--primary))" }}
                />
              </motion.div>

              <div className="flex-1">
                <h3
                  className="text-xl font-semibold font-nasalization mb-1"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {degree}
                </h3>
                <p
                  className="font-medium mb-2"
                  style={{ color: "hsl(var(--secondary))" }}
                >
                  {institution}
                </p>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <HiMapPin className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>
                    {location}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t"
              style={{ borderColor: "hsl(var(--border))" }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            >
              <span
                className="text-sm font-mono"
                style={{ color: "hsl(var(--foreground) / 0.8)" }}
              >
                {duration}
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--accent))" }}
              >
                {grade}
              </span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
