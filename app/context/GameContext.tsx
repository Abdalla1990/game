'use client'

import React, { createContext, Suspense, useContext, useMemo } from 'react';
import { usePersistGameState } from '@/hooks/use-persist-game-state';
import { GameState, Team } from '@/database/types';
import { useParams } from 'next/navigation';
import Loading from '@/account/loading';
import { useRound } from './queries';

interface GameContextType {
  setGameState: (update: (current: GameState) => Partial<GameState>) => void;
  scores: { [teamId: string]: number };
  currentTurn: string | null;
  answeredQuestions: string[];
  answerQuestion: (teamId: string, points: number, { questionId, categoryId }: { questionId: string; categoryId: string }) => void;
  // initializeGame: (teams: Team[], roundId: string) => void;
  // teams: Team[];
  // roundId: string | null;
  // initialized: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}

class GameErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error loading game state. Please try refreshing the page.</div>;
    }

    return this.props.children;
  }
}

export const GameProvider = ({ children }: { children: React.ReactNode }) => {

  const params = useParams();
  const rawRoundId = params?.roundId;
  const roundId = Array.isArray(rawRoundId) ? rawRoundId[0] : rawRoundId;

  return (
    <GameErrorBoundary>
      <Suspense fallback={<Loading />}>
        <GameProviderInner roundId={roundId}>
          {children}
        </GameProviderInner>
      </Suspense>
    </GameErrorBoundary>
  );
};

const GameProviderInner = ({ children, roundId }: { children: React.ReactNode, roundId: string | null }) => {
  const { data: roundData } = useRound(roundId); // loads the round data
  const { gameState, setGameState } = usePersistGameState(roundId); // maintains the up-tp-data game-specific variables (scores and turnIndex) and syncs them with the useRound on every question

  // If gameState is undefined, throw an error that will be caught by the error boundary
  if (!gameState) {
    throw new Error(`Failed to load game state for round ${roundId}`);
  }

  const value: GameContextType = useMemo(() => ({
    setGameState,
    scores: gameState.scores,
    currentTurn: roundData.teams[gameState.currentTurnIdx]?.id ?? null,
    teams: roundData.teams,
    roundId: roundData.id,
    answeredQuestions: gameState?.answeredQuestions || [],
    answerQuestion: (teamId: string, points: number, { questionId, categoryId }) => {
      setGameState(current => ({
        ...current,
        scores: {
          ...current.scores,
          [teamId]: (current.scores[teamId] ?? 0) + points
        },
        currentTurnIdx: (current.currentTurnIdx + 1) % roundData.teams.length,
        answeredQuestions: [
          ...(current?.answeredQuestions ?? []),
          `${categoryId}-${questionId}`
        ]
      }));
    }
  }), [roundData, gameState, setGameState]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
