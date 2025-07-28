'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { usePersistGameState } from '@/hooks/use-persist-game-state';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function EndGameButton({ announceWinner }: { announceWinner: () => void }) {
  const t = useTranslations('game');
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
        {t('endGame')}
      </Button>

      <Modal
        isOpen={showModal}
        title={t('endGame')}
        description={t('endGameConfirmation')}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          endGame();
          announceWinner();
          setShowModal(false);
        }}
        confirmText={t('endGame')}
        variant="danger"
      />
    </>
  );
}
