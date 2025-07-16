import React from 'react';
import { MultipleChoiceQuestionProps } from "./types";

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, selectedChoice, setSelectedChoice, onAnswer }) => {
  const handleChoice = (idx: number) => {
    setSelectedChoice(idx);
    onAnswer(idx === question['correct-answer-index']);
  };
  console.log({ question })
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{question.title}</h2>
      {question['image-hint'] && <img src={question['image-hint']} alt="Hint" className="mb-4 max-h-60 object-contain" />}
      {question['image-instructions'] && <p className="mb-2 italic text-gray-600">{question['image-instructions']}</p>}
      <ol className="space-y-2 mb-4">
        {question.choices.map((choice, idx) => (
          <li
            key={choice}
            className={`block w-full text-left p-2 border rounded ${selectedChoice === idx ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onClick={() => handleChoice(idx)}
          >
            {choice}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MultipleChoiceQuestion;
