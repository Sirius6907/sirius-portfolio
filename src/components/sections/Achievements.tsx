"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HiTrophy } from "react-icons/hi2";
import { achievementsData, developmentPhilosophy } from "@/constant/achievements";
import { AchievementCard } from "../Cards/AchievementCard";
import { nasalization } from "@/app/fonts";
import { Card } from "../ui/card";

export function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-80px",
    amount: 0.1,
  });

  return (
    <section
      ref={ref}
      id="achievements"
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
            Achievements
          </motion.h2>
          <motion.p
            className="text-xs text-muted-foreground max-w-2xl mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Key milestones and accomplishments in my development journey
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {achievementsData.map((achievement, index) => (
            <AchievementCard
              key={`${achievement.title}-${index}`}
              title={achievement.title}
              description={achievement.description}
              badge={achievement.badge}
              status={achievement.status}
              value={achievement.value}
              index={index}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 40, scale: 0.95 }
          }
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.3 },
          }}
        >
          <Card
            className="relative overflow-hidden backdrop-blur-xl border transition-all duration-500 shadow-xl hover:shadow-2xl"
            style={{
              background: "hsl(var(--glass-bg))",
              borderColor: "hsl(var(--glass-border))",
            }}
          >
            <div className="relative z-10 p-8">
              <div className="flex items-start gap-6">
                <motion.div
                  className="p-4 rounded-xl bg-gradient-to-br from-primary to-secondary flex-shrink-0"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiTrophy className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3
                    className={`${nasalization.className} text-2xl font-bold mb-4`}
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    Development Philosophy
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "hsl(var(--foreground) / 0.8)" }}
                  >
                    {developmentPhilosophy}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
