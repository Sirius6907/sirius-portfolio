import { FC, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HiCheckCircle, HiClock } from "react-icons/hi2";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface AchievementCardProps {
  title: string;
  description: string;
  badge: string;
  status: string;
  value: string | null;
  index: number;
}

export const AchievementCard: FC<AchievementCardProps> = ({
  title,
  description,
  badge,
  status,
  value,
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
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
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
        className="relative overflow-hidden backdrop-blur-xl border transition-all duration-500 h-full flex flex-col shadow-xl hover:shadow-2xl group-hover:shadow-luxury-hover-glow/40"
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
          <div className="flex items-start justify-between mb-4">
            <Badge
              variant="outline"
              className="text-xs font-mono px-3 py-1"
              style={{
                borderColor: "hsl(var(--primary) / 0.4)",
                color: "hsl(var(--primary))",
                backgroundColor: "hsl(var(--primary) / 0.1)",
              }}
            >
              {badge}
            </Badge>
            {value && (
              <motion.div
                className="text-3xl font-bold font-nasalization"
                style={{ color: "hsl(var(--accent))" }}
                whileHover={{ scale: 1.1 }}
              >
                {value}
              </motion.div>
            )}
          </div>

          <h3
            className="text-xl font-bold mb-3 font-nasalization"
            style={{ color: "hsl(var(--primary))" }}
          >
            {title}
          </h3>

          <p
            className="text-sm mb-4 flex-grow leading-relaxed"
            style={{ color: "hsl(var(--foreground) / 0.8)" }}
          >
            {description}
          </p>

          <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
            {status === "Completed" ? (
              <HiCheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <HiClock className="w-5 h-5 text-blue-500" />
            )}
            <span
              className="text-sm font-medium"
              style={{ color: "hsl(var(--foreground) / 0.7)" }}
            >
              {status}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
