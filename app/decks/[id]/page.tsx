import { DeckView } from "@/components/deck-view";

type PageParams = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
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

export default function DeckPage({ params }: PageParams) {
  return <DeckView deckId={params.id} />;
}