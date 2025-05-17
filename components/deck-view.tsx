"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/hooks/use-store";
import { Card as CardType } from "@/types";
import { Flashcard } from "@/components/flashcard";
import { ProgressIndicator } from "@/components/progress-indicator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Plus, Check } from "lucide-react";

export function DeckView({ deckId }: { deckId: string }) {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const [currentDeck, setCurrentDeck] = useState(state.decks.find(d => d.id === deckId));
  const [dueCards, setDueCards] = useState<CardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  
  useEffect(() => {
    const deck = state.decks.find(d => d.id === deckId);
    if (!deck) {
      router.push("/decks");
      return;
    }
    setCurrentDeck(deck);
    
    const now = new Date();
    const due = deck.cards.filter(card => {
      return new Date(card.nextReview) <= now;
    });
    setDueCards(due);
    setCurrentCardIndex(0);
    
    setShowCompletionMessage(due.length === 0 && deck.cards.length > 0);
  }, [state.decks, deckId, router]);
  
  if (!currentDeck) {
    return <div className="container py-8">Loading...</div>;
  }
  
  const handleAddCard = () => {
    if (!cardFront.trim() || !cardBack.trim()) {
      toast.error("Please fill in both front and back of the card");
      return;
    }
    
    const newCard: CardType = {
      id: generateId(),
      front: cardFront,
      back: cardBack,
      interval: 1,
      nextReview: new Date().toISOString(),
      mastered: false,
      createdAt: new Date().toISOString(),
    };
    
    dispatch({ 
      type: "ADD_CARD", 
      payload: { deckId, card: newCard } 
    });
    
    setCardFront("");
    setCardBack("");
    setIsAddingCard(false);
    
    toast.success("Card added successfully");
  };
  
  const handleUpdateCard = () => {
    if (!editingCard) return;
    
    if (!cardFront.trim() || !cardBack.trim()) {
      toast.error("Please fill in both front and back of the card");
      return;
    }
    
    const updatedCard: CardType = {
      ...editingCard,
      front: cardFront,
      back: cardBack,
    };
    
    dispatch({ 
      type: "UPDATE_CARD", 
      payload: { deckId, card: updatedCard } 
    });
    
    setCardFront("");
    setCardBack("");
    setEditingCard(null);
    setIsEditingCard(false);
    
    toast.success("Card updated successfully");
  };
  
  const handleEditCard = (card: CardType) => {
    setEditingCard(card);
    setCardFront(card.front);
    setCardBack(card.back);
    setIsEditingCard(true);
  };
  
  const handleDeleteCard = (cardId: string) => {
    dispatch({ 
      type: "DELETE_CARD", 
      payload: { deckId, cardId } 
    });
    
    toast.success("Card deleted successfully");
  };
  
  const handleCardReview = (isCorrect: boolean) => {
    const currentCard = dueCards[currentCardIndex];
    
    dispatch({
      type: "REVIEW_CARD",
      payload: { deckId, cardId: currentCard.id, isCorrect },
    });
    
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setShowCompletionMessage(true);
      
      if (typeof window !== "undefined" && dueCards.length > 0) {
        const confetti = () => {
          let container = document.getElementById("confetti-container");
          if (!container) {
            container = document.createElement("div");
            container.id = "confetti-container";
            container.style.position = "fixed";
            container.style.left = "0";
            container.style.top = "0";
            container.style.width = "100vw";
            container.style.height = "100vh";
            container.style.pointerEvents = "none";
            container.style.zIndex = "9999";
            document.body.appendChild(container);
          }
          
          const colors = ["#ff0080", "#7928ca", "#0070f3", "#00b8d9", "#0fa"];
          
          for (let i = 0; i < 150; i++) {
            const particle = document.createElement("div");
            const size = Math.floor(Math.random() * 10) + 5;
            
            particle.style.position = "absolute";
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
            particle.style.top = "50%";
            particle.style.left = "50%";
            
            container.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const tilt = Math.random() * 360;
            const flip = Math.random() > 0.5 ? 1 : -1;
            
            const animation = particle.animate(
              [
                {
                  transform: `translate(-50%, -50%) rotate(0deg)`,
                  opacity: 1,
                },
                {
                  transform: `translate(
                    calc(-50% + ${Math.cos(angle) * velocity * 3}px), 
                    calc(-50% + ${Math.sin(angle) * velocity * 2 + 200}px)
                  ) rotate(${tilt * flip}deg)`,
                  opacity: 0,
                },
              ],
              {
                duration: 1000 + Math.random() * 2000,
                easing: "cubic-bezier(0.1, 0.8, 0.3, 1)",
              }
            );
            
            animation.onfinish = () => {
              particle.remove();
            };
          }
          
          setTimeout(() => {
            if (container) {
              container.remove();
            }
          }, 5000);
        };
        
        confetti();
      }
      
      toast.success("Great job! All cards reviewed.");
    }
  };
  
  const handleNext = () => {
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };
  
  return (
    <div className="container py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <Link href="/decks">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{currentDeck.name}</h1>
            <p className="text-muted-foreground mt-1">
              {currentDeck.cards.length} card{currentDeck.cards.length !== 1 ? 's' : ''}
              {dueCards.length > 0 && (
                <span className="ml-2 text-primary">• {dueCards.length} due for review</span>
              )}
            </p>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col gap-8">
        <div className="grid gap-8">
          {dueCards.length > 0 && (
            <>
              <ProgressIndicator
                current={currentCardIndex + 1}
                total={dueCards.length}
                className="max-w-md mx-auto"
              />
              
              <Flashcard
                card={dueCards[currentCardIndex]}
                onNext={handleNext}
                onPrev={handlePrev}
                onKnow={() => handleCardReview(true)}
                onDontKnow={() => handleCardReview(false)}
                hasNext={currentCardIndex < dueCards.length - 1}
                hasPrev={currentCardIndex > 0}
              />
            </>
          )}
          
          {currentDeck.cards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">No cards yet</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Add your first card to start learning with spaced repetition
              </p>
              <Button onClick={() => setIsAddingCard(true)}>Add a Card</Button>
            </div>
          )}
          
          {showCompletionMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-medium mb-2">All caught up!</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                You've reviewed all cards for today. Come back tomorrow for more!
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setIsAddingCard(true)}>
                  Add Card
                </Button>
                <Link href="/stats">
                  <Button>View Stats</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
        
        {currentDeck.cards.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">All Cards</h2>
              <Button onClick={() => setIsAddingCard(true)} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Add Card</span>
              </Button>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Front</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Back</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Status</th>
                    <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Next Review</th>
                    <th className="py-3 px-4 text-right font-medium text-muted-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {currentDeck.cards.map((card, index) => {
                      const isDue = new Date(card.nextReview) <= new Date();
                      const nextReview = new Date(card.nextReview);
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      
                      let reviewText = "Due now";
                      if (!isDue) {
                        if (
                          nextReview.getDate() === tomorrow.getDate() &&
                          nextReview.getMonth() === tomorrow.getMonth() &&
                          nextReview.getFullYear() === tomorrow.getFullYear()
                        ) {
                          reviewText = "Tomorrow";
                        } else {
                          reviewText = nextReview.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }
                      }
                      
                      return (
                        <motion.tr
                          key={card.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                        >
                          <td className="py-3 px-4 border-t border-border max-w-[200px] truncate">
                            {card.front}
                          </td>
                          <td className="py-3 px-4 border-t border-border max-w-[200px] truncate">
                            {card.back}
                          </td>
                          <td className="py-3 px-4 border-t border-border">
                            {card.mastered ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/20 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
                                Mastered
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-400">
                                Learning
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 border-t border-border">
                            <span className={isDue ? "text-primary font-medium" : ""}>
                              {reviewText}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-t border-border text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleEditCard(card)}
                              >
                                Edit
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteCard(card.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new card</DialogTitle>
            <DialogDescription>
              Enter the front and back of your flashcard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="card-front">Front</Label>
              <Textarea
                id="card-front"
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                placeholder="e.g., What is photosynthesis?"
                className="min-h-[80px]"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-back">Back</Label>
              <Textarea
                id="card-back"
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                placeholder="e.g., The process by which plants convert light energy into chemical energy"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCard(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingCard} onOpenChange={setIsEditingCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit card</DialogTitle>
            <DialogDescription>
              Update the front and back of your flashcard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="card-front-edit">Front</Label>
              <Textarea
                id="card-front-edit"
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                className="min-h-[80px]"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-back-edit">Back</Label>
              <Textarea
                id="card-back-edit"
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCard(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCard}>Update Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}