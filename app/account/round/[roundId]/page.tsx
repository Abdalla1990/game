'use client';

import { useEffect, useState } from 'react';
import { useCategories, useQuestions, useRound } from '@/context/queries';
import { useRouter, useParams } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import WinnerModal from "@/components/game/WinnerModal";
import { GameEndedModal } from "@/components/game/GameEndedModal";
import { EndGameButton } from "@/components/game/EndGameButton";
import Button from "@/components/ui/Button";
import type { Question } from "@/database/types";

type Team = {
  id: string;
  name: string;
};

type QuestionCellProps = {
  cid: string;
  questionMatrix: { [key: string]: Question[] };
  rowIndex: number;
  pts: number;
  roundId: string;
  router: any;
  answeredQuestions: string[];
};

function renderQuestionCell({
  cid,
  questionMatrix,
  rowIndex,
  pts,
  roundId,
  router,
  answeredQuestions,
}: QuestionCellProps) {

  const qs = questionMatrix[cid] || [];
  const nth = rowIndex % 2;
  const qsPts = qs.filter((q: Question) => q.points === pts);
  const question = qsPts[nth];

  const isAnswered = !!answeredQuestions.find(item => item.split("-")[0] === cid && item.split("-")[1] === question?.id)
  if (!question) {
    return (<td key={cid} className="border border-gray-300 p-2 text-center text-gray-400">N/A</td>);
  }


  const handleClick = () => {
    if (isAnswered) return;
    router.push(`/account/round/${roundId}/game/${question.id}`);
  };

  return (
    <td
      key={cid}
      className={`border border-gray-300 p-2 text-center ${isAnswered ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}
      aria-disabled={isAnswered}
      tabIndex={isAnswered ? -1 : 0}
      onClick={handleClick}
    >
      {isAnswered ? 'Answered' : pts}
    </td>
  );
}

function GamePageInner(props: any) {
  const { scores, currentTurn, answeredQuestions } = useGame();


  const { roundData, questionMatrix, router, roundId, categoriesData } = props;
  const pointsRows = [100, 100, 300, 300, 500, 500];
  const [modalOpen, setModalOpen] = useState(false);
  const [winner, setWinner] = useState("");

  // Find the winner (team with highest score)
  function handleEndGame() {
    if (!scores || !roundData.teams.length) return;
    let maxScore = -Infinity;
    let winningTeam = "";
    for (const team of roundData.teams) {
      const score = scores[team.id] ?? 0;
      if (score > maxScore) {
        maxScore = score;
        winningTeam = team.name;
      }
    }
    setWinner(winningTeam);
    setModalOpen(true);
  }

  // Handle score changes
  const handleScoreChange = (teamId: string, action: 'increase' | 'decrease') => {
    // Empty for now - will be implemented later
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <GameEndedModal isOpen={roundData?.isEnded} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Game Round: {roundData.name}</h1>
        <Button
          variant="secondary"
          onClick={() => router.push(`/account`)}
        >
          Back to Dashboard
        </Button>
      </div>
      <h2 className="text-xl mb-4">Teams & Scores</h2>
      <div className="flex space-x-4 mb-8">
        {roundData.teams.map((team: Team) => (
          <div
            key={team.id}
            className={`border p-4 rounded w-40 text-center ${currentTurn === team.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-100'}`}
          >
            <h3 className="font-semibold">{team.name}</h3>
            <div className="flex items-center justify-center gap-2 py-1">
              <button
                onClick={() => handleScoreChange(team.id, 'decrease')}
                className="w-8 h-8 text-gray-600 hover:text-gray-800 rounded flex items-center justify-center hover:bg-gray-200"
                aria-label={`Decrease ${team.name}'s score`}
              >
                −
              </button>
              <p className={`text-2xl ${currentTurn === team.id ? 'text-blue-600 font-bold' : ''}`}>{scores?.[team.id] ?? 0}</p>
              <button
                onClick={() => handleScoreChange(team.id, 'increase')}
                className="w-8 h-8 text-gray-600 hover:text-gray-800 rounded flex items-center justify-center hover:bg-gray-200"
                aria-label={`Increase ${team.name}'s score`}
              >
                +
              </button>
            </div>
            {currentTurn === team.id && <span className="block text-xs text-blue-600">Current Turn</span>}
          </div>
        ))}
      </div>
      <EndGameButton announceWinner={handleEndGame} />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {/* <th className="border border-gray-300 p-2">Points</th> */}
            {roundData.categories.map((cid: string) => {
              const name = categoriesData.find((c: any) => c.id === cid)?.name || '';
              return (
                <th key={cid} className="border border-gray-300 p-2">
                  {name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {pointsRows.map((pts, rowIndex) => (
            <tr key={pts + '-' + rowIndex}>
              {/* <td className="border border-gray-300 p-2 font-semibold">{pts}</td> */}
              {roundData.categories.map((cid: string) => renderQuestionCell({
                answeredQuestions,
                cid,
                questionMatrix,
                rowIndex,
                pts,
                roundId,
                router,
              }))}
            </tr>
          ))}
        </tbody>
      </table>
      <WinnerModal
        open={modalOpen}
        winner={winner}
        onClose={() => setModalOpen(false)}
        onCreateRound={() => router.push("/account/create-round")}
        onExit={() => window.location.assign("/account")}
      />
    </div>
  );
}

// Main page component
export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const rawRoundId = params?.roundId;
  const roundId = Array.isArray(rawRoundId) ? rawRoundId[0] : rawRoundId;

  // Use the useRound hook to fetch round data from DynamoDB
  const { data: roundData } = useRound(roundId);
  const { data: categoriesData } = useCategories();
  const { data: allQuestions } = useQuestions();
  const [questionMatrix, setQuestionMatrix] = useState<{ [categoryId: string]: Question[] }>({});



  useEffect(() => {
    if (!roundData || !allQuestions.length) return;
    const newQuestionMatrix: { [categoryId: string]: Question[] } = {};
    for (const catId of roundData.categories) {
      const roundQuestions = allQuestions.filter((q) => q.categoryId === catId);
      if (roundQuestions.length > 0) {
        newQuestionMatrix[catId] = roundQuestions;
      }
    }
    setQuestionMatrix(newQuestionMatrix);
  }, [roundData, allQuestions, roundId]);

  return (
    <GamePageInner
      roundData={roundData}
      questionMatrix={questionMatrix}
      router={router}
      roundId={roundId}
      categoriesData={categoriesData}
    />
  );
}
