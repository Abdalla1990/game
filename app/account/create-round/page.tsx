"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { createRound } from "@/database/rounds";
import { useCategories } from "@/context/queries";

interface Team {
  id: string;
  name: string;
}

export default function CreateRoundPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [roundName, setRoundName] = useState("");
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "" },
    { id: "2", name: "" },
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: categories = [] } = useCategories();

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((catId) => catId !== id);
      }
      if (prev.length >= 8) return prev;
      return [...prev, id];
    });
  }, []);

  const updateTeamName = useCallback(
    (id: string, name: string) => {
      setTeams((prev) =>
        prev.map((team) => (team.id === id ? { ...team, name } : team))
      );
    },
    []
  );

  const addTeam = useCallback(() => {
    if (teams.length >= 10) return;
    const newId = String(teams.length + 1);
    setTeams((prev) => [...prev, { id: newId, name: "" }]);
  }, [teams.length]);

  const removeTeam = useCallback(
    (id: string) => {
      setTeams((prev) => prev.filter((team) => team.id !== id));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    setIsLoading(true);
    const roundId = crypto.randomUUID();
    const roundData = {
      id: roundId,
      name: roundName,
      userId: user.id,
      categories: selectedCategories,
      teams,
      createdAt: new Date().toISOString(),
    };
    try {
      await createRound(roundData);
      setIsLoading(false);
      router.push(`/account/round/${roundId}`);
    } catch (err) {
      console.error("Failed to create round in DynamoDB:", err);
      // we shouldnt let the user continue. 
    }

  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Please login to create a game
        </h2>
        <div className="space-x-4">
          <a
            href="/auth"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </a>
          <a
            href="/auth?mode=signup"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Sign Up
          </a>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Create New Game Round</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Round Name */}
          <section>
            <FormInput
              label="Round Name"
              id="roundName"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="Enter round name"
              required
            />
          </section>

          {/* Teams */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Teams</h3>
            <div className="space-y-3">
              {teams.map((team, idx) => (
                <div key={team.id} className="flex items-center gap-2">
                  <FormInput
                    label={`Team ${idx + 1}`}
                    id={`team-${team.id}`}
                    value={team.name}
                    onChange={(e) => updateTeamName(team.id, e.target.value)}
                    placeholder={`Team ${idx + 1} Name`}
                    required
                    className="flex-grow"
                  />
                  {teams.length > 2 && (
                    <Button
                      variant="danger"
                      onClick={() => removeTeam(team.id)}
                      className="mt-6"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {teams.length < 10 && (
              <Button
                type="button"
                variant="secondary"
                onClick={addTeam}
                className="mt-4"
              >
                Add Team
              </Button>
            )}
          </section>

          {/* Categories */}
          <section>
            <h3 className="text-lg font-semibold mb-4">
              Categories (select up to 8)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`p-3 border rounded transition-colors w-full text-left ${selectedCategories.includes(cat.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                    }`}
                  onClick={() => {
                    if (
                      selectedCategories.length < 8 ||
                      selectedCategories.includes(cat.id)
                    ) {
                      toggleCategory(cat.id);
                    }
                  }}
                  disabled={
                    !selectedCategories.includes(cat.id) &&
                    selectedCategories.length >= 8
                  }
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => { }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      disabled={
                        !selectedCategories.includes(cat.id) &&
                        selectedCategories.length >= 8
                      }
                    />
                    <span>{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Create Round
          </Button>
        </form>
      </div>
    </div>
  );
}
