import { useState, useEffect } from 'react';
import { Question as QuestionComponent } from '../components/Question';
import { ThemeNavigation } from '../components/ThemeNavigation';
import { Theme, Question, SurveyResponse } from '../types/survey';
import { ArrowRight } from 'lucide-react';

// Sample data - in a real app this would come from an API
const themes: Theme[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic information about yourself',
    isCompleted: true,
  },
  {
    id: 'professional',
    title: 'Professional Experience',
    description: 'Your work history and skills',
    isCompleted: false,
  },
];

const questions: Question[] = [
  {
    id: 'q1',
    themeId: 'personal',
    type: 'multiple-choice',
    text: 'Are you currently employed?',
    options: ['Yes', 'No'],
    info: 'This helps us understand your current employment status.',
    conditionalQuestions: [
      {
        id: 'q1a',
        themeId: 'personal',
        type: 'open-ended',
        text: 'What is your current job title?',
        dependsOn: {
          questionId: 'q1',
          answer: 'Yes',
        },
      },
    ],
  },
  {
    id: 'q2',
    themeId: 'personal',
    type: 'open-ended',
    text: 'What are your career goals?',
    info: 'Tell us about your professional aspirations and where you see yourself in the future.',
  },
];

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState(themes[0].id);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);

  useEffect(() => {
    updateVisibleQuestions();
  }, [responses]);

  const updateVisibleQuestions = () => {
    const baseQuestions = questions.filter((q) => q.themeId === currentTheme);
    const allQuestions = [...baseQuestions];

    baseQuestions.forEach((question) => {
      if (question.conditionalQuestions) {
        const response = responses.find((r) => r.questionId === question.id);
        question.conditionalQuestions.forEach((conditionalQ) => {
          if (response?.answer === conditionalQ.dependsOn?.answer) {
            allQuestions.push(conditionalQ);
          }
        });
      }
    });

    setVisibleQuestions(allQuestions);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setResponses((prev) => {
      const newResponses = prev.filter((r) => r.questionId !== questionId);
      return [...newResponses, { questionId, answer }];
    });
  };

  const getCurrentAnswer = (questionId: string) => {
    return responses.find((r) => r.questionId === questionId)?.answer;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                {themes.find((t) => t.id === currentTheme)?.title}
              </h1>
              <p className="text-muted-foreground">
                {themes.find((t) => t.id === currentTheme)?.description}
              </p>
            </div>

            <div className="space-y-8">
              {visibleQuestions.map((question) => (
                <QuestionComponent
                  key={question.id}
                  question={question}
                  onAnswer={handleAnswer}
                  currentAnswer={getCurrentAnswer(question.id)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                onClick={() => console.log('Next theme')}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <ThemeNavigation
            themes={themes}
            currentTheme={currentTheme}
            onThemeSelect={setCurrentTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;