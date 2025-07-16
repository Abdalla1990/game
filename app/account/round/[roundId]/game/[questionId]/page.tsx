'use client';

import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuestions } from '@/context/queries';
import { useGame } from '@/context/GameContext';
import Button from '@/components/ui/Button';
import { getTemplateMap } from '@/components/questions-templates/templateMap';
import { QuestionData } from '@/components/questions-templates/types';
import AnswerModal from '@/components/questions-templates/AnswerModal';

export default function GameQuestionPage({
  params
}: {
  params: { roundId: string; questionId: string }
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: questions = [] } = useQuestions();
  const { currentTurn, answerQuestion, setGameState, answeredQuestions } = useGame();
  const question = questions.find(q => q.id === params.questionId) as QuestionData | undefined;
  // const isAnswered = !!answeredQuestions.find(item => item?.split("-")[0] === question?.categoryId && item?.split("-")[1] === question?.id)

  const [answerState, setAnswerState] = useState<{
    selectedChoice: number | null;
    userAnswer: string | null;
    showModal: boolean;
    isCorrect: boolean;
  }>({
    selectedChoice: null,
    userAnswer: null,
    showModal: false,
    isCorrect: false
  });

  // if (isAnswered) {
  //   redirect(`/account/round/${params.roundId}`)
  // }
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="mb-4">Please login to view this question.</p>
        <Button variant="primary" onClick={() => router.push('/auth')}>
          Login →
        </Button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
        <p className="mb-4">The question you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => router.push(`/account/round/${params.roundId}`)}>
          Back to Round
        </Button>
      </div>
    );
  }

  const handleAnswer = (isCorrect: boolean) => {
    setAnswerState(prev => ({ ...prev, showModal: true, isCorrect }));

    if (isCorrect && currentTurn) {
      answerQuestion(currentTurn, question.points, { questionId: question.id, categoryId: question.categoryId });
    } else if (!isCorrect) {
      setGameState((current) => ({
        ...current,
        answeredQuestions: [
          ...(current?.answeredQuestions ?? []),
          `${question.categoryId}-${question.id}`
        ]
      }));
    }
  };

  const handleModalClose = () => {
    router.push(`/account/round/${params.roundId}`);
  };

  const getUserAnswer = () => {
    if (question['question-type'] !== 'multiple-choice') {
      return answerState.userAnswer || 'No answer provided';
    }
    if (
      answerState.selectedChoice !== null &&
      question &&
      'choices' in question &&
      Array.isArray(question.choices)
    ) {
      return question.choices[answerState.selectedChoice];
    }
    return 'No answer provided';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{question.points} Points</h1>
        <Button
          variant="secondary"
          onClick={() => router.push(`/account/round/${params.roundId}`)}
        >
          Back to Game
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        {getTemplateMap({
          question,
          onAnswer: handleAnswer,
          selectedChoice: answerState.selectedChoice,
          setSelectedChoice: (choice: number) =>
            setAnswerState(prev => ({ ...prev, selectedChoice: choice })),
          userAnswer: answerState.userAnswer,
          setUserAnswer: (value: string | null) =>
            setAnswerState(prev => ({ ...prev, userAnswer: value }))
        })[question['question-type'] || ""]}
      </div>
      {console.log({ question })}
      <AnswerModal
        isOpen={answerState.showModal}
        isCorrect={answerState.isCorrect}
        correctAnswer={question?.['correct-answer'] || question?.choices?.[question?.['correct-answer-index']]}
        userAnswer={getUserAnswer()}
        onClose={handleModalClose}
      />
    </div>
  );
}
