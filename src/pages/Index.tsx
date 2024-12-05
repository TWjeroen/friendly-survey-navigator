import { useState, useEffect } from 'react';
import { Question as QuestionComponent } from '../components/Question';
import { ThemeNavigation } from '../components/ThemeNavigation';
import { Theme, Question, SurveyResponse } from '../types/survey';
import { ArrowRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { saveSurveyProgress } from '../services/surveyApi';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const validateResponses = () => {
    const unansweredQuestions = visibleQuestions.filter(
      (question) => !responses.find((r) => r.questionId === question.id)
    );

    if (unansweredQuestions.length > 0) {
      toast({
        title: "Please answer all questions",
        description: "Some questions are still unanswered.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateResponses()) return;

    setIsSubmitting(true);
    console.log('Saving progress for theme:', currentTheme);

    try {
      await saveSurveyProgress(responses);
      toast({
        title: "Progress saved",
        description: "Your answers have been saved successfully.",
      });

      // Find next theme
      const currentThemeIndex = themes.findIndex((t) => t.id === currentTheme);
      if (currentThemeIndex < themes.length - 1) {
        const nextTheme = themes[currentThemeIndex + 1];
        nextTheme.isCompleted = true;
        setCurrentTheme(nextTheme.id);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  required={true}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Next'}
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
