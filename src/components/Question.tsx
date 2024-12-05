import { useState } from 'react';
import { Question as QuestionType } from '../types/survey';
import { InfoBox } from './InfoBox';
import { cn } from '@/lib/utils';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (questionId: string, answer: string) => void;
  currentAnswer?: string;
}

export const Question = ({ question, onAnswer, currentAnswer }: QuestionProps) => {
  const handleChange = (value: string) => {
    onAnswer(question.id, value);
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="mb-2">
        <h3 className="text-lg font-medium mb-2">{question.text}</h3>
        {question.info && <InfoBox content={question.info} />}
      </div>

      {question.type === 'multiple-choice' ? (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label
              key={option}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
                currentAnswer === option
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={currentAnswer === option}
                onChange={(e) => handleChange(e.target.value)}
                className="h-4 w-4 text-primary"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={currentAnswer || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full min-h-[120px] p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
          placeholder="Type your answer here..."
        />
      )}
    </div>
  );
};