import MultipleChoiceQuestion from '@/components/questions-templates/MultipleChoiceQuestion';
import ImageQuestion from '@/components/questions-templates/ImageQuestion';
import VoiceQuestion from '@/components/questions-templates/VoiceQuestion';
import RangeQuestion from '@/components/questions-templates/RangeQuestion';
import VideoQuestion from '@/components/questions-templates/VideoQuestion';
import { QuestionType, QuestionData } from '@/components/questions-templates/types';
import React from 'react';

type QuestionState = {
  selectedChoice: number | null;
  setSelectedChoice: (choice: number | null) => void;
  userAnswer: string | null;
  setUserAnswer: (value: string | null) => void;
};

export function getTemplateMap(
  props: { question: QuestionData; onAnswer: (isCorrect: boolean) => void } & QuestionState
): Record<QuestionType, React.ReactElement | null> {
  const {
    question,
    onAnswer,
    selectedChoice,
    setSelectedChoice,
    userAnswer,
    setUserAnswer,
  } = props;

  const handleMultipleChoice = (idx: number | null) => {
    if (idx !== null) {
      setSelectedChoice(idx);
    }
  };

  const handleRangeAnswer = (value: string | null) => {
    setUserAnswer(value);
  };

  return {
    [QuestionType.MultipleChoice]: (
      question['question-type'] === QuestionType.MultipleChoice && (
        <MultipleChoiceQuestion
          question={question}
          onAnswer={onAnswer}
          selectedChoice={selectedChoice}
          setSelectedChoice={handleMultipleChoice}
        />
      )
    ),
    [QuestionType.Image]: (
      question['question-type'] === QuestionType.Image && (
        <ImageQuestion
          question={question}
          onAnswer={onAnswer}
          userAnswer={userAnswer}
          setUserAnswer={handleRangeAnswer}
        />
      )
    ),
    [QuestionType.Voice]: (
      question['question-type'] === QuestionType.Voice && (
        <VoiceQuestion
          question={question}
          onAnswer={onAnswer}
          userAnswer={userAnswer}
          setUserAnswer={handleRangeAnswer}
        />
      )
    ),
    [QuestionType.Range]: (
      question['question-type'] === QuestionType.Range && (
        <RangeQuestion
          question={question}
          onAnswer={onAnswer}
          userAnswer={userAnswer}
          setUserAnswer={handleRangeAnswer}
        />
      )
    ),
    [QuestionType.Video]: (
      question['question-type'] === QuestionType.Video && (
        <VideoQuestion
          question={question}
          onAnswer={onAnswer}
          selectedChoice={selectedChoice}
          setSelectedChoice={handleMultipleChoice}
        />
      )
    ),
  } as Record<QuestionType, React.ReactElement | null>;
}

