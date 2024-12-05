export interface Theme {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface Question {
  id: string;
  themeId: string;
  type: 'multiple-choice' | 'open-ended';
  text: string;
  info?: string;
  options?: string[];
  conditionalQuestions?: Question[];
  dependsOn?: {
    questionId: string;
    answer: string;
  };
}

export interface SurveyResponse {
  questionId: string;
  answer: string;
}