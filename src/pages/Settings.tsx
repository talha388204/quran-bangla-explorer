import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Settings as SettingsType } from "@/types/quran";
import { getSettings, saveSettings } from "@/lib/db";
import { toast } from "sonner";

const Settings = () => {
  const [settings, setSettings] = useState<SettingsType>({
    fontSize: 16,
    showTransliteration: false,
    showWordMeanings: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await getSettings();
      setSettings(saved);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSaveSettings = async (newSettings: SettingsType) => {
    try {
      await saveSettings(newSettings);
      setSettings(newSettings);
      toast.success("সেটিংস সংরক্ষিত হয়েছে");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/" aria-label="Back to home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold bangla-text">সেটিংস</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Display Settings */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 bangla-text">
              প্রদর্শন সেটিংস
            </h2>
            
            <div className="space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontSize" className="bangla-text">
                    ফন্ট সাইজ
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {settings.fontSize}px
                  </span>
                </div>
                <Slider
                  id="fontSize"
                  min={12}
                  max={32}
                  step={1}
                  value={[settings.fontSize]}
                  onValueChange={([value]) =>
                    handleSaveSettings({ ...settings, fontSize: value })
                  }
                  className="w-full"
                />
              </div>

              {/* Show Word Meanings */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="wordMeanings" className="bangla-text">
                    শব্দ অর্থ দেখান
                  </Label>
                  <p className="text-sm text-muted-foreground bangla-text">
                    প্রতিটি শব্দের নিচে বাংলা অর্থ দেখান
                  </p>
                </div>
                <Switch
                  id="wordMeanings"
                  checked={settings.showWordMeanings}
                  onCheckedChange={(checked) =>
                    handleSaveSettings({ ...settings, showWordMeanings: checked })
                  }
                />
              </div>

              {/* Show Transliteration */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="transliteration" className="bangla-text">
                    উচ্চারণ দেখান
                  </Label>
                  <p className="text-sm text-muted-foreground bangla-text">
                    আরবি শব্দের রোমান উচ্চারণ দেখান
                  </p>
                </div>
                <Switch
                  id="transliteration"
                  checked={settings.showTransliteration}
                  onCheckedChange={(checked) =>
                    handleSaveSettings({
                      ...settings,
                      showTransliteration: checked,
                    })
                  }
                />
              </div>
            </div>
          </section>

          {/* Storage Settings */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 bangla-text">
              স্টোরেজ ম্যানেজমেন্ট
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium bangla-text">ডাউনলোড করা সূরা</p>
                  <p className="text-sm text-muted-foreground bangla-text">
                    অফলাইন পড়ার জন্য সংরক্ষিত
                  </p>
                </div>
                <Button variant="outline" size="sm" className="bangla-text">
                  পরিচালনা করুন
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium bangla-text">ক্যাশ সাফ করুন</p>
                  <p className="text-sm text-muted-foreground bangla-text">
                    সব অস্থায়ী ডেটা মুছে ফেলুন
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bangla-text text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => {
                    toast.info("ক্যাশ সাফ ফিচার শীঘ্রই আসছে");
                  }}
                >
                  সাফ করুন
                </Button>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 bangla-text">
              অ্যাপ সম্পর্কে
            </h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>1.0.0 (Development)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build</span>
                <span>PWA</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 bangla-text" asChild>
              <Link to="/about">বিস্তারিত দেখুন</Link>
            </Button>
          </section>

          {/* Privacy Notice */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm bangla-text text-foreground">
              🔒 আপনার সব ডেটা আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত থাকে। কোন
              ব্যক্তিগত তথ্য সংগ্রহ করা হয় না।
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
