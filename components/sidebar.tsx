"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BarChart3, Library, ChevronRight, ChevronLeft, 
  Plus, BookOpen, Settings, Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  
  const navItems = [
    { 
      name: "Home", 
      href: "/", 
      icon: Home,
      active: pathname === "/" 
    },
    { 
      name: "Decks", 
      href: "/decks", 
      icon: Library,
      active: pathname === "/decks" || pathname.startsWith("/decks/") 
    },
    { 
      name: "Stats", 
      href: "/stats", 
      icon: BarChart3,
      active: pathname === "/stats" 
    },
  ];

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "80px" },
  };

  const textVariants = {
    expanded: { opacity: 1, display: "block" },
    collapsed: { opacity: 0, display: "none", transition: { duration: 0.2 } },
  };

  const iconVariants = {
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: { duration: 0.2, type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="expanded"
      animate={expanded ? "expanded" : "collapsed"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-background/70 backdrop-blur-lg border-r border-border z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        <motion.div 
          className="flex items-center gap-2"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Brain className="w-8 h-8 text-primary" />
          <motion.span
            variants={textVariants}
            className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            NeuroCards
          </motion.span>
        </motion.div>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="rounded-full w-8 h-8"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href}
            className={cn(
              "relative flex items-center gap-3 px-4 py-2 mx-2 rounded-lg group",
              item.active 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-primary/5"
            )}
          >
            <motion.div
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <item.icon className={cn(
                "w-5 h-5", 
                item.active ? "text-primary" : "text-muted-foreground"
              )} />
            </motion.div>
            
            <motion.span variants={textVariants} className="font-medium">
              {item.name}
            </motion.span>
            
            {item.active && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-1 h-8 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>

      <motion.div 
        className="p-4 border-t border-border flex items-center gap-4"
        animate={{ justifyContent: expanded ? "space-between" : "center" }}
      >
        <ThemeToggle />
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="secondary" size="sm" className="gap-2">
                <Settings size={16} />
                <span>Settings</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}