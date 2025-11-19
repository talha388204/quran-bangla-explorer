import { Word } from "@/types/quran";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WordChipProps {
  word: Word;
}

export function WordChip({ word }: WordChipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            className="inline-flex flex-col items-center gap-1 px-3 py-2 rounded-md border border-border bg-card hover:bg-primary/5 hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <span className="text-lg arabic-text font-medium text-foreground">
              {word.text_ar}
            </span>
            <span className="text-bangla-sm bangla-text text-muted-foreground">
              {word.word_meaning_bn}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="text-base arabic-text font-medium">{word.text_ar}</p>
            {word.transliteration && (
              <p className="text-sm text-muted-foreground italic">
                {word.transliteration}
              </p>
            )}
            <p className="text-sm bangla-text">{word.word_meaning_bn}</p>
            {word.morph && (
              <p className="text-xs text-muted-foreground">{word.morph}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
