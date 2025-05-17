import { DeckView } from "@/components/deck-view";
import type { PageProps } from "next";

export function generateStaticParams() {
  return [
    { id: 'spanish-vocabulary' },
    { id: 'math-formulas' },
    { id: 'science-terms' },
    { id: 'history-dates' },
    { id: 'programming-concepts' }
  ];
}

export default function DeckPage({ params }: PageProps) {
  return <DeckView deckId={params.id} />;
}