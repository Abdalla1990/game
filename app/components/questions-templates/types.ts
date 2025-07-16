export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  Image = 'image',
  Voice = 'voice',
  Range = 'range',
  Video = 'video',
}

export interface BaseQuestionData {
  id: string;
  categoryId: string;
  points: number;
  title: string;
  'question-type': QuestionType;
  'image-hint'?: string;
  'image-instructions'?: string;
}

export interface MultipleChoiceData extends BaseQuestionData {
  'question-type': QuestionType.MultipleChoice;
  choices: string[];
  'correct-answer-index': number;
}

export interface ImageQuestionData extends BaseQuestionData {
  'question-type': QuestionType.Image;
  'image-hint': string;  // Original image URL or placeholder
  'image-type'?: 'svg' | 'base64';  // Type of processed image
  'image-data'?: string;  // SVG markup or base64 data
  'original-image-hint'?: string;  // Keep track of original hint
  'correct-answer': string;  // The correct answer text
  choices?: string[];  // Optional multiple choice answers
  'correct-answer-index'?: number;  // Required only if choices are provided
}

export interface VoiceQuestionData extends BaseQuestionData {
  'question-type': QuestionType.Voice;
  'audio-type'?: 'base64';  // Type of processed image
  'audio-data'?: string;  // SVG markup or base64 data
  'correct-answer': string;  // The correct answer text
  transcript?: string;  // Optional transcript for accessibility
}

export interface RangeQuestionData extends BaseQuestionData {
  'question-type': QuestionType.Range;
  range: number;  // The range to display in the hint
  'min-value': number;
  'max-value': number;
  'correct-answer': number;
  unit?: string;  // Optional unit for display (e.g., "years", "dollars")
}

export interface VideoQuestionData extends BaseQuestionData {
  'question-type': QuestionType.Video;
  choices: string[];
  'correct-answer-index': number;
  'video-url'?: string;
}

export type QuestionData = MultipleChoiceData | ImageQuestionData | VoiceQuestionData | RangeQuestionData | VideoQuestionData;

export interface BaseQuestionTemplateProps<T extends QuestionData = QuestionData> {
  question: T;
  onAnswer: (isCorrect: boolean) => void;
}

export interface QuestionBaseProps {
  selectedChoice?: number | null;
  setSelectedChoice?: (choice: number | null) => void;
  userAnswer?: string | null;
  setUserAnswer?: (value: string | null) => void;
  onAnswer: (isCorrect: boolean) => void;
}

export interface MultipleChoiceQuestionProps extends QuestionBaseProps {
  question: MultipleChoiceData;
  selectedChoice: number | null;
  setSelectedChoice: (choice: number | null) => void;
}

export interface ImageQuestionProps extends QuestionBaseProps {
  question: ImageQuestionData;
  userAnswer: string | null;
  setUserAnswer: (value: string | null) => void;
}

export interface VoiceQuestionProps extends QuestionBaseProps {
  question: VoiceQuestionData;
  userAnswer: string | null;
  setUserAnswer: (value: string | null) => void;
}

export interface RangeQuestionProps extends QuestionBaseProps {
  question: RangeQuestionData;
  userAnswer: string | null;
  setUserAnswer: (value: string | null) => void;
}

export interface VideoQuestionProps extends QuestionBaseProps {
  question: VideoQuestionData;
  selectedChoice: number | null;
  setSelectedChoice: (choice: number | null) => void;
}
