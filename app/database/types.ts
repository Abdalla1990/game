export interface Category {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  categoryId: string;
  title: string;
  points: number;
  'question-type': 'multiple-choice' | 'image' | 'voice' | 'range' | 'video';
  [key: string]: any; // For additional question type specific fields
}

export interface Round {
  id: string;
  name: string;
  userId: string;
  categories: string[];
  teams: { id: string; name: string }[];
  createdAt: string;
  currentTurnIdx: number;
  scores: { [teamId: string]: number };
  answeredQuestions: string[];
  isEnded: boolean;
  s3Location?: string;
};

export interface RoundDynamoDBItem {
  [key: string]: { S?: string; SS?: string[]; N?: string; BOOL?: boolean };
  id: { S: string };
  name: { S: string };
  userId: { S: string };
  categories: { SS: string[] };
  teams: { S: string };
  createdAt: { S: string };
  currentTurnIdx: { N: string };
  scores: { S: string };
  answeredQuestions: { S: string };
  isEnded: { BOOL: boolean };
  publicUrl?: { S: string };
}

export interface Team {
  id: string;
  name: string;
}

export interface GameState {
  currentTurnIdx: number;
  scores: { [teamId: string]: number };
  answeredQuestions: string[];
  isEnded: boolean;
  winner?: string;  // Winner team ID
}

export type RoundGameStateUpdate = Partial<GameState>;