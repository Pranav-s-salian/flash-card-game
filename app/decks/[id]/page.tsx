import { DeckView } from "@/components/deck-view";

export function generateStaticParams() {
  return [
    { id: 'spanish-vocabulary' },
    { id: 'math-formulas' },
    { id: 'science-terms' },
    { id: 'history-dates' },
    { id: 'programming-concepts' }
  ];
}

export default function DeckPage({ params }: { params: { id: string } }) {
  return <DeckView deckId={params.id} />;
}