import React from 'react';

import { VoiceQuestionProps } from './types';

const VoiceQuestion: React.FC<VoiceQuestionProps> = ({ question, userAnswer, setUserAnswer, onAnswer }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleCheckAnswer = () => {
    if (!userAnswer?.trim()) return;
    // Case-insensitive comparison
    onAnswer(userAnswer.trim().toLowerCase() === question['correct-answer'].toLowerCase());
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{question.title}</h2>
      <audio controls className="mb-4 w-full">
        {
          question['audio-type'] === 'base64' ? (
            <source src={question['audio-data']} type="audio/mp3" />

          ) : (
            <source src={question['voice-url']} type="audio/mpeg" />
          )
        }
        {question.transcript && (
          <track kind="captions" src="" label="Transcript" default />
        )}
        Your browser does not support the audio element.
      </audio>

      <div className="space-y-4">
        <div>
          <label htmlFor="answer-input" className="block mb-2 font-semibold">
            وش سمعت ؟
          </label>
          <input
            id="answer-input"
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={userAnswer || ''}
            onChange={handleInputChange}
            placeholder="Type what you heard..."
          />
        </div>
        <button
          onClick={handleCheckAnswer}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!userAnswer?.trim()}
        >
          Check Answer
        </button>
        {question.transcript && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Transcript:</h3>
            <p className="text-gray-700">{question.transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceQuestion;
