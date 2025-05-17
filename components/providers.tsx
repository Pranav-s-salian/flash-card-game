"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AppState } from "@/types";
import { loadState, saveState } from "@/lib/storage";
import { StoreProvider } from "@/hooks/use-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [initialState, setInitialState] = useState<AppState | null>(null);
  
  // Load state from localStorage on mount
  useEffect(() => {
    const state = loadState();
    setInitialState(state);
    setMounted(true);
  }, []);

  if (!mounted || !initialState) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-pulse text-2xl">Loading...</div>
    </div>;
  }

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      storageKey="neurocards-theme"
    >
      <StoreProvider initialState={initialState}>
        {children}
      </StoreProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: "!bg-background/80 !backdrop-blur-lg !border !border-border !text-foreground !shadow-glow",
          style: {
            '--shadow-glow': 
              'var(--tw-shadow-color, rgba(var(--background), 0.1)) 0px 8px 24px',
          } as React.CSSProperties,
        }}
      />
    </ThemeProvider>
  );
}