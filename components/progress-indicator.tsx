"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressIndicator({
  current,
  total,
  className,
}: ProgressIndicatorProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center text-sm">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`${current}/${total}`}
          className="font-medium"
        >
          {current}/{total} cards
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`${percentage.toFixed(0)}%`}
          className="text-muted-foreground"
        >
          {percentage.toFixed(0)}%
        </motion.span>
      </div>
      <div className="h-2.5 relative rounded-full overflow-hidden bg-secondary backdrop-blur-sm border border-border">
        <div
          className="absolute inset-0 blur-xl opacity-50"
          style={{
            background: "linear-gradient(to right, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3)), hsl(var(--chart-4)), hsl(var(--chart-5)))",
          }}
        />
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: "linear-gradient(to right, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3)), hsl(var(--chart-4)), hsl(var(--chart-5)))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}