"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useRecentGames } from "../context/queries";
import Button from "../components/ui/Button";
import { RoundCard } from "@/components/rounds/RoundCard";

interface GameStatsProps {
  userName: string;
  userId: string;
}

function GameStats({ userName, userId }: Readonly<GameStatsProps>) {
  const { data: recentGames, isLoading } = useRecentGames(userId);

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {userName || "Player"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Games
          </h3>
          <p className="text-3xl font-bold text-blue-600">{recentGames?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-600">Games Won</h3>
          <p className="text-3xl font-bold text-green-600">{recentGames?.filter(game => game.winner !== undefined).length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-600">Win Rate</h3>
          <p className="text-3xl font-bold text-purple-600">
            {recentGames?.length
              ? Math.round((recentGames.filter(game => game.winner !== undefined).length / recentGames.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Games</h2>
        {isLoading ? (
          <div className="text-center py-8">Loading recent games...</div>
        ) : !recentGames?.length ? (
          <div className="text-center py-8 text-gray-600">
            No games played yet. Start a new game to see your history!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGames.map((game) => (
              <RoundCard key={game.id} round={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <GameStats userName={user.name} userId={user.id} />
      <div className="mt-8 flex justify-end">
        <Button onClick={() => router.push('/account/create-round')}>
          Create New Round
        </Button>
      </div>
    </div>
  );
}
