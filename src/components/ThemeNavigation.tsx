import { Theme } from '../types/survey';
import { cn } from '@/lib/utils';

interface ThemeNavigationProps {
  themes: Theme[];
  currentTheme: string;
  onThemeSelect: (themeId: string) => void;
}

export const ThemeNavigation = ({
  themes,
  currentTheme,
  onThemeSelect,
}: ThemeNavigationProps) => {
  return (
    <div className="w-64 bg-card rounded-lg border border-border p-4">
      <h2 className="text-lg font-medium mb-4">Themes</h2>
      <div className="space-y-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => theme.isCompleted && onThemeSelect(theme.id)}
            className={cn(
              "w-full text-left p-2 rounded-md text-sm transition-all duration-200",
              currentTheme === theme.id && "bg-primary text-primary-foreground",
              theme.isCompleted && currentTheme !== theme.id && "hover:bg-secondary",
              !theme.isCompleted && "opacity-50 cursor-not-allowed"
            )}
          >
            {theme.title}
          </button>
        ))}
      </div>
    </div>
  );
};