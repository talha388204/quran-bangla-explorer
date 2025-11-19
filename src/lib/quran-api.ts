import { Surah, Ayah } from "@/types/quran";

// Using Al-Quran Cloud API as primary source
// This is a placeholder implementation - in production, you'd use proper licensed sources
const API_BASE = "https://api.alquran.cloud/v1";

export async function fetchSurahList(): Promise<Surah[]> {
  try {
    const response = await fetch(`${API_BASE}/surah`);
    const data = await response.json();
    
    if (data.code === 200) {
      return data.data.map((surah: any) => ({
        surahNumber: surah.number,
        name: surah.name,
        name_bn: surah.englishName, // Would need proper Bangla names
        englishName: surah.englishName,
        ayahCount: surah.numberOfAyahs,
        revelation: surah.revelationType === 'Meccan' ? 'Makki' : 'Madani',
      }));
    }
    
    // Fallback to cached data
    return getCachedSurahList();
  } catch (error) {
    console.error("Error fetching surah list:", error);
    return getCachedSurahList();
  }
}

export async function fetchSurahDetail(surahNumber: number): Promise<Surah | null> {
  try {
    // Fetch Arabic text
    const arabicResponse = await fetch(`${API_BASE}/surah/${surahNumber}`);
    const arabicData = await arabicResponse.json();
    
    if (arabicData.code !== 200) {
      return null;
    }
    
    const surah = arabicData.data;
    
    // Convert to our format
    const ayahs: Ayah[] = surah.ayahs.map((ayah: any) => ({
      ayahNumber: ayah.numberInSurah,
      text_ar: ayah.text,
      words: parseWordsFromText(ayah.text),
      translation_bn: "অনুবাদ লোড হচ্ছে...", // Would fetch from proper source
      tafsir_short_bn: "সংক্ষিপ্ত তাফসির...",
      tafsir_full_bn: "বিস্তারিত তাফসির লোড হবে...",
      audio_url: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
    }));
    
    return {
      surahNumber: surah.number,
      name: surah.name,
      name_bn: surah.englishName,
      englishName: surah.englishName,
      ayahCount: surah.numberOfAyahs,
      revelation: surah.revelationType === 'Meccan' ? 'Makki' : 'Madani',
      ayahs,
      meta: {
        source_ar: "Al-Quran Cloud API",
        source_translation: "Awaiting proper Bangla translation source",
        license: "Public Domain (placeholder)",
      },
    };
  } catch (error) {
    console.error("Error fetching surah detail:", error);
    return null;
  }
}

// Helper to parse words from Arabic text
// In production, this would use proper word segmentation API
function parseWordsFromText(text: string): any[] {
  const words = text.split(' ');
  return words.map((word, index) => ({
    index: index + 1,
    text_ar: word,
    transliteration: "", // Would need proper transliteration
    word_meaning_bn: "অর্থ", // Placeholder
    morph: "",
  }));
}

// Fallback cached data for offline
function getCachedSurahList(): Surah[] {
  return [
    { surahNumber: 1, name: "الفاتحة", name_bn: "ফাতিহা", englishName: "Al-Fatihah", ayahCount: 7, revelation: 'Makki' },
    { surahNumber: 2, name: "البقرة", name_bn: "বাকারা", englishName: "Al-Baqarah", ayahCount: 286, revelation: 'Madani' },
    { surahNumber: 36, name: "يس", name_bn: "ইয়াসিন", englishName: "Ya-Sin", ayahCount: 83, revelation: 'Makki' },
    // Add more surahs as needed
  ];
}

export const ATTRIBUTION = {
  arabic: "Arabic text provided by Al-Quran Cloud API",
  translation: "Bangla translation requires licensed source - pending integration",
  tafsir: "Tafsir requires licensed Bangla source - pending integration",
  note: "⚠️ This is a development version. Production requires proper licensed Bangla translations and tafsir sources.",
};
