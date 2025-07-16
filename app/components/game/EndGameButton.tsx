'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { usePersistGameState } from '@/hooks/use-persist-game-state';
import { useParams, useRouter } from 'next/navigation';

export function EndGameButton({ announceWinner }: { announceWinner: () => void }) {
  const params = useParams();
  const roundId = Array.isArray(params.roundId) ? params.roundId[0] : params.roundId;
  const { endGame } = usePersistGameState(roundId);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="secondary"
        className="bg-red-600 text-white hover:bg-red-700"
      >
        End Game
      </Button>

      <Modal
        isOpen={showModal}
        title="End Game"
        description="Are you sure you want to end this game? This action cannot be undone."
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          endGame();
          announceWinner();
          setShowModal(false);
        }}
        confirmText="End Game"
        variant="danger"
      />
    </>
  );
}
