export interface SBLQuestion {
  label: string; // e.g. "a", "b", "1"
  question: string;
  scripture?: string;
  scriptureLink?: string;
  notes: string[]; // Spirit of Prophecy / Ellen G. White commentary quotes
}

export interface SBLDay {
  id: number;
  title: string; // e.g. "1. RIGHTEOUSNESS BY FAITH"
  dayName: string; // "Sun", "Mon", "Tue", etc.
  dateStr: string; // "Oct 11", etc.
  questions: SBLQuestion[];
}

export interface SabbathSchoolLesson {
  year: number;
  quarter: number;
  lesson: number;
  lang: string;
  quarterlyTheme: string;
  lessonHeader: string; // "Lesson 3"
  title: string; // "Longing to Know Jesus Better"
  date: string; // "Sabbath, October 17, 2026"
  memoryVerse: string;
  memoryVerseRef: string;
  suggestedReadings: string;
  introQuote?: string;
  introQuoteAuthor?: string;
  audioUrl?: string;
  days: SBLDay[];
  sourceUrl: string;
  cachedAt: string;
  isOfflineCached?: boolean;
}

export interface SBLCacheMeta {
  key: string;
  year: number;
  quarter: number;
  lesson: number;
  title: string;
  date: string;
  cachedAt: string;
  sizeBytes: number;
}
