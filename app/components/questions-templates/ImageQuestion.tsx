import React from 'react';

import { ImageQuestionProps } from './types';

const ImageQuestion: React.FC<ImageQuestionProps> = ({ question, selectedChoice, setSelectedChoice, userAnswer, setUserAnswer, onAnswer }) => {
  const handleChoice = (idx: number) => {
    setSelectedChoice(idx);
    onAnswer(idx === question['correct-answer-index']);
  };

  const handleFreeFormAnswer = (answer: string) => {
    setUserAnswer(answer);
    // Don't validate immediately for free-form answers
  };

  const handleSubmit = () => {
    if (!userAnswer) return;
    // Case-insensitive comparison for free-form answers
    onAnswer(userAnswer.trim().toLowerCase() === question['correct-answer'].toLowerCase());
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{question.title}</h2>
      <img src={question['image-hint']} alt="Question" className="mb-4 max-h-60 object-contain" />
      {question['image-instructions'] && (
        <p className="mb-2 italic text-gray-600">{question['image-instructions']}</p>
      )}

      {question.choices ? (
        // Multiple choice mode
        <div className="space-y-2 mb-4">
          {question.choices.map((choice, idx) => (
            <button
              key={choice}
              className={`block w-full text-left p-2 border rounded ${selectedChoice === idx ? 'bg-blue-600 text-white' : 'bg-white'
                }`}
              onClick={() => handleChoice(idx)}
            >
              {choice}
            </button>
          ))}
        </div>
      ) : (
        // Free-form answer mode
        <div className="space-y-4">
          <input
            type="text"
            value={userAnswer || ''}
            onChange={(e) => handleFreeFormAnswer(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your answer here..."
          />
          <button
            onClick={handleSubmit}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!userAnswer}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageQuestion;
