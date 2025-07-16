import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { updateRound } from '@/database/rounds';
import { GameState } from '@/database/types';
import { useRound } from '@/context/queries';


export function usePersistGameState(roundId: string | null) {
  const queryClient = useQueryClient();

  const { data: roundData } = useRound(roundId);
  const queryKey = ['gameState', roundId, roundData?.id];
  const { data: gameState } = useQuery<Partial<GameState>>({
    queryKey,
    queryFn: () => {
      if (!roundData) {
        throw new Error(`Round data not found for roundId: ${roundId}`);
      }
      return {
        currentTurnIdx: roundData?.currentTurnIdx,
        scores: roundData?.scores,
        answeredQuestions: roundData?.answeredQuestions,
      };
    },
  });

  // Standardize to always use function updates
  const setGameState = useCallback((
    update: (current: GameState) => Partial<GameState>
  ) => {
    queryClient.setQueryData(queryKey, (oldState: GameState) => {
      const newState = {
        ...oldState,
        ...update(oldState)
      };

      // If we have a roundId and the game is initialized, persist to DB
      if (roundId) {
        updateRound(roundId, {
          currentTurnIdx: newState.currentTurnIdx,
          scores: newState.scores,
          answeredQuestions: newState.answeredQuestions,
        }).catch(console.error);
      }

      return newState;
    });
  }, [queryClient, queryKey, roundId]);

  const endGame = useCallback(() => {
    if (roundId) {
      updateRound(roundId, {
        isEnded: true
      }).catch(console.error);
    }
  }, [roundId]);

  return {
    gameState,
    setGameState,
    endGame,
  };
}