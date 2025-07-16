import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getRound, getRounds } from '@/database/rounds';
import { Round, Category, Question, GameState } from '@/database/types';

export function useRound(roundId: string | undefined): UseQueryResult<Round & GameState, Error> {
  return useQuery({
    // staleTime: 1000 * 60 * 5, // 5 minutes
    queryKey: ['round', roundId,] as const,
    queryFn: async () => {
      if (!roundId) { throw new Error('Round ID required') };
      const round = await getRound(roundId);
      if (!round) throw new Error('Round not found');
      return round;
    },

  });
}

export function useQuestions() {
  return useQuery({
    queryKey: ['questions'] as const,
    queryFn: async () => {
      const res = await fetch('/questions-ar.json');
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      if (!data) throw new Error('No questions data');
      return data as Question[];
    }
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'] as const,
    queryFn: async () => {
      const res = await fetch('/categories.json');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      if (!data) throw new Error('No categories data');
      return data as Category[];
    }
  });
}

export function useRecentGames(userId: string | undefined): UseQueryResult<(Round & GameState)[], Error> {
  return useQuery({
    queryKey: ['rounds', userId] as const,
    queryFn: async () => {
      if (!userId) { throw new Error('User ID required') };
      const rounds = await getRounds(userId);
      if (!rounds) return [];
      return rounds;
    },
  });
}
