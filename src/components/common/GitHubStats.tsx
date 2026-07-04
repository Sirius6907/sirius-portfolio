"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FaGithub, FaStar, FaCodeBranch, FaEye } from "react-icons/fa6";
import { selfData } from "@/constant";
import { nasalization } from "@/app/fonts";
import Link from "next/link";

// ─── Data ───────────────────────────────────────────────────────
const GITHUB_USERNAME = selfData.socials_username.github;
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

interface GitHubData {
  public_repos: number;
  followers: number;
  following: number;
}

// ─── Shared easing ──────────────────────────────────────────────
const springSmooth = { type: "spring" as const, stiffness: 120, damping: 20, mass: 1 };

// ─── Floating Orb ───────────────────────────────────────────────
function FloatingOrb({
  className,
  size,
  color,
  duration,
  delay,
}: {
  className?: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className ?? ""}`}
      style={{ width: size, height: size, background: color }}
      animate={{
        x: [0, 30, 0, -20, 0],
        y: [0, -25, 0, 20, 0],
        scale: [1, 1.15, 0.95, 1.1, 1],
        opacity: [0.08, 0.15, 0.1, 0.12, 0.08],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ─── GitHub Stat Card ───────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
  accent: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group perspective-[800px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        <motion.div
          className="relative overflow-hidden backdrop-blur-xl border transition-all duration-700 h-full rounded-2xl p-6 shadow-xl"
          style={{
            background: "hsl(var(--glass-bg))",
            borderColor: "hsl(var(--glass-border))",
          }}
          animate={
            isHovered
              ? {
                  y: -10,
                  scale: 1.03,
                  boxShadow: `0 20px 60px -12px ${accent}40`,
                  borderColor: `${accent}60`,
                }
              : { y: 0, scale: 1, boxShadow: "0 10px 40px -12px rgba(0,0,0,0.3)", borderColor: "hsl(var(--glass-border))" }
          }
          transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.8 }}
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}30, transparent)`,
            }}
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "200%" } : { x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Glow corner */}
          <motion.div
            className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: `${accent}15` }}
            animate={isHovered ? { scale: 2.5, opacity: 0.5 } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            {/* Icon container with pulse ring */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ background: `${accent}20` }}
                animate={isHovered ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="relative p-4 rounded-xl"
                style={{
                  background: `${accent}12`,
                  border: `1px solid ${accent}25`,
                }}
                animate={
                  isHovered
                    ? { scale: 1.1, rotate: [0, -5], borderRadius: "16px" }
                    : { scale: 1, rotate: 0, borderRadius: "12px" }
                }
                transition={{ type: "spring", stiffness: 300, damping: 18, mass: 0.6 }}
              >
                <Icon className="w-7 h-7" style={{ color: accent }} />
              </motion.div>
            </div>

            {/* Text */}
            <div className="space-y-1">
              <motion.p
                className="text-lg font-bold tracking-tight"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {value}
              </motion.p>
              <p className="text-xs font-mono tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                {label}
              </p>
            </div>

            {/* Bottom accent bar */}
            <motion.div
              className="h-0.5 rounded-full mt-1"
              style={{ background: accent }}
              animate={isHovered ? { width: "60%" } : { width: "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

// ─── Profile Card (bottom) ──────────────────────────────────────
function ProfileCard({ githubUrl, githubData }: { githubUrl: string; githubData: GitHubData | null }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...springSmooth, delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="mt-12"
    >
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="block">
        <motion.div
          className="relative overflow-hidden backdrop-blur-xl border transition-all duration-700 rounded-2xl shadow-xl group"
          style={{
            background: "hsl(var(--glass-bg))",
            borderColor: "hsl(var(--glass-border))",
          }}
          animate={
            isHovered
              ? {
                  y: -6,
                  scale: 1.01,
                  boxShadow: "0 25px 70px -15px hsl(var(--primary) / 0.3)",
                  borderColor: "hsl(var(--primary) / 0.5)",
                }
              : {
                  y: 0,
                  scale: 1,
                  boxShadow: "0 10px 40px -12px rgba(0,0,0,0.3)",
                  borderColor: "hsl(var(--glass-border))",
                }
          }
          transition={{ type: "spring", stiffness: 250, damping: 22, mass: 0.8 }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)",
            }}
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "200%" } : { x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Glow */}
          <motion.div
            className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none"
            style={{ background: "hsl(var(--primary) / 0.08)" }}
            animate={isHovered ? { scale: 2.5, opacity: 0.5 } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />

          <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                className="p-3.5 rounded-xl"
                style={{ background: "hsl(var(--primary) / 0.1)" }}
                animate={isHovered ? { scale: 1.1, rotate: [0, -3] } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, mass: 0.6 }}
              >
                <FaGithub className="w-8 h-8" style={{ color: "hsl(var(--primary))" }} />
              </motion.div>
              <div>
                <h3
                  className={`${nasalization.className} text-xl font-bold`}
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {GITHUB_USERNAME}
                </h3>
                <motion.p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {isHovered ? "Open on GitHub ->" : "View Full GitHub Profile ->"}
                </motion.p>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              {[
                { label: "Repos", value: githubData ? String(githubData.public_repos) : "...", accent: "hsl(var(--primary))" },
                { label: "Followers", value: githubData ? String(githubData.followers) : "...", accent: "hsl(var(--secondary))" },
                { label: "Following", value: githubData ? String(githubData.following) : "...", accent: "hsl(45 93% 47%)" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="text-center px-6 py-3 rounded-xl transition-all duration-300 cursor-default"
                  style={{
                    background: `${item.accent}08`,
                    border: "1px solid hsl(var(--glass-border))",
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.05,
                    background: `${item.accent}15`,
                    borderColor: `${item.accent}30`,
                    transition: { type: "spring", stiffness: 400, damping: 20 },
                  }}
                >
                  <p className="text-lg font-bold" style={{ color: item.accent }}>
                    {item.value}
                  </p>
                  <p className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </a>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export const GitHubStats = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-60px",
    amount: 0.15,
  });

  const [githubData, setGithubData] = useState<GitHubData | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.message) {
          setGithubData({
            public_repos: data.public_repos,
            followers: data.followers,
            following: data.following,
          });
        }
      })
      .catch(() => {});
  }, []);

  const statCards = [
    {
      icon: FaGithub,
      label: "GitHub",
      value: `@${GITHUB_USERNAME}`,
      href: GITHUB_URL,
      accent: "hsl(var(--primary))",
    },
    {
      icon: FaCodeBranch,
      label: "Public Repos",
      value: githubData ? String(githubData.public_repos) : "...",
      href: `${GITHUB_URL}?tab=repositories`,
      accent: "hsl(var(--secondary))",
    },
    {
      icon: FaStar,
      label: "Followers",
      value: githubData ? String(githubData.followers) : "...",
      href: `${GITHUB_URL}?tab=followers`,
      accent: "hsl(45 93% 47%)",
    },
    {
      icon: FaEye,
      label: "Following",
      value: githubData ? String(githubData.following) : "...",
      href: `${GITHUB_URL}?tab=following`,
      accent: "hsl(var(--accent))",
    },
  ];

  return (
    <section
      ref={ref}
      id="github"
      className="py-24 max-w-6xl mx-auto relative overflow-hidden"
    >
      {/* Floating ambient orbs */}
      <FloatingOrb
        className="top-1/4 right-0"
        size={280}
        color="hsl(var(--primary) / 0.06)"
        duration={12}
        delay={0}
      />
      <FloatingOrb
        className="bottom-1/3 left-0"
        size={220}
        color="hsl(var(--secondary) / 0.05)"
        duration={10}
        delay={2}
      />
      <FloatingOrb
        className="top-3/4 right-1/4"
        size={160}
        color="hsl(45 93% 47% / 0.04)"
        duration={14}
        delay={4}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
        >
          <motion.h2
            className={`${nasalization.className} text-4xl md:text-5xl font-bold`}
            style={{ color: "hsl(var(--primary))" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 80, damping: 16, mass: 0.8, delay: 0.1 }}
          >
            GitHub Presence
          </motion.h2>
          <motion.p
            className="text-sm md:text-base max-w-2xl mx-auto mt-4"
            style={{ color: "hsl(var(--muted-foreground))" }}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.2 }}
          >
            Open source projects and contributions — live from GitHub API
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.92 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 1,
                delay: 0.15 + index * 0.08,
              }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Profile Card */}
        <ProfileCard githubUrl={GITHUB_URL} githubData={githubData} />
      </div>
    </section>
  );
};
