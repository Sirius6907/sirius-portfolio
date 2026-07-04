"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

import { RiMenu4Fill, RiCloseLargeFill } from "react-icons/ri";

import { quentine } from "@/app/fonts";

import { Button } from "../ui/button";
import { createBlurDataURL } from "@/lib/BlurDataURL";
import { selfData } from "@/constant";

/* Magnetic hover — pulls link toward cursor */
function MagneticLink({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    const d = Math.sqrt(dx * dx + dy * dy);
    const pull = Math.max(0, 1 - d / 120);
    setPos({ x: dx * pull * 0.3, y: dy * pull * 0.3 });
  }, []);
  const handleLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
      style={{ ...style, transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.15s ease" }}
    >
      {children}
    </button>
  );
}

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#skills-progress", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#project", label: "Projects" },
  { href: "#certifications", label: "Certs" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 100);

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false);
      }

      setLastScrollY(currentScrollY);

      // Detect active section
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled ? "pt-0 px-2 sm:px-4" : "px-2 sm:px-2"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div
        className={`floating-nav rounded-2xl px-4 sm:px-6 py-3 bg-glass-bg transition-all duration-300 max-w-7xl mx-auto ${
          isScrolled
            ? "shadow-xl border border-primary/10"
            : "shadow-lg border border-transparent"
        }`}
        style={{
          background: "hsl(var(--glass-bg) / 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-glass-bg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={40}
                height={40}
                loading="lazy"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <span
              className={`${quentine.className} text-primary-foreground text-xl sm:text-base hidden sm:inline`}
            >
              {selfData.name}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <MagneticLink
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="relative px-3 py-2 text-xs font-medium rounded-lg transition-all duration-300 group"
                  style={{
                    color: isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground) / 0.6)",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "hsl(var(--primary) / 0.1)",
                      }}
                    />
                  )}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[2px] transition-all duration-300 rounded-full"
                    style={{
                      background: "hsl(var(--primary))",
                      width: isActive ? "60%" : "0%",
                    }}
                  />
                </MagneticLink>
              );
            })}
          </div>

          <div className="hidden sm:block">
            <Button
              variant="outline"
              asChild
              className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-200 font-mono text-xs"
            >
              <Link href="/resume">Resume</Link>
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <RiCloseLargeFill
                size={20}
                className="transition-transform duration-200"
              />
            ) : (
              <RiMenu4Fill
                size={20}
                className="transition-transform duration-200"
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="pt-4 pb-2 mt-4"
            style={{ borderTop: "1px solid hsl(var(--border) / 0.5)" }}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg text-left transition-all duration-200"
                  style={{
                    color:
                      activeSection === link.href.slice(1)
                        ? "hsl(var(--primary))"
                        : "hsl(var(--foreground) / 0.7)",
                    background:
                      activeSection === link.href.slice(1)
                        ? "hsl(var(--primary) / 0.1)"
                        : "transparent",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Link
                    href="/resume"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center"
                  >
                    Resume
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
