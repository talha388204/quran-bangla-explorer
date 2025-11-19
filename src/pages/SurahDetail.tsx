import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Settings, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AyatCard } from "@/components/AyatCard";
import { TafsirModal } from "@/components/TafsirModal";
import { Surah, Ayah } from "@/types/quran";
import { fetchSurahDetail } from "@/lib/quran-api";
import { getSurah, saveSurah } from "@/lib/db";
import { toast } from "sonner";

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [showTafsir, setShowTafsir] = useState(false);
  const [showWordMeanings, setShowWordMeanings] = useState(true);

  useEffect(() => {
    loadSurah();
  }, [surahNumber]);

  const loadSurah = async () => {
    if (!surahNumber) return;

    try {
      setLoading(true);
      const number = parseInt(surahNumber);

      // Try to load from cache first
      let data = await getSurah(number);

      // If not in cache, fetch from API
      if (!data) {
        data = await fetchSurahDetail(number);
        if (data) {
          // Optionally cache it
          await saveSurah(data);
        }
      }

      setSurah(data);
    } catch (error) {
      console.error("Error loading surah:", error);
      toast.error("সূরা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!surah) return;
    
    try {
      await saveSurah(surah);
      toast.success("সূরা অফলাইন ডাউনলোড করা হয়েছে");
    } catch (error) {
      console.error("Error downloading surah:", error);
      toast.error("ডাউনলোড করতে সমস্যা হয়েছে");
    }
  };

  const handleOpenTafsir = (ayah: Ayah) => {
    setSelectedAyah(ayah);
    setShowTafsir(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground bangla-text">
            সূরা লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 bangla-text">সূরা পাওয়া যায়নি</h2>
          <Button asChild>
            <Link to="/">হোম পেজে ফিরে যান</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/" aria-label="Back to home">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold arabic-text">{surah.name}</h1>
                <p className="text-sm text-muted-foreground bangla-text">
                  {surah.name_bn} • {surah.ayahCount} আয়াত
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                aria-label="Download for offline"
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowWordMeanings(!showWordMeanings)}
                aria-label="Toggle word meanings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Surah Info Card */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-6 text-center">
          <h2 className="text-3xl arabic-text font-bold mb-2">{surah.name}</h2>
          <p className="text-lg bangla-text font-semibold mb-2">
            {surah.name_bn}
          </p>
          <p className="text-sm text-muted-foreground">
            {surah.englishName} • {surah.revelation} • {surah.ayahCount} আয়াত
          </p>
        </div>

        {/* Ayahs */}
        <div className="space-y-6">
          {surah.ayahs?.map((ayah) => (
            <AyatCard
              key={ayah.ayahNumber}
              ayah={ayah}
              surahNumber={surah.surahNumber}
              onOpenTafsir={() => handleOpenTafsir(ayah)}
              showWordMeanings={showWordMeanings}
            />
          ))}
        </div>

        {/* Attribution */}
        {surah.meta && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground bangla-text">
            <p>
              <strong>সূত্র:</strong> {surah.meta.source_ar} |{" "}
              {surah.meta.source_translation}
            </p>
            <p className="text-xs mt-1">{surah.meta.license}</p>
          </div>
        )}
      </div>

      {/* Tafsir Modal */}
      <TafsirModal
        open={showTafsir}
        onOpenChange={setShowTafsir}
        ayah={selectedAyah}
        surahNumber={surah.surahNumber}
        surahName={surah.name_bn}
      />
    </div>
  );
};

export default SurahDetail;
