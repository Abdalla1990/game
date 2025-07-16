import React from 'react';
import { VideoQuestionProps } from './types';

const VideoQuestion: React.FC<VideoQuestionProps> = ({ question, selectedChoice, setSelectedChoice, onAnswer }) => {
  const handleChoice = (idx: number) => {
    setSelectedChoice(idx);
    onAnswer(idx === question['correct-answer-index']);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{question.title}</h2>
      {question['video-url'] && (
        <div className="mb-4 aspect-w-16 aspect-h-9">
          <video
            controls
            className="w-full h-full rounded"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          >
            <source src={question['video-url']} type="video/mp4" />
            <track kind="captions" src="" label="English" />
            Your browser does not support the video element.
          </video>
        </div>
      )}
      {question['image-hint'] && <img src={question['image-hint']} alt="Hint" className="mb-4 max-h-60 object-contain" />}
      {question['image-instructions'] && <p className="mb-2 italic text-gray-600">{question['image-instructions']}</p>}
      <div className="space-y-2 mb-4">
        {question.choices.map((choice, idx) => (
          <button
            key={choice}
            className={`block w-full text-left p-2 border rounded ${selectedChoice === idx ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onClick={() => handleChoice(idx)}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoQuestion;
