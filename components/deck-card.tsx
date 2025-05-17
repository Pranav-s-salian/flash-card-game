"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import { Deck } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface DeckCardProps {
  deck: Deck;
  onDelete: (id: string) => void;
  onEdit: (deck: Deck) => void;
}

export function DeckCard({ deck, onDelete, onEdit }: DeckCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const dueCards = deck.cards.filter(card => {
    return new Date(card.nextReview) <= new Date();
  }).length;
  
  const masteredCards = deck.cards.filter(card => card.mastered).length;
  const progress = deck.cards.length > 0 
    ? Math.round((masteredCards / deck.cards.length) * 100) 
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative rounded-xl border border-border p-6 shadow-md",
        "bg-gradient-to-br from-background to-background/90",
        "hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
        "transition-all duration-300"
      )}
    >
      {/* Interactive 3D tilt effect */}
      <motion.div
        animate={{
          rotateX: isHovered ? 2 : 0,
          rotateY: isHovered ? -3 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full"
      >
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold truncate max-w-[200px]">
              {deck.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
              {dueCards > 0 && (
                <span className="ml-2 text-primary font-medium">
                  • {dueCards} due
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(deck)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete deck</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{deck.name}&quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => onDelete(deck.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}% mastered</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Link href={`/decks/${deck.id}`}>
            <Button
              variant="outline"
              className="w-full gap-2 relative overflow-hidden group bg-primary/5 border-primary/20 hover:bg-primary/10"
            >
              <span>Study Now</span>
              <ExternalLink className="h-4 w-4" />
              
              {/* Hover gradient animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100"
                animate={isHovered ? {
                  x: ['0%', '100%'],
                } : {}}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </Button>
          </Link>
        </div>
      </motion.div>
      
      {/* Background pulse effect */}
      {isHovered && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1.1,
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute inset-0 rounded-xl bg-primary"
          style={{ zIndex: -1 }}
        />
      )}
    </motion.div>
  );
}