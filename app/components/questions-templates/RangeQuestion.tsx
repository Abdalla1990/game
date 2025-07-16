import React from 'react';


import { RangeQuestionProps } from './types';
import Button from '../ui/Button';


const RangeHint: React.FC<{ range: number; unit?: string }> = ({ range, unit }) => {
  console.log({ type: typeof range, NaN: isNaN(range), range });
  if (typeof range !== 'number' || isNaN(range) || range <= 0) return null;

  return (
    <div className="flex items-center justify-center text-blue-700 text-sm mb-4 bg-blue-50 p-3 rounded-lg">
      <div className="flex flex-col items-center">
        <span className="text-lg">↑</span>
        <span className="font-bold text-xl">±{range}</span>
        <span className="text-lg">↓</span>
        {unit && (
          <span className="text-blue-600 text-xs mt-1">
            {unit}
          </span>
        )}
      </div>
      <div className="ml-3 text-blue-600 text-sm">
        Your answer will be correct if it's within this range of the exact value
      </div>
    </div>
  );
};

const RangeQuestion: React.FC<RangeQuestionProps> = ({ question, userAnswer, setUserAnswer, onAnswer }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setUserAnswer(value);
    }
  };

  const onCheckAnswer = () => {
    if (!userAnswer?.trim()) return;

    const numericAnswer = parseFloat(userAnswer);
    if (isNaN(numericAnswer)) return;

    // Calculate the allowed range based on the correct answer and the range value
    const correctAnswer = question['correct-answer'];


    // Check if the answer is within the allowed range of the correct answer
    const isWithinRange =
      Math.abs(numericAnswer - correctAnswer) <= question.range;

    onAnswer(isWithinRange);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{question.title}</h2>
      {question['image-hint'] && <img src={question['image-hint']} alt="Hint" className="mb-4 max-h-60 object-contain" />}
      {question['image-instructions'] && <p className="mb-2 italic text-gray-600">{question['image-instructions']}</p>}
      <RangeHint
        range={question.range}
        unit={question.unit}
      />
      <div className="mb-4">
        <label htmlFor="answer-input" className="block mb-2 font-semibold">
          Enter your answer{question.unit ? ` (${question.unit})` : ''}:
        </label>
        <input
          id="answer-input"
          type="number"
          step="any"
          min={question['min-value']}
          max={question['max-value']}
          className="w-full p-2 border rounded"
          value={userAnswer || ''}
          onChange={handleInputChange}
        />
        <Button
          variant="primary"
          onClick={onCheckAnswer}
          className="mt-4 w-full"
        >
          Check Answer
        </Button>
      </div>
    </div>
  );
};

export default RangeQuestion;
