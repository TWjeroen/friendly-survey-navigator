import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InfoBoxProps {
  content: string;
}

export const InfoBox = ({ content }: InfoBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="info-box">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>Additional Information</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="mt-2 text-sm animate-fade-in">
          {content}
        </div>
      )}
    </div>
  );
};