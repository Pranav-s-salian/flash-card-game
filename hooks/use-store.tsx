"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppState, Card, Deck } from "@/types";
import { saveState } from "@/lib/storage";

// Action types
type Action =
  | { type: "ADD_DECK"; payload: Deck }
  | { type: "UPDATE_DECK"; payload: Deck }
  | { type: "DELETE_DECK"; payload: string }
  | { type: "IMPORT_DECKS"; payload: Deck[] }
  | { type: "ADD_CARD"; payload: { deckId: string; card: Card } }
  | { type: "UPDATE_CARD"; payload: { deckId: string; card: Card } }
  | { type: "DELETE_CARD"; payload: { deckId: string; cardId: string } }
  | { type: "REVIEW_CARD"; payload: { deckId: string; cardId: string; isCorrect: boolean } }
  | { type: "UPDATE_STREAK"; payload: number }
  | { type: "UPDATE_THEME"; payload: "light" | "dark" }
  | { type: "RESET_STATE"; payload: AppState };

// Context
type StoreContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Reducer
function storeReducer(state: AppState, action: Action): AppState {
  const today = new Date().toISOString().split("T")[0];

  switch (action.type) {
    case "ADD_DECK":
      return {
        ...state,
        decks: [...state.decks, action.payload],
      };

    case "UPDATE_DECK":
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === action.payload.id ? { ...action.payload } : deck
        ),
      };

    case "DELETE_DECK":
      return {
        ...state,
        decks: state.decks.filter((deck) => deck.id !== action.payload),
      };

    case "IMPORT_DECKS":
      return {
        ...state,
        decks: [...state.decks, ...action.payload],
      };

    case "ADD_CARD": {
      const { deckId, card } = action.payload;
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? { ...deck, cards: [...deck.cards, card], updatedAt: new Date().toISOString() }
            : deck
        ),
      };
    }

    case "UPDATE_CARD": {
      const { deckId, card } = action.payload;
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                cards: deck.cards.map((c) => (c.id === card.id ? card : c)),
                updatedAt: new Date().toISOString(),
              }
            : deck
        ),
      };
    }

    case "DELETE_CARD": {
      const { deckId, cardId } = action.payload;
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                cards: deck.cards.filter((card) => card.id !== cardId),
                updatedAt: new Date().toISOString(),
              }
            : deck
        ),
      };
    }

    case "REVIEW_CARD": {
      const { deckId, cardId, isCorrect } = action.payload;
      
      // Find the deck and card
      const targetDeck = state.decks.find((deck) => deck.id === deckId);
      if (!targetDeck) return state;
      
      const targetCard = targetDeck.cards.find((card) => card.id === cardId);
      if (!targetCard) return state;
      
      // Update card interval and next review date
      const newInterval = isCorrect ? Math.min(targetCard.interval * 2, 30) : 1;
      const today = new Date();
      const nextReview = new Date(today);
      nextReview.setDate(today.getDate() + newInterval);
      
      const updatedCard: Card = {
        ...targetCard,
        interval: newInterval,
        nextReview: nextReview.toISOString(),
        mastered: newInterval >= 30,
        lastReview: today.toISOString(),
      };
      
      // Update daily stats
      const todayIsoDate = today.toISOString().split("T")[0];
      
      const existingDailyStatIndex = state.dailyStats.findIndex(
        (stat) => stat.date === todayIsoDate
      );
      
      let updatedDailyStats = [...state.dailyStats];
      
      if (existingDailyStatIndex >= 0) {
        // Update existing stats for today
        const existingStat = state.dailyStats[existingDailyStatIndex];
        const totalReviewed = existingStat.cardsReviewed + 1;
        const correctCount = isCorrect
          ? existingStat.retention * existingStat.cardsReviewed + 1
          : existingStat.retention * existingStat.cardsReviewed;
          
        updatedDailyStats[existingDailyStatIndex] = {
          ...existingStat,
          cardsReviewed: totalReviewed,
          retention: Math.round((correctCount / totalReviewed) * 100) / 100,
        };
      } else {
        // Create new stats for today
        updatedDailyStats.push({
          date: todayIsoDate,
          cardsReviewed: 1,
          retention: isCorrect ? 1 : 0,
        });
      }
      
      // Limit daily stats to last 30 days
      if (updatedDailyStats.length > 30) {
        updatedDailyStats = updatedDailyStats.slice(-30);
      }
      
      // Calculate overall stats
      const allCards = state.decks.flatMap((d) => d.cards);
      const totalCards = allCards.length;
      const masteredCards = allCards.filter((c) => c.mastered).length + (updatedCard.mastered && !targetCard.mastered ? 1 : 0);
      
      const totalReviewed = updatedDailyStats.reduce((sum, stat) => sum + stat.cardsReviewed, 0);
      const retentionRate = totalReviewed > 0
        ? Math.round(
            (updatedDailyStats.reduce(
              (sum, stat) => sum + stat.retention * stat.cardsReviewed,
              0
            ) /
              totalReviewed) *
              100
          )
        : 0;
      
      // Update streak
      const lastReviewDate = state.lastReviewDate;
      let streak = state.streak;
      
      if (!lastReviewDate) {
        // First review
        streak = 1;
      } else {
        const lastDate = new Date(lastReviewDate);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        if (lastDate.toISOString().split("T")[0] === yesterday.toISOString().split("T")[0]) {
          // Reviewed yesterday, increment streak
          streak += 1;
        } else if (lastDate.toISOString().split("T")[0] !== today.toISOString().split("T")[0]) {
          // Missed a day, reset streak
          streak = 1;
        }
        // If already reviewed today, keep streak the same
      }
      
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                cards: deck.cards.map((card) =>
                  card.id === cardId ? updatedCard : card
                ),
                updatedAt: today.toISOString(),
              }
            : deck
        ),
        stats: {
          ...state.stats,
          total: totalCards,
          mastered: masteredCards,
          retention: retentionRate,
          streak: streak,
        },
        dailyStats: updatedDailyStats,
        streak: streak,
        lastReviewDate: today.toISOString(),
      };
    }

    case "UPDATE_STREAK":
      return {
        ...state,
        streak: action.payload,
        stats: {
          ...state.stats,
          streak: action.payload,
        },
      };

    case "UPDATE_THEME":
      return {
        ...state,
        theme: action.payload,
      };

    case "RESET_STATE":
      return action.payload;

    default:
      return state;
  }
}

// Provider component
export function StoreProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: AppState;
}) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Save state to localStorage when it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to use the store
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}