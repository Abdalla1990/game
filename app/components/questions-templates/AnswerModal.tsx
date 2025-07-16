import React from 'react';

interface AnswerModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  onClose: () => void;
}

const AnswerModal: React.FC<AnswerModalProps> = ({ isOpen, isCorrect, correctAnswer, userAnswer, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h2>

        <div className="mb-4 space-y-2">
          <div className="text-gray-600">Your answer:</div>
          <div className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {userAnswer || 'No answer provided'}
          </div>

          <div className="text-gray-600 mt-4">Correct answer:</div>
          <div className="font-medium text-blue-600">{correctAnswer}</div>
        </div>

        <button
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AnswerModal;
