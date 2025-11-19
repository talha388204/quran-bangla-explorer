import { useEffect, useState } from "react";
import { Search, Settings, Info, BookMarked } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SurahCard } from "@/components/SurahCard";
import { Surah } from "@/types/quran";
import { fetchSurahList } from "@/lib/quran-api";
import { initDB, getAllSurahs, saveSurah } from "@/lib/db";
import { toast } from "sonner";

const Index = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadedSurahs, setDownloadedSurahs] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    loadSurahs();
    loadDownloadedSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      const data = await fetchSurahList();
      setSurahs(data);
    } catch (error) {
      console.error("Error loading surahs:", error);
      toast.error("সূরা তালিকা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadedSurahs = async () => {
    try {
      await initDB();
      const cached = await getAllSurahs();
      setDownloadedSurahs(new Set(cached.map((s) => s.surahNumber)));
    } catch (error) {
      console.error("Error loading downloaded surahs:", error);
    }
  };

  const handleDownload = async (surahNumber: number) => {
    toast.info("ডাউনলোড ফিচার শীঘ্রই আসছে");
    // Download implementation would go here
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.name_bn.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                কুরআন শব্দে শব্দে
              </h1>
              <p className="text-sm text-muted-foreground bangla-text">
                Word by Word Quran in Bangla
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/bookmarks" aria-label="Bookmarks">
                  <BookMarked className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings" aria-label="Settings">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/about" aria-label="About">
                  <Info className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="সূরা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bangla-text"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm bangla-text text-foreground">
            📖 <strong>স্বাগতম!</strong> প্রতিটি সূরা খুলুন এবং প্রতিটি আরবি শব্দের
            বাংলা অর্থ দেখুন। অফলাইন পড়ার জন্য সূরা ডাউনলোড করুন।
          </p>
        </div>

        {/* Surah List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground bangla-text">
              সূরা তালিকা লোড হচ্ছে...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSurahs.length > 0 ? (
              filteredSurahs.map((surah) => (
                <SurahCard
                  key={surah.surahNumber}
                  surah={surah}
                  isDownloaded={downloadedSurahs.has(surah.surahNumber)}
                  onDownload={handleDownload}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground bangla-text">
                  কোন সূরা পাওয়া যায়নি
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Attribution Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground bangla-text">
          <p>
            আরবি পাঠ: Al-Quran Cloud API | বাংলা অনুবাদ ও তাফসির: লাইসেন্সকৃত
            উৎস প্রয়োজন
          </p>
          <p className="text-xs mt-2">
            ⚠️ ডেভেলপমেন্ট সংস্করণ - সঠিক লাইসেন্সকৃত বাংলা অনুবাদ এবং তাফসির
            ইন্টিগ্রেশন প্রয়োজন
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
