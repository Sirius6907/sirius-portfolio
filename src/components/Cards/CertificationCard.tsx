import { FC, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HiCheckBadge } from "react-icons/hi2";
import { FiExternalLink } from "react-icons/fi";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface CertificationCardProps {
  title: string;
  issuer: string;
  year: string;
  skills: string[];
  verified: boolean;
  link: string;
  index: number;
}

export const CertificationCard: FC<CertificationCardProps> = ({
  title,
  issuer,
  year,
  skills,
  verified,
  link,
  index,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
    amount: 0.2,
  });

  const isLeftCard = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, x: isLeftCard ? -60 : 60, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0, scale: 1 }
          : { opacity: 0, y: 40, x: isLeftCard ? -60 : 60, scale: 0.95 }
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
        className="relative overflow-hidden backdrop-blur-xl border transition-all duration-500 h-full flex flex-col shadow-xl hover:shadow-2xl group-hover:shadow-luxury-hover-glow/30"
        style={{
          background: "hsl(var(--glass-bg))",
          borderColor: "hsl(var(--glass-border))",
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
          style={{ background: "var(--shimmer)" }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        <div className="relative z-10 p-6 flex flex-col flex-grow">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <HiCheckBadge className="w-7 h-7 text-white" />
            </motion.div>

            <div className="flex-1">
              <h3
                className="text-lg font-bold mb-1 font-nasalization"
                style={{ color: "hsl(var(--primary))" }}
              >
                {title}
              </h3>
              <p
                className="text-sm mb-1"
                style={{ color: "hsl(var(--secondary))" }}
              >
                {issuer}
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {year}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 flex-grow">
            {skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs transition-all duration-300 hover:shadow-md font-mono px-2 py-1"
                style={{
                  borderColor: "hsl(var(--primary) / 0.3)",
                  color: "hsl(var(--foreground) / 0.9)",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t mt-auto" style={{ borderColor: "hsl(var(--border))" }}>
            {verified && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs" style={{ color: "hsl(var(--foreground) / 0.7)" }}>
                  Verified
                </span>
              </div>
            )}
            <motion.a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: "hsl(var(--primary))" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Certificate
              <FiExternalLink className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
