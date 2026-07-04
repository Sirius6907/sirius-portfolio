"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { skillsProgressData } from "@/constant/skillsProgress";
import { SkillProgressCard } from "../Cards/SkillProgressCard";
import { nasalization } from "@/app/fonts";

export function SkillsProgress() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-80px",
    amount: 0.1,
  });

  return (
    <section
      ref={ref}
      id="skills-progress"
      className="py-24 max-w-6xl mx-auto relative overflow-hidden"
    >
      <motion.div
        className="absolute top-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
        animate={
          isInView
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                x: [0, -20, 0],
              }
            : { scale: 1, opacity: 0 }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
        animate={
          isInView
            ? {
                scale: [0.8, 1.1, 0.8],
                opacity: [0.1, 0.15, 0.1],
                x: [0, 15, 0],
              }
            : { scale: 0.8, opacity: 0 }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <motion.h2
            className={`${nasalization.className} text-4xl md:text-5xl font-bold gradient-text`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Skills & Technologies
          </motion.h2>
          <motion.p
            className="text-xs text-muted-foreground max-w-2xl mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A comprehensive overview of my technical expertise and proficiency levels
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {skillsProgressData.map((skillCategory, index) => (
            <SkillProgressCard
              key={skillCategory.category}
              category={skillCategory.category}
              skills={skillCategory.skills}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
