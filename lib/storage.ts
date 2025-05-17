import { AppState } from "@/types";

const STORAGE_KEY = "neurocards-state";

// Initial mock data
const initialMockState: AppState = {
  decks: [
    {
      id: "spanish-vocabulary",
      name: "Spanish Vocabulary",
      cards: [
        {
          id: "spanish-1",
          front: "Hola",
          back: "Hello",
          interval: 1,
          nextReview: new Date().toISOString(),
          mastered: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "spanish-2",
          front: "Gracias",
          back: "Thank you",
          interval: 1,
          nextReview: new Date().toISOString(),
          mastered: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "spanish-3",
          front: "Adiós",
          back: "Goodbye",
          interval: 1,
          nextReview: new Date().toISOString(),
          mastered: false,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "math-formulas",
      name: "Math Formulas",
      cards: [
        {
          id: "math-1",
          front: "Area of a circle",
          back: "πr²",
          interval: 1,
          nextReview: new Date().toISOString(),
          mastered: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "math-2",
          front: "Pythagorean theorem",
          back: "a² + b² = c²",
          interval: 1,
          nextReview: new Date().toISOString(),
          mastered: false,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  stats: {
    total: 5,
    mastered: 0,
    retention: 0,
    streak: 0,
  },
  dailyStats: [],
  theme: "light",
  streak: 0,
};

// Save state to localStorage
export function saveState(state: AppState) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
}

// Load state from localStorage
export function loadState(): AppState {
  try {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    }
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
  }

  return initialMockState;
}

// Clear state from localStorage
export function clearState() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error clearing state from localStorage:", error);
  }
}