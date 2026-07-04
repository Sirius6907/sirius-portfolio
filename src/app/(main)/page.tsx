"use client";

import { Fragment, useState, useEffect } from "react";

import { Navbar, Footer, PreLoader, Background, ScrollProgressBar, BackToTop, GitHubStats, SectionReveal } from "@/components/common";
import {
  Hero,
  About,
  Skills,
  Education,
  SkillsProgress,
  Experience,
  Projects,
  Certifications,
  Achievements,
  Contact,
} from "@/components/sections";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(loadTimer);
  }, []);

  if (loading) return <PreLoader />;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ScrollProgressBar />
      <Background />
      <Fragment>
        <Navbar />
        <Hero />
        <div className="section-divider" />
        <SectionReveal><About /></SectionReveal>
        <div className="section-divider" />
        <SectionReveal delay={0.1}><Education /></SectionReveal>
        <SectionReveal delay={0.15}><SkillsProgress /></SectionReveal>
        <div className="section-divider" />
        <SectionReveal delay={0.1} direction="right"><Skills /></SectionReveal>
        <div className="section-divider" />
        <SectionReveal delay={0.1}><Experience /></SectionReveal>
        <div className="section-divider" />
        <SectionReveal delay={0.1}><Projects /></SectionReveal>
        <div className="section-divider" />
        <SectionReveal delay={0.15}><GitHubStats /></SectionReveal>
        <div className="section-divider" />
        <SectionReveal delay={0.1} direction="left"><Certifications /></SectionReveal>
        <SectionReveal delay={0.15}><Achievements /></SectionReveal>
        <div className="section-divider" />
        <SectionReveal delay={0.1}><Contact /></SectionReveal>
        <Footer />
        <BackToTop />
      </Fragment>
    </div>
  );
}
