import { SabbathSchoolLesson, SBLCacheMeta } from '../types/sabbathSchool';

const SBL_INDEX_KEY = 'maga_maga_sbl_cached_index_v1';
const SBL_CACHE_PREFIX = 'maga_maga_sbl_cache_';
const SBL_NOTES_PREFIX = 'maga_maga_sbl_notes_';

// Get list of all lessons cached offline
export function getCachedLessonsIndex(): SBLCacheMeta[] {
  try {
    const raw = localStorage.getItem(SBL_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse SBL cache index:', e);
    return [];
  }
}

// Generate unique key for a lesson
export function getLessonCacheKey(year: number, quarter: number, lesson: number, lang = 'en'): string {
  return `${SBL_CACHE_PREFIX}${lang}_${year}_${quarter}_${lesson}`;
}

// Retrieve single cached lesson from local storage
export function getCachedLesson(year: number, quarter: number, lesson: number, lang = 'en'): SabbathSchoolLesson | null {
  try {
    const key = getLessonCacheKey(year, quarter, lesson, lang);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data: SabbathSchoolLesson = JSON.parse(raw);
    data.isOfflineCached = true;
    return data;
  } catch (e) {
    console.error('Failed to get cached lesson:', e);
    return null;
  }
}

// Save lesson to offline cache
export function saveLessonToCache(lesson: SabbathSchoolLesson): void {
  try {
    const key = getLessonCacheKey(lesson.year, lesson.quarter, lesson.lesson, lesson.lang);
    const serialized = JSON.stringify(lesson);
    localStorage.setItem(key, serialized);

    // Update index
    const index = getCachedLessonsIndex().filter(item => item.key !== key);
    index.push({
      key,
      year: lesson.year,
      quarter: lesson.quarter,
      lesson: lesson.lesson,
      title: lesson.title,
      date: lesson.date,
      cachedAt: new Date().toISOString(),
      sizeBytes: serialized.length
    });
    localStorage.setItem(SBL_INDEX_KEY, JSON.stringify(index));
  } catch (e) {
    console.error('Failed to save lesson to cache:', e);
  }
}

// Delete lesson from cache
export function deleteCachedLesson(year: number, quarter: number, lesson: number, lang = 'en'): void {
  try {
    const key = getLessonCacheKey(year, quarter, lesson, lang);
    localStorage.removeItem(key);

    const index = getCachedLessonsIndex().filter(item => item.key !== key);
    localStorage.setItem(SBL_INDEX_KEY, JSON.stringify(index));
  } catch (e) {
    console.error('Failed to delete cached lesson:', e);
  }
}

// Fetch lesson with offline-first strategy
export async function fetchLessonWithOfflineFallback(
  year: number,
  quarter: number,
  lesson: number,
  lang = 'en'
): Promise<{ lesson: SabbathSchoolLesson; fromOffline: boolean }> {
  // 1. Check local offline cache first
  const cached = getCachedLesson(year, quarter, lesson, lang);

  // If online, attempt to fetch from server proxy
  if (navigator.onLine) {
    try {
      const res = await fetch(`/api/sbl?year=${year}&quarter=${quarter}&lesson=${lesson}&lang=${lang}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.lesson) {
          // Save fresh copy to offline cache
          saveLessonToCache(json.lesson);
          return { lesson: json.lesson, fromOffline: false };
        }
      }
    } catch (err) {
      console.warn('Network fetch failed, using offline cache if available:', err);
    }
  }

  // If we have cached version, return it
  if (cached) {
    return { lesson: cached, fromOffline: true };
  }

  // If not in cache and network failed, throw error or return fallback
  throw new Error('Lesson is not cached offline and network connection is unavailable.');
}

// Bulk cache entire quarter (lessons 1 to 13)
export async function cacheEntireQuarter(
  year: number,
  quarter: number,
  lang = 'en',
  onProgress?: (current: number, total: number, title: string) => void
): Promise<number> {
  let count = 0;
  const total = 13;

  for (let l = 1; l <= total; l++) {
    try {
      const res = await fetch(`/api/sbl?year=${year}&quarter=${quarter}&lesson=${l}&lang=${lang}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.lesson) {
          saveLessonToCache(json.lesson);
          count++;
          if (onProgress) {
            onProgress(l, total, json.lesson.title || `Lesson ${l}`);
          }
        }
      }
    } catch (e) {
      console.error(`Error caching lesson ${l}:`, e);
    }
  }

  return count;
}

// User Personal Study Notes per question
export function getUserStudyNote(
  year: number,
  quarter: number,
  lesson: number,
  dayId: number,
  qLabel: string
): string {
  try {
    const key = `${SBL_NOTES_PREFIX}${year}_${quarter}_${lesson}_d${dayId}_q${qLabel}`;
    return localStorage.getItem(key) || '';
  } catch (_) {
    return '';
  }
}

export function saveUserStudyNote(
  year: number,
  quarter: number,
  lesson: number,
  dayId: number,
  qLabel: string,
  text: string
): void {
  try {
    const key = `${SBL_NOTES_PREFIX}${year}_${quarter}_${lesson}_d${dayId}_q${qLabel}`;
    if (text.trim()) {
      localStorage.setItem(key, text);
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.error('Failed to save study note:', e);
  }
}
