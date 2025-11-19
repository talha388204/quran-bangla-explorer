// IndexedDB wrapper for offline storage
import { Surah, Bookmark, Settings } from "@/types/quran";

const DB_NAME = "QuranWordByWord";
const DB_VERSION = 1;

const STORES = {
  SURAHS: "surahs",
  BOOKMARKS: "bookmarks",
  SETTINGS: "settings",
};

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Surahs store
      if (!database.objectStoreNames.contains(STORES.SURAHS)) {
        const surahStore = database.createObjectStore(STORES.SURAHS, {
          keyPath: "surahNumber",
        });
        surahStore.createIndex("name", "name", { unique: false });
      }

      // Bookmarks store
      if (!database.objectStoreNames.contains(STORES.BOOKMARKS)) {
        const bookmarkStore = database.createObjectStore(STORES.BOOKMARKS, {
          keyPath: "id",
        });
        bookmarkStore.createIndex("surahNumber", "surahNumber", {
          unique: false,
        });
      }

      // Settings store
      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        database.createObjectStore(STORES.SETTINGS, { keyPath: "key" });
      }
    };
  });
}

// Surah operations
export async function saveSurah(surah: Surah): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SURAHS], "readwrite");
    const store = transaction.objectStore(STORES.SURAHS);
    const request = store.put(surah);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getSurah(surahNumber: number): Promise<Surah | null> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SURAHS], "readonly");
    const store = transaction.objectStore(STORES.SURAHS);
    const request = store.get(surahNumber);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSurahs(): Promise<Surah[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SURAHS], "readonly");
    const store = transaction.objectStore(STORES.SURAHS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSurah(surahNumber: number): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SURAHS], "readwrite");
    const store = transaction.objectStore(STORES.SURAHS);
    const request = store.delete(surahNumber);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Bookmark operations
export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.BOOKMARKS], "readwrite");
    const store = transaction.objectStore(STORES.BOOKMARKS);
    const request = store.put(bookmark);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.BOOKMARKS], "readonly");
    const store = transaction.objectStore(STORES.BOOKMARKS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBookmark(id: string): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.BOOKMARKS], "readwrite");
    const store = transaction.objectStore(STORES.BOOKMARKS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Settings operations
export async function saveSettings(settings: Settings): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SETTINGS], "readwrite");
    const store = transaction.objectStore(STORES.SETTINGS);
    const request = store.put({ key: "app", ...settings });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getSettings(): Promise<Settings> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.SETTINGS], "readonly");
    const store = transaction.objectStore(STORES.SETTINGS);
    const request = store.get("app");

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const { key, ...settings } = result;
        resolve(settings as Settings);
      } else {
        // Default settings
        resolve({
          fontSize: 16,
          showTransliteration: false,
          showWordMeanings: true,
        });
      }
    };
    request.onerror = () => reject(request.error);
  });
}
