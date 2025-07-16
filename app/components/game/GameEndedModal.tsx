'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';

interface GameEndedModalProps {
  isOpen: boolean;
}

export function GameEndedModal({ isOpen }: GameEndedModalProps) {
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      title="Game Ended"
      description="This game has ended. You can view the final scores, but no further changes can be made."
      onClose={() => router.push('/account')}
      cancelText="Return to Dashboard"
    />
  );
}
