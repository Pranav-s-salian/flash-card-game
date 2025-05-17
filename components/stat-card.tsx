"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-6",
        "backdrop-blur-md shadow-lg",
        className
      )}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900" />
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <motion.div
            key={String(value)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-2 flex items-baseline"
          >
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </span>
            {trend && trendValue && (
              <motion.span
                className={cn(
                  "ml-2 text-sm",
                  trend === "up" && "text-green-500",
                  trend === "down" && "text-red-500",
                  trend === "neutral" && "text-muted-foreground"
                )}
              >
                {trendValue}
              </motion.span>
            )}
          </motion.div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-full p-2 bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      
      {/* Decorative diagonal line */}
      <div className="absolute bottom-0 right-0 w-24 h-24 -z-10">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent to-primary/20 rotate-45 translate-y-[50%] origin-bottom-right" />
      </div>
    </motion.div>
  );
}