'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { GameState, Round } from '@/database/types';

interface RoundCardProps {
  round: Round;
}

export function RoundCard({ round }: RoundCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{round.name}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Created {new Date(round.createdAt).toLocaleDateString()}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              {round.teams.length} Teams • {round.categories.length} Categories
            </p>
            <p className="text-sm text-gray-600">
              Status: {round.isEnded ? 'Ended' : 'In Progress'}
            </p>
          </div>
        </div>
        <Link href={`/account/round/${round.id}`}>
          <Button>
            {round.isEnded ? 'View Results' : 'Continue Game'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
