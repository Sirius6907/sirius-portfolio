import React from "react";

import {
  FaCss3,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaPython,
  FaReact,
  FaGaugeHigh,
  FaTruckMoving,
  FaRobot,
  FaSquareJs,
  FaDocker,
  FaAws,
} from "react-icons/fa6";

import {
  SiExpress,
  SiFramer,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiPostman,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiFastapi,
  SiLangchain,
  SiRedis,
  SiPostgresql,
  SiOpenai,
} from "react-icons/si";

import { GiBrain } from "react-icons/gi";
import { MdSecurity } from "react-icons/md";
import { TbBrandRust } from "react-icons/tb";

interface LogoProps {
  title: string;
  logoComponent: React.FC;
  color?: string;
}

interface SkillsDataProps {
  title: string;
  data: LogoProps[];
}

export const skillsData: SkillsDataProps[] = [
  {
    title: "Languages",
    data: [
      { title: "Python", logoComponent: FaPython, color: "#3776AB" },
      { title: "TypeScript", logoComponent: SiTypescript, color: "#3178C6" },
      { title: "JavaScript", logoComponent: FaSquareJs, color: "#F7DF1E" },
      { title: "Rust", logoComponent: TbBrandRust, color: "#CE422B" },
      { title: "SQL", logoComponent: SiMysql, color: "#4479A1" },
      { title: "HTML5", logoComponent: FaHtml5, color: "#E34F26" },
      { title: "CSS3", logoComponent: FaCss3, color: "#1572B6" },
    ],
  },
  {
    title: "AI & ML",
    data: [
      { title: "LangChain", logoComponent: SiLangchain, color: "#1C3C3C" },
      { title: "OpenAI API", logoComponent: SiOpenai, color: "#412991" },
      { title: "RAG Pipelines", logoComponent: GiBrain, color: "#FF9800" },
      { title: "Multi-Agent Systems", logoComponent: FaRobot, color: "#9C27B0" },
      { title: "FastAPI", logoComponent: SiFastapi, color: "#009688" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    data: [
      { title: "React", logoComponent: FaReact, color: "#61DAFB" },
      { title: "Next.js", logoComponent: SiNextdotjs, color: "#d4d4d8" },
      { title: "Node.js", logoComponent: SiExpress, color: "#d4d4d8" },
      { title: "Tailwind CSS", logoComponent: SiTailwindcss, color: "#06B6D4" },
      { title: "Framer Motion", logoComponent: SiFramer, color: "#0055FF" },
    ],
  },
  {
    title: "Databases & Cloud",
    data: [
      { title: "MongoDB", logoComponent: SiMongodb, color: "#47A248" },
      { title: "PostgreSQL", logoComponent: SiPostgresql, color: "#4169E1" },
      { title: "Redis", logoComponent: SiRedis, color: "#DC382D" },
      { title: "AWS", logoComponent: FaAws, color: "#FF9900" },
      { title: "Docker", logoComponent: FaDocker, color: "#2496ED" },
      { title: "Vercel", logoComponent: SiVercel, color: "#d4d4d8" },
    ],
  },
  {
    title: "DevOps & Security",
    data: [
      { title: "Git", logoComponent: FaGitAlt, color: "#F05032" },
      { title: "GitHub", logoComponent: FaGithub, color: "#d4d4d8" },
      { title: "CI/CD", logoComponent: FaTruckMoving, color: "#0A66C2" },
      { title: "Postman", logoComponent: SiPostman, color: "#FF6C37" },
      { title: "Bug Bounty", logoComponent: MdSecurity, color: "#F44336" },
      { title: "Performance", logoComponent: FaGaugeHigh, color: "#388E3C" },
    ],
  },
];
