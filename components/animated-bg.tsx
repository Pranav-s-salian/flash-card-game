"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function AnimatedBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Light mode background */}
      {!isDark && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
          <motion.div
            className="absolute top-0 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-100/30 to-blue-100/30"
            animate={{
              x: [0, 10, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-l from-indigo-100/30 to-emerald-100/30"
            animate={{
              x: [0, -20, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
          <ParticleCanvas light />
        </>
      )}

      {/* Dark mode background */}
      {isDark && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-gray-900" />
          <motion.div
            className="absolute top-0 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-900/10 to-blue-900/10"
            animate={{
              x: [0, 10, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-l from-violet-900/10 to-emerald-900/10"
            animate={{
              x: [0, -20, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
          <ParticleCanvas />
        </>
      )}
    </div>
  );
}

function ParticleCanvas({ light = false }: { light?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Particle[] = [];
    const particleCount = 100;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = light
          ? `rgba(${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 155) + 100}, ${Math.random() * 0.2 + 0.1})`
          : `rgba(${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.3 + 0.2})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [light]);
  
  return <canvas ref={canvasRef} className="absolute inset-0" />;
}