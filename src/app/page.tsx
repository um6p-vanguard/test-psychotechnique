'use client';

import { useRouter } from 'next/navigation';

import { ArrowRight, Brain, Clock, Lightbulb, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { GAMES_DATA } from '@/lib/data';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="container mx-auto flex flex-col items-center gap-8 px-4 py-16">
      <div className="text-center">
        <h1 className="mb-6 text-4xl font-bold">Brain Games Challenge</h1>
        <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg">
          Welcome to a collection of mind-bending puzzles and games designed to test your cognitive
          skills. Complete all games to become a mental master!
        </p>
      </div>

      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        {/* Game Collection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Game Collection</CardTitle>
            <CardDescription>
              {GAMES_DATA.length} games with{' '}
              {GAMES_DATA.reduce((acc, game) => acc + game.levels.length, 0)} total levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {GAMES_DATA.map((game, index) => (
                <div key={game.id} className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{game.name}</h3>
                    <p className="text-muted-foreground text-sm">{game.levels.length} levels</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="text-primary mr-2 h-5 w-5" />
              How to Play
            </CardTitle>
            <CardDescription>Complete each game to unlock the next one</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="flex items-center font-medium">
                <Clock className="text-muted-foreground mr-2 h-5 w-5" />
                Game Progression
              </h3>
              <ul className="text-muted-foreground ml-9 list-disc space-y-1 text-sm">
                <li>Each game contains multiple levels of increasing difficulty</li>
                <li>Complete all levels of a game to unlock the next game</li>
                <li>Your progress is shown in the progress bar at the top</li>
                <li>You cannot return to previous games or levels once completed</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="flex items-center font-medium">
                <Lightbulb className="text-muted-foreground mr-2 h-5 w-5" />
                Tips for Success
              </h3>
              <ul className="text-muted-foreground ml-9 list-disc space-y-1 text-sm">
                <li>Read the level instructions carefully before starting</li>
                <li>Focus on one level at a time</li>
                <li>Take breaks between games if needed</li>
                <li>Use the "Start" button to begin each level</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="flex items-center font-medium">
                <Trophy className="text-muted-foreground mr-2 h-5 w-5" />
                Winning the Challenge
              </h3>
              <p className="text-muted-foreground ml-9 text-sm">
                Complete all {GAMES_DATA.length} games with their{' '}
                {GAMES_DATA.reduce((acc, game) => acc + game.levels.length, 0)} levels to master the
                Brain Games Challenge!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => router.push('/play')} size="lg" className="mt-4">
        Start Playing
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </main>
  );
}
