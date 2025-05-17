import { DeckView } from "@/components/deck-view";

type Props = {
  params: {
    id: string;
  };
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