export const getQuestions = async ({ userId, categoryIds, roundId }: { userId: string; categoryIds: string[], roundId: string }) => {
  const response = await fetch('http://localhost:5000/api/questions/merge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, categoryIds, roundId }),
  });
  return response.json();
};

