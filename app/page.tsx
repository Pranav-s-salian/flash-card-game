import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[calc(100vh-64px)] items-center justify-center">
      {/* Hero */}
      <div className="text-center space-y-6 max-w-3xl">
        <div className="inline-block mb-4">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-primary/10 text-primary">
            <Brain className="w-10 h-10" />
          </div>
        </div>
      
        <h1 className={cn(
          "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight",
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
          "pb-2"
        )}>
          NeuroCards
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master anything with our beautiful, intelligent flashcard system designed to optimize your learning with spaced repetition.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link href="/decks">
            <Button size="lg" className="gap-2 group">
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/stats">
            <Button size="lg" variant="outline">
              View Stats
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
        <Feature 
          title="Spaced Repetition" 
          description="Our algorithm optimizes your review schedule based on your performance, helping you remember more with less time." 
          gradient="from-blue-500 to-cyan-500"
        />
        <Feature 
          title="Beautiful Experience" 
          description="Enjoy a visually stunning interface with smooth animations and transitions that make studying a pleasure." 
          gradient="from-purple-500 to-pink-500"
        />
        <Feature 
          title="Detailed Analytics" 
          description="Track your progress with comprehensive statistics on retention rates, mastery levels, and learning streaks." 
          gradient="from-amber-500 to-orange-500"
        />
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ for the hackathon</p>
      </div>
    </div>
  );
}

function Feature({ title, description, gradient }: { title: string; description: string; gradient: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 backdrop-blur-sm">
      <div className={cn(
        "w-12 h-12 rounded-full mb-4 flex items-center justify-center",
        "bg-gradient-to-br",
        gradient,
        "opacity-80"
      )} />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}