"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { selfData } from "@/constant";

import { quentine, mono } from "@/app/fonts";

const Typewriter = ({ texts, speed = 80, deleteSpeed = 40, pauseDuration = 2000 }: { texts: string[]; speed?: number; deleteSpeed?: number; pauseDuration?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (charIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        style={{ color: "hsl(var(--primary))" }}
      >
        |
      </motion.span>
    </span>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-80px",
    amount: 0.1,
  });

  // Parallax scroll offset
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Role descriptions for typing effect
  const roles = [
    "AI Engineer & Full-Stack Developer",
    "Multi-Agent Systems Architect",
    "Open Source Builder",
    "Bug Bounty Hunter",
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-start px-6 relative overflow-hidden"
    >
      {/* Cinematic grid bg */}
      <div
        className="absolute inset-0 hero-grid-bg"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />

      {/* God rays — heroic light shafts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[150%] opacity-[0.06]"
          style={{
            background: "linear-gradient(" +
              "180deg, transparent 0%, hsl(35, 75%, 62%) 30%, hsl(354, 63%, 49%) 60%, transparent 100%" +
            ")",
            transform: `translateY(${scrollY * -0.05}px) rotate(15deg)`,
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-[-10%] right-[-5%] w-[50%] h-[120%] opacity-[0.04]"
          style={{
            background: "linear-gradient(" +
              "180deg, transparent 0%, hsl(5, 82%, 60%) 40%, transparent 100%" +
            ")",
            transform: `translateY(${scrollY * -0.08}px) rotate(-10deg)`,
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Orb layers with parallax depth */}
      <motion.div
        className="absolute bottom-32 left-20 w-24 h-24 rounded-full blur-2xl"
        style={{
          backgroundColor: "hsl(var(--secondary) / 0.12)",
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
        animate={
          isInView
            ? {
                y: [20, -20, 20],
                x: [0, 15, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.3, 1],
              }
            : { y: 20, rotate: 0, scale: 1 }
        }
        transition={{
          duration: 10,
          repeat: isInView ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full blur-xl"
        style={{
          backgroundColor: "hsl(var(--primary) / 0.1)",
          transform: `translateY(${scrollY * 0.12}px)`,
        }}
        animate={
          isInView
            ? {
                y: [0, -15, 0],
                x: [0, 8, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
              }
            : { y: 0, x: 0, opacity: 0 }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/4 w-10 h-10 rounded-full blur-lg"
        style={{
          backgroundColor: "hsl(var(--accent) / 0.08)",
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
        animate={
          isInView
            ? {
                y: [0, 12, 0],
                x: [0, -8, 0],
                opacity: [0.1, 0.4, 0.1],
              }
            : { y: 0, x: 0, opacity: 0 }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Particle grid with parallax */}
      {isInView && (
        <>
          {Array.from({ length: 20 }).map((_, i) => {
            const depth = 0.03 + (i % 5) * 0.03;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: i % 2 === 0 ? "hsl(var(--primary) / 0.3)" : "hsl(var(--secondary) / 0.2)",
                  left: `${5 + (i * 4.5) % 90}%`,
                  top: `${10 + (i * 7.3) % 80}%`,
                  transform: `translateY(${scrollY * depth}px)`,
                }}
                animate={{
                  y: [0, -10 - ((i * 3) % 16), 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: (i % 4) * 0.8,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </>
      )}

      <div className="max-w-full sm:max-w-7xl mx-auto w-full relative z-10 overflow-x-hidden">
        <motion.div
          className="max-w-4xl space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="space-y-6">
            {/* Greeting */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span
                className="w-8 h-[1px]"
                style={{ background: "hsl(var(--secondary) / 0.5)" }}
              />
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "hsl(var(--secondary))" }}
              >
                Hello, I&apos;m
              </span>
            </motion.div>

            <motion.h1
              className={`${quentine.className} text-5xl md:text-7xl lg:text-8xl font-bold gradient-text`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              {selfData.name}
            </motion.h1>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <motion.span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: "hsl(var(--accent))" }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.p
                className={`${mono.className} text-lg md:text-xl h-8`}
                style={{ color: "hsl(var(--primary))" }}
              >
                <Typewriter texts={roles} />
              </motion.p>
            </motion.div>

            <motion.p
              className="text-base md:text-lg max-w-2xl leading-relaxed"
              style={{ color: "hsl(var(--foreground) / 0.8)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {selfData.bio}
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="relative group overflow-hidden btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/resume">
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30"
                    style={{ background: "var(--glass-shimmer)" }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <span className="relative z-10 font-medium">View Resume</span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                asChild
                className="relative group overflow-hidden border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 font-mono"
                style={{
                  backdropFilter: "blur(8px)",
                  background: "hsl(var(--glass-bg))",
                }}
              >
                <Link
                  href="#project"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("project")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20"
                    style={{ background: "var(--shimmer)" }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <span className="relative z-10">View Projects</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="flex items-center gap-3 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.div
              className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
              style={{
                borderColor: "hsl(var(--foreground) / 0.2)",
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "hsl(var(--primary))" }}
                animate={{
                  y: [0, 12, 0],
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <span
              className="text-xs font-mono tracking-wider"
              style={{ color: "hsl(var(--foreground) / 0.4)" }}
            >
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
