"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { useStore } from "@/hooks/use-store";
import { ChartContainer } from "@/components/chart-container";
import { StatCard } from "@/components/stat-card";
import { Brain, Award, BarChart, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function StatsPage() {
  const { state } = useStore();
  
  // Generate last 7 days for charts
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, "MMM d");
    });
  }, []);
  
  // Calculate retention rate per day for the last 7 days
  const retentionData = useMemo(() => {
    const data = last7Days.map(dayLabel => {
      const formattedDate = format(new Date(dayLabel), "yyyy-MM-dd");
      const dayStat = state.dailyStats.find(stat => stat.date === formattedDate);
      return dayStat ? Math.round(dayStat.retention * 100) : 0;
    });
    
    return {
      labels: last7Days,
      datasets: [
        {
          label: "Retention Rate (%)",
          data,
          borderColor: "hsl(var(--chart-1))",
          backgroundColor: "hsla(var(--chart-1), 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [last7Days, state.dailyStats]);
  
  // Calculate cards mastered per deck
  const deckMasteryData = useMemo(() => {
    const labels = state.decks.map(deck => deck.name);
    const masteredCards = state.decks.map(deck => 
      deck.cards.filter(card => card.mastered).length
    );
    const totalCards = state.decks.map(deck => deck.cards.length);
    
    return {
      labels,
      datasets: [
        {
          label: "Cards Mastered",
          data: masteredCards,
          backgroundColor: "hsla(var(--chart-2), 0.8)",
          hoverBackgroundColor: "hsla(var(--chart-2), 1)",
          borderRadius: 6,
        },
        {
          label: "Total Cards",
          data: totalCards,
          backgroundColor: "hsla(var(--chart-3), 0.4)",
          hoverBackgroundColor: "hsla(var(--chart-3), 0.6)",
          borderRadius: 6,
        },
      ],
    };
  }, [state.decks]);
  
  // Options for bar chart
  const barOptions = {
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  };
  
  // Check if there's enough data
  const hasData = state.decks.length > 0 && state.decks.some(deck => deck.cards.length > 0);
  
  // Get cards due today
  const cardsDueToday = useMemo(() => {
    const today = new Date();
    return state.decks.reduce((total, deck) => {
      const dueCards = deck.cards.filter(card => {
        return new Date(card.nextReview) <= today;
      }).length;
      return total + dueCards;
    }, 0);
  }, [state.decks]);
  
  // Get cards reviewed today
  const cardsReviewedToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayStat = state.dailyStats.find(stat => stat.date === today);
    return todayStat ? todayStat.cardsReviewed : 0;
  }, [state.dailyStats]);
  
  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground mt-1">
          Track your learning progress
        </p>
      </header>
      
      {/* Stats overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Cards"
          value={state.stats.total}
          icon={<Brain className="w-4 h-4" />}
        />
        <StatCard
          title="Cards Mastered"
          value={`${state.stats.mastered} (${
            state.stats.total > 0
              ? Math.round((state.stats.mastered / state.stats.total) * 100)
              : 0
          }%)`}
          icon={<Award className="w-4 h-4" />}
        />
        <StatCard
          title="Retention Rate"
          value={`${state.stats.retention}%`}
          icon={<BarChart className="w-4 h-4" />}
        />
        <StatCard
          title="Current Streak"
          value={state.streak}
          description={`Last review: ${
            state.lastReviewDate
              ? formatDate(state.lastReviewDate)
              : "Never"
          }`}
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>
      
      {/* Charts */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartContainer
            type="line"
            data={retentionData}
            title="Retention Rate"
            subtitle="Percentage of correct answers over the last 7 days"
          />
          
          <ChartContainer
            type="bar"
            data={deckMasteryData}
            options={barOptions}
            title="Cards Mastered by Deck"
            subtitle="Progress across all your decks"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BarChart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">No stats available yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Start learning with your flashcards to generate statistics
          </p>
          <Link href="/decks">
            <Button>Go to Decks</Button>
          </Link>
        </div>
      )}
      
      {/* Decks table */}
      {hasData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Deck Overview</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Deck</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Total Cards</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Mastered</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Due Today</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {state.decks.map((deck, index) => {
                  const totalCards = deck.cards.length;
                  const masteredCards = deck.cards.filter(card => card.mastered).length;
                  const masteryPercentage = totalCards > 0 
                    ? Math.round((masteredCards / totalCards) * 100) 
                    : 0;
                  
                  const dueToday = deck.cards.filter(card => {
                    return new Date(card.nextReview) <= new Date();
                  }).length;
                  
                  return (
                    <tr
                      key={deck.id}
                      className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                    >
                      <td className="py-3 px-4 border-t border-border font-medium">
                        <Link href={`/decks/${deck.id}`} className="hover:underline">
                          {deck.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 border-t border-border">
                        {totalCards}
                      </td>
                      <td className="py-3 px-4 border-t border-border">
                        {masteredCards} ({masteryPercentage}%)
                      </td>
                      <td className="py-3 px-4 border-t border-border">
                        {dueToday > 0 ? (
                          <span className="text-primary font-medium">{dueToday}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-t border-border text-muted-foreground text-sm">
                        {formatDate(deck.updatedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Today's review summary */}
      {hasData && (
        <div className="mt-8 p-6 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-lg font-medium">Cards Due</div>
              <div className="text-3xl font-bold mt-2">{cardsDueToday}</div>
              {cardsDueToday > 0 && (
                <div className="mt-4">
                  <Link href="/decks">
                    <Button size="sm">Review Now</Button>
                  </Link>
                </div>
              )}
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-lg font-medium">Cards Reviewed</div>
              <div className="text-3xl font-bold mt-2">{cardsReviewedToday}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {cardsReviewedToday > 0 
                  ? "Great progress today!" 
                  : "No cards reviewed yet today."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}