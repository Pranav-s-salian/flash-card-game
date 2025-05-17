"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Download, Upload, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/hooks/use-store";
import { Deck } from "@/types";
import { DeckCard } from "@/components/deck-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { generateId, downloadJson } from "@/lib/utils";
import Link from "next/link";

export default function DecksPage() {
  const { state, dispatch } = useStore();
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddDeck = () => {
    if (!deckName.trim()) {
      toast.error("Please enter a deck name");
      return;
    }

    const newDeck: Deck = {
      id: generateId(),
      name: deckName,
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_DECK", payload: newDeck });
    setDeckName("");
    setIsAddingDeck(false);
    toast.success("Deck created successfully");
  };

  const handleUpdateDeck = () => {
    if (!editingDeck) return;

    if (!deckName.trim()) {
      toast.error("Please enter a deck name");
      return;
    }

    const updatedDeck: Deck = {
      ...editingDeck,
      name: deckName,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: "UPDATE_DECK", payload: updatedDeck });
    setDeckName("");
    setEditingDeck(null);
    setIsEditingDeck(false);
    toast.success("Deck updated successfully");
  };

  const handleDeleteDeck = (id: string) => {
    dispatch({ type: "DELETE_DECK", payload: id });
    toast.success("Deck deleted successfully");
  };

  const handleEditDeck = (deck: Deck) => {
    setEditingDeck(deck);
    setDeckName(deck.name);
    setIsEditingDeck(true);
  };

  const handleExportDecks = () => {
    downloadJson(state.decks, `neurocards-export-${new Date().toISOString().split('T')[0]}.json`);
    toast.success("Decks exported successfully");
  };

  const handleImportDecks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedDecks = JSON.parse(e.target?.result as string);
        if (!Array.isArray(importedDecks)) {
          throw new Error("Invalid format");
        }

        // Validate imported decks
        const validDecks = importedDecks.filter((deck) => {
          return (
            typeof deck.id === "string" &&
            typeof deck.name === "string" &&
            Array.isArray(deck.cards)
          );
        });

        if (validDecks.length === 0) {
          toast.error("No valid decks found in the imported file");
          return;
        }

        // Generate new IDs to avoid conflicts
        const decksWithNewIds = validDecks.map((deck) => ({
          ...deck,
          id: generateId(),
          cards: deck.cards.map((card: any) => ({
            ...card,
            id: generateId(),
          })),
        }));

        dispatch({ type: "IMPORT_DECKS", payload: decksWithNewIds });
        toast.success(`${decksWithNewIds.length} decks imported successfully`);
      } catch (error) {
        toast.error("Failed to import decks. Invalid file format.");
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get decks with due cards count
  const decksWithDueCards = state.decks.map(deck => {
    const dueCards = deck.cards.filter(card => {
      return new Date(card.nextReview) <= new Date();
    }).length;
    return { ...deck, dueCards };
  }).sort((a, b) => b.dueCards - a.dueCards);

  return (
    <div className="container py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Decks</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your flashcard decks
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleExportDecks} 
              variant="outline" 
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline" 
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportDecks}
            />
            
            <Button onClick={() => setIsAddingDeck(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Deck</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Due cards notification */}
      {decksWithDueCards.some(d => d.dueCards > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-lg border border-primary/30 bg-primary/10"
        >
          <h2 className="text-lg font-medium mb-2 flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
            Cards due for review
          </h2>
          <div className="space-y-2">
            {decksWithDueCards
              .filter(d => d.dueCards > 0)
              .map(deck => (
                <div key={deck.id} className="flex items-center justify-between">
                  <span>{deck.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary font-medium">
                      {deck.dueCards} card{deck.dueCards !== 1 ? 's' : ''} due
                    </span>
                    <Link href={`/decks/${deck.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {state.decks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">No decks yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Create your first deck to start learning with spaced repetition
          </p>
          <Button onClick={() => setIsAddingDeck(true)}>Create a Deck</Button>
        </motion.div>
      )}

      {/* Deck grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {state.decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onDelete={handleDeleteDeck}
              onEdit={handleEditDeck}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Deck Dialog */}
      <Dialog open={isAddingDeck} onOpenChange={setIsAddingDeck}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new deck</DialogTitle>
            <DialogDescription>
              Give your deck a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deck-name">Deck name</Label>
              <Input
                id="deck-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="e.g., Biology 101"
                className="col-span-3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddDeck();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingDeck(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDeck}>Create Deck</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Deck Dialog */}
      <Dialog open={isEditingDeck} onOpenChange={setIsEditingDeck}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit deck</DialogTitle>
            <DialogDescription>
              Update your deck name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deck-name-edit">Deck name</Label>
              <Input
                id="deck-name-edit"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="col-span-3"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateDeck();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingDeck(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDeck}>Update Deck</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}