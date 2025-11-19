import { Surah } from "@/types/quran";
import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface SurahCardProps {
  surah: Surah;
  isDownloaded?: boolean;
  onDownload?: (surahNumber: number) => void;
}

export function SurahCard({ surah, isDownloaded, onDownload }: SurahCardProps) {
  return (
    <Link
      to={`/surah/${surah.surahNumber}`}
      className="block"
    >
      <div className="group bg-card border border-border rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center gap-4">
          {/* Surah Number Circle */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {surah.surahNumber}
              </span>
            </div>
          </div>

          {/* Surah Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-xl font-semibold arabic-text text-foreground">
                {surah.name}
              </h3>
              <span className="text-sm text-muted-foreground">
                {surah.englishName}
              </span>
            </div>
            <p className="text-sm bangla-text text-muted-foreground">
              {surah.name_bn}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {surah.revelation}
              </span>
              <span className="text-xs text-muted-foreground">
                {surah.ayahCount} আয়াত
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {isDownloaded ? (
              <div className="flex items-center gap-1 text-success text-sm">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">ডাউনলোড করা</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  onDownload?.(surah.surahNumber);
                }}
                className="hover:bg-primary/10 hover:text-primary"
                aria-label="Download surah"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
