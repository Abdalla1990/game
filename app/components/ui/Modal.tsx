'use client';

import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'danger' | 'success';
}

export function Modal({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  children,
  variant = 'default'
}: ModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
        {children}
        <div className="flex gap-4 justify-end mt-6">
          {onConfirm ? (
            <>
              <Button variant="secondary" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                className={getVariantStyles()}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              {cancelText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
