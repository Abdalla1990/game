"use server"
// Basic DynamoDB round creation utility
// You must set AWS credentials in your environment for this to work
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { RoundGameStateUpdate, Round, GameState } from './types';

const local = {
  region: "us-east-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "dummy",
    secretAccessKey: "dummy",
  }
}
const stage = { region: process.env.AWS_REGION || 'us-east-1' }
const client = new DynamoDBClient(process.env.NODE_ENV === 'development' ? local : stage);

export async function createRound(round: Partial<Round>): Promise<{ success: boolean }> {
  // Initialize scores for all teams
  const initialScores: { [teamId: string]: number } = {};
  round.teams.forEach(team => {
    initialScores[team.id] = 0;
  });

  const params = {
    TableName: process.env.DYNAMODB_ROUNDS_TABLE || 'game_rounds',
    Item: {
      id: { S: round.id },
      name: { S: round.name },
      userId: { S: round.userId },
      categories: { SS: round.categories },
      teams: { S: JSON.stringify(round.teams) },
      createdAt: { S: round.createdAt },
      // Add initial game state
      currentTurnIdx: { N: "0" },
      scores: { S: JSON.stringify(initialScores) },
      answeredQuestions: { S: JSON.stringify([]) },
      isEnded: { BOOL: false },
    },
  };
  await client.send(new PutItemCommand(params));
  return { success: true };
}

export async function getRound(roundId: string): Promise<Round & GameState | null> {
  const params = {
    TableName: process.env.DYNAMODB_ROUNDS_TABLE || 'game_rounds',
    Key: {
      id: { S: roundId },
    },
  };

  const result = await client.send(new GetItemCommand(params));
  if (!result.Item) return null;
  // Convert DynamoDB item to JS object
  return {
    id: result.Item.id.S,
    name: result.Item.name.S,
    userId: result.Item.userId.S,
    categories: result.Item.categories.SS,
    teams: JSON.parse(result.Item.teams.S),
    createdAt: result.Item.createdAt.S,
    currentTurnIdx: Number(result.Item.currentTurnIdx?.N ?? 0),
    scores: JSON.parse(result.Item.scores?.S ?? '{}'),
    answeredQuestions: JSON.parse(result.Item.answeredQuestions?.S ?? '[]'),
    isEnded: result.Item.isEnded?.BOOL ?? false,
  };
}

export async function getRounds(userId: string): Promise<(Round & GameState)[]> {
  const params = {
    TableName: process.env.DYNAMODB_ROUNDS_TABLE || 'game_rounds',
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': { S: userId }
    }
  };

  const result = await client.send(new ScanCommand(params));
  if (!result.Items) return [];

  return result.Items.map(item => ({
    id: item.id.S,
    name: item.name.S,
    userId: item.userId.S,
    categories: item.categories.SS,
    teams: JSON.parse(item.teams.S),
    createdAt: item.createdAt.S,
    currentTurnIdx: Number(item.currentTurnIdx?.N ?? 0),
    scores: JSON.parse(item.scores?.S ?? '{}'),
    answeredQuestions: JSON.parse(item.answeredQuestions?.S ?? '[]'),
    isEnded: item.isEnded?.BOOL ?? false,
  }));
}

export async function updateRound(roundId: string, updates: RoundGameStateUpdate): Promise<{ success: boolean }> {
  const updateExpressions = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};
  console.log("UPDATE", { updates, roundId });
  if (updates.currentTurnIdx !== undefined) {
    updateExpressions.push('#CTI = :cti');
    expressionAttributeNames['#CTI'] = 'currentTurnIdx';
    expressionAttributeValues[':cti'] = { N: updates.currentTurnIdx.toString() };
  }

  if (updates.scores) {
    updateExpressions.push('#S = :s');
    expressionAttributeNames['#S'] = 'scores';
    expressionAttributeValues[':s'] = { S: JSON.stringify(updates.scores) };
  }

  if (updates.answeredQuestions) {
    updateExpressions.push('#AQ = :aq');
    expressionAttributeNames['#AQ'] = 'answeredQuestions';
    expressionAttributeValues[':aq'] = { S: JSON.stringify(updates.answeredQuestions) };
  }

  if (updates.isEnded !== undefined) {
    updateExpressions.push('#IE = :ie');
    expressionAttributeNames['#IE'] = 'isEnded';
    expressionAttributeValues[':ie'] = { BOOL: updates.isEnded };
  }

  if (updateExpressions.length === 0) return { success: false };

  const params = {
    TableName: process.env.DYNAMODB_ROUNDS_TABLE || 'game_rounds',
    Key: { id: { S: roundId } },
    UpdateExpression: 'SET ' + updateExpressions.join(', '),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  await client.send(new UpdateItemCommand(params));
  return { success: true };
}
