"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-10 w-10 rounded-full bg-transparent overflow-hidden border border-primary/30 backdrop-blur-sm"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "anticipate" }}
      >
        {theme === "light" ? (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="absolute h-[1.2rem] w-[1.2rem] text-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="absolute h-[1.2rem] w-[1.2rem] text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
          </motion.div>
        )}
      </motion.div>
    </Button>
  );
}