import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContextualTooltipProps {
  title: string;
  content: string;
  examples?: string[];
  className?: string;
}

export function ContextualTooltip({ title, content, examples, className }: ContextualTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button 
            type="button"
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors ${className}`}
            data-testid="tooltip-trigger"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-white shadow-xl border-blue-200" side="right">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
            {examples && examples.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1">Exemplos:</p>
                <ul className="space-y-1">
                  {examples.map((example, index) => (
                    <li key={index} className="text-xs text-gray-600 italic flex items-start gap-1.5">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>"{example}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
