/**
 * Type definitions for the Flashcard Engine
 */

export interface Card {
  id: string;
  front: string;
  back: string;
  interval: number; // in days
  nextReview: string; // ISO date string
  mastered: boolean;
  lastReview?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Stats {
  total: number;
  mastered: number;
  retention: number; // percentage
  streak: number;
}

export interface DailyStats {
  date: string; // ISO date string
  retention: number; // percentage
  cardsReviewed: number;
}

export interface AppState {
  decks: Deck[];
  stats: Stats;
  dailyStats: DailyStats[];
  theme: 'light' | 'dark';
  streak: number;
  lastReviewDate?: string; // ISO date string
}