"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Check, X, RotateCw, ArrowLeft, ArrowRight } from "lucide-react";
import { Card as CardType } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  card: CardType;
  onNext: () => void;
  onPrev: () => void;
  onKnow: () => void;
  onDontKnow: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Flashcard({
  card,
  onNext,
  onPrev,
  onKnow,
  onDontKnow,
  hasNext,
  hasPrev
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
  // Particle effect references
  const particleContainer = useRef<HTMLDivElement>(null);
  
  // Reset flipped state when card changes
  useEffect(() => {
    setFlipped(false);
  }, [card.id]);

  // Handle key presses for navigation and flipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setFlipped(prev => !prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (flipped) {
          onKnow();
          // Vibrate if supported
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
          createParticles(true);
        } else if (hasNext) {
          onNext();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (flipped) {
          onDontKnow();
          // Vibrate if supported
          if (navigator.vibrate) {
            navigator.vibrate([30, 20, 30]);
          }
          createParticles(false);
        } else if (hasPrev) {
          onPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipped, hasNext, hasPrev, onDontKnow, onKnow, onNext, onPrev]);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current || flipped) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  // Create particle burst effect
  const createParticles = (isSuccess: boolean) => {
    if (!particleContainer.current) return;
    
    const container = particleContainer.current;
    const containerRect = container.getBoundingClientRect();
    
    // Clear existing particles
    container.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      
      // Set particle styles
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = isSuccess 
        ? `hsl(${Math.random() * 60 + 120}, 100%, ${Math.random() * 30 + 60}%` // Green range
        : `hsl(${Math.random() * 60}, 100%, ${Math.random() * 30 + 60}%`; // Red-yellow range
      
      // Random position
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      
      // Random animation
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 50;
      const speed = Math.random() * 1 + 0.5;
      
      particle.animate([
        {
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0
        },
        {
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(
            calc(-50% + ${Math.cos(angle) * distance}px), 
            calc(-50% + ${Math.sin(angle) * distance}px)
          ) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 1000 * speed,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      });
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, 1000 * speed);
    }
  };
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <div 
        ref={particleContainer}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      />
      
      <motion.div
        ref={cardRef}
        className="w-full max-w-md perspective-1000 mb-6"
        style={{ rotateX, rotateY, transition: 'all 0.1s ease' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={cn(
            "relative w-full aspect-[3/2] cursor-pointer",
            "perspective-1000 preserve-3d",
          )}
          onClick={() => setFlipped(!flipped)}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={flipped ? 'back' : 'front'}
              initial={{
                rotateY: flipped ? -90 : 90
              }}
              animate={{
                rotateY: 0,
                transition: {
                  duration: 0.5,
                  damping: 10,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              exit={{
                rotateY: flipped ? 90 : -90,
                transition: {
                  duration: 0.5,
                  damping: 10,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              className="absolute inset-0 w-full h-full backface-hidden"
            >
              <div className={cn(
                "w-full h-full rounded-xl flex flex-col items-center justify-center p-6 overflow-hidden",
                "bg-background/80 backdrop-blur-md",
                "shadow-[0_0_30px_rgba(0,0,0,0.1)]",
                "border border-transparent",
                // Light mode border
                "dark:border-transparent",
                // Dark mode border
                "relative"
              )}>
                {/* Background gradient effect */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900" />
                  <div className="absolute inset-0 opacity-10 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 blur-xl" />
                  </div>
                </div>
                
                {/* Border gradient effect */}
                <div className="absolute inset-0 -z-20 rounded-xl p-[1px] bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 dark:from-indigo-600/40 dark:via-purple-600/40 dark:to-pink-600/40" />
                
                {/* Card content */}
                <div className="text-center w-full flex-1 flex flex-col items-center justify-center">
                  <motion.p 
                    className="text-2xl sm:text-3xl font-medium mb-2 text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {flipped ? card.back : card.front}
                  </motion.p>
                  <motion.div 
                    className="text-sm text-muted-foreground opacity-75"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {flipped ? "← Press space or click to see front" : "Press space or click to flip →"}
                  </motion.div>
                </div>
                
                {/* Card footer */}
                <div className="absolute bottom-3 right-3 flex text-xs text-muted-foreground gap-1 opacity-60">
                  <span>Interval: {card.interval} day{card.interval !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
        {/* Prev/Next navigation */}
        <div className="flex gap-2 justify-center order-last sm:order-first">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrev}
            disabled={!hasPrev}
            className="rounded-full disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={!hasNext}
            className="rounded-full disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Know/Don't Know buttons */}
        <div className="flex gap-3 justify-center">
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ 
              scale: 1.05,
              transition: { 
                type: "spring", 
                stiffness: 400
              }
            }}
            onClick={() => {
              if (!flipped) {
                toast.info("Flip the card first");
                return;
              }
              onDontKnow();
              if (navigator.vibrate) {
                navigator.vibrate([30, 20, 30]);
              }
              createParticles(false);
            }}
          >
            <Button 
              variant="outline" 
              className={cn(
                "border-red-400/50 hover:border-red-400 gap-2 px-4",
                "bg-gradient-to-r from-red-500/10 to-orange-500/10",
                "shadow-lg shadow-red-500/10 hover:shadow-red-500/20",
                flipped ? "opacity-100" : "opacity-50 pointer-events-none"
              )}
            >
              <X className="w-4 h-4 text-red-500" />
              <span className="font-medium">Don&apos;t Know</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ 
              scale: 1.05,
              transition: { 
                type: "spring", 
                stiffness: 400
              }
            }}
            onClick={() => {
              if (!flipped) {
                toast.info("Flip the card first");
                return;
              }
              onKnow();
              if (navigator.vibrate) {
                navigator.vibrate(50);
              }
              createParticles(true);
            }}
          >
            <Button 
              variant="outline" 
              className={cn(
                "border-green-400/50 hover:border-green-400 gap-2 px-4",
                "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
                "shadow-lg shadow-green-500/10 hover:shadow-green-500/20",
                flipped ? "opacity-100" : "opacity-50 pointer-events-none"
              )}
            >
              <Check className="w-4 h-4 text-green-500" />
              <span className="font-medium">Know</span>
            </Button>
          </motion.div>
        </div>
        
        {/* Reset button */}
        <div className="sm:ml-auto flex justify-center order-first sm:order-last">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setFlipped(false);
            }}
            className="rounded-full"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}