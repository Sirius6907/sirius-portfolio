import { FC, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "../ui/card";

interface Skill {
  name: string;
  level: number;
}

interface SkillProgressCardProps {
  category: string;
  skills: Skill[];
  index: number;
}

export const SkillProgressCard: FC<SkillProgressCardProps> = ({
  category,
  skills,
  index,
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
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.95 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      }}
      className="group h-full"
    >
      <Card
        className="relative overflow-hidden backdrop-blur-xl border transition-all duration-500 h-full shadow-xl hover:shadow-2xl group-hover:shadow-luxury-hover-glow/20"
        style={{
          background: "hsl(var(--glass-bg))",
          borderColor: "hsl(var(--glass-border))",
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: "var(--shimmer)" }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        <div className="relative z-10 p-6">
          <motion.h3
            className="text-xl font-bold mb-6 font-nasalization"
            style={{ color: "hsl(var(--primary))" }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            {category}
          </motion.h3>

          <div className="space-y-4">
            {skills.map((skill, skillIndex) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{
                  duration: 0.4,
                  delay: index * 0.1 + 0.3 + skillIndex * 0.05,
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "hsl(var(--foreground) / 0.9)" }}
                  >
                    {skill.name}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    {skill.level}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "hsl(var(--muted))" }}
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1 + 0.4 + skillIndex * 0.05,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
