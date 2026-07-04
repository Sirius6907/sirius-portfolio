"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { certificationsData } from "@/constant/certifications";
import { CertificationCard } from "../Cards/CertificationCard";
import { nasalization } from "@/app/fonts";

export function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // smoother performance: animate only once
    margin: "-80px",
    amount: 0.1,
  });

  // Memoize data to prevent re-renders
  const memoizedCertifications = useMemo(() => certificationsData, []);

  return (
    <section
      ref={ref}
      id="certifications"
      className="py-24 max-w-6xl mx-auto relative overflow-hidden"
    >
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={
          isInView && {
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 20, 0],
          }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-1/4 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"
        animate={
          isInView && {
            scale: [0.8, 1.1, 0.8],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -15, 0],
          }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView && { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className={`${nasalization.className} text-4xl md:text-5xl font-bold gradient-text`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView && { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Certifications
          </motion.h2>

          <motion.p
            className="text-xs text-muted-foreground max-w-2xl mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView && { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Professional certifications and continuous learning achievements
          </motion.p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={isInView && { opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {memoizedCertifications.map((cert, index) => (
            <CertificationCard
              key={`${cert.title}-${index}`}
              title={cert.title}
              issuer={cert.issuer}
              year={cert.year}
              skills={cert.skills}
              verified={cert.verified}
              link={cert.link}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
