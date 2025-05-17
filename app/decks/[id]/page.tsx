import { DeckView } from "@/components/deck-view";

// Use `any` to bypass type-checking for params
type Props = {
  params: any; // Temporarily bypass type-checking
};

export function generateStaticParams() {
  return [
    { id: 'spanish-vocabulary' },
    { id: 'math-formulas' },
    { id: 'science-terms' },
    { id: 'history-dates' },
    { id: 'programming-concepts' }
  ];
}

export default function DeckPage({ params }: Props) {
  return <DeckView deckId={params.id} />;
}