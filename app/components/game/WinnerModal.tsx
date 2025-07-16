import React from "react";

interface WinnerModalProps {
  open: boolean;
  winner: string;
  onClose: () => void;
  onCreateRound: () => void;
  onExit: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ open, winner, onClose, onCreateRound, onExit }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center relative">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="mb-6 text-lg">Winner: <span className="font-semibold text-green-600">{winner}</span></p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onCreateRound}
          >
            Create New Round
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onExit}
          >
            Exit
          </button>
        </div>
        <button className="absolute top-2 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default WinnerModal;
