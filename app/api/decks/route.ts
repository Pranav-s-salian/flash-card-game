import { NextResponse } from "next/server";

export async function GET() {
  const mockData = [
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
  ];

  return NextResponse.json(mockData);
}