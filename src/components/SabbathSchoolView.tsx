import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Download,
  CheckCircle,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Music,
  Share2,
  FileText,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Loader2,
  Bookmark
} from 'lucide-react';
import { SabbathSchoolLesson, SBLDay, SBLQuestion } from '../types/sabbathSchool';
import { ThemeMode, FontSize } from '../types/hymn';
import {
  fetchLessonWithOfflineFallback,
  saveLessonToCache,
  getCachedLesson,
  cacheEntireQuarter,
  getCachedLessonsIndex,
  getUserStudyNote,
  saveUserStudyNote
} from '../utils/sblOfflineCache';

interface SabbathSchoolViewProps {
  theme: ThemeMode;
  onOpenHymnId: (id: number) => void;
}

export const SabbathSchoolView: React.FC<SabbathSchoolViewProps> = ({ theme, onOpenHymnId }) => {
  // Navigation state
  const [year, setYear] = useState<number>(2026);
  const [quarter, setQuarter] = useState<number>(4);
  const [lessonNumber, setLessonNumber] = useState<number>(3);
  const [lang] = useState<string>('en');

  // Lesson data state
  const [lesson, setLesson] = useState<SabbathSchoolLesson | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(!navigator.onLine);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active day tab
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // Audio narration state
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);

  // Memory verse practice tool
  const [memoryHideLevel, setMemoryHideLevel] = useState<0 | 1 | 2>(0); // 0 = full, 1 = partial, 2 = hidden

  // Quarter caching progress
  const [isCachingQuarter, setIsCachingQuarter] = useState<boolean>(false);
  const [cachingProgress, setCachingProgress] = useState<{ current: number; total: number; title: string } | null>(null);
  const [cachedLessonsCount, setCachedLessonsCount] = useState<number>(0);

  // Study notes state for current lesson
  const [studyNotes, setStudyNotes] = useState<Record<string, string>>({});
  const [savedNoteIndicator, setSavedNoteIndicator] = useState<string | null>(null);

  // Load lesson
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setErrorMsg(null);

    // Stop current audio if playing
    if (audioElement) {
      audioElement.pause();
      setAudioPlaying(false);
    }

    fetchLessonWithOfflineFallback(year, quarter, lessonNumber, lang)
      .then(({ lesson: loadedLesson, fromOffline }) => {
        if (!isMounted) return;
        setLesson(loadedLesson);
        setIsOfflineMode(fromOffline || !navigator.onLine);
        setIsLoading(false);

        // Load existing notes for this lesson
        const notesObj: Record<string, string> = {};
        loadedLesson.days.forEach(day => {
          day.questions.forEach(q => {
            const note = getUserStudyNote(year, quarter, lessonNumber, day.id, q.label);
            if (note) {
              notesObj[`${day.id}_${q.label}`] = note;
            }
          });
        });
        setStudyNotes(notesObj);
      })
      .catch(err => {
        if (!isMounted) return;
        setIsLoading(false);
        setErrorMsg(err.message || 'Failed to load lesson.');
      });

    // Update cached count
    const idx = getCachedLessonsIndex();
    setCachedLessonsCount(idx.length);

    return () => {
      isMounted = false;
    };
  }, [year, quarter, lessonNumber, lang]);

  // Audio setup
  useEffect(() => {
    if (lesson?.audioUrl) {
      const audio = new Audio(lesson.audioUrl);
      audio.playbackRate = audioSpeed;
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => setAudioPlaying(false);
      setAudioElement(audio);

      return () => {
        audio.pause();
      };
    }
  }, [lesson?.audioUrl]);

  // Handle audio play/pause
  const toggleAudio = () => {
    if (!audioElement) return;
    if (audioPlaying) {
      audioElement.pause();
      setAudioPlaying(false);
    } else {
      audioElement
        .play()
        .then(() => setAudioPlaying(true))
        .catch(e => {
          console.warn('Audio play prevented:', e);
          setAudioPlaying(false);
        });
    }
  };

  const changeAudioSpeed = () => {
    const nextSpeed = audioSpeed === 1 ? 1.25 : audioSpeed === 1.25 ? 1.5 : 1;
    setAudioSpeed(nextSpeed);
    if (audioElement) {
      audioElement.playbackRate = nextSpeed;
    }
  };

  // Cache single lesson
  const handleSaveToCache = () => {
    if (lesson) {
      saveLessonToCache(lesson);
      setCachedLessonsCount(getCachedLessonsIndex().length);
      setSavedNoteIndicator('Lesson saved for offline study!');
      setTimeout(() => setSavedNoteIndicator(null), 3000);
    }
  };

  // Cache entire quarter (Lessons 1-13)
  const handleCacheQuarter = async () => {
    setIsCachingQuarter(true);
    setCachingProgress({ current: 0, total: 13, title: 'Starting download...' });

    await cacheEntireQuarter(year, quarter, lang, (current, total, title) => {
      setCachingProgress({ current, total, title });
    });

    setIsCachingQuarter(false);
    setCachingProgress(null);
    setCachedLessonsCount(getCachedLessonsIndex().length);
    setSavedNoteIndicator('Entire Quarter (Lessons 1–13) cached offline!');
    setTimeout(() => setSavedNoteIndicator(null), 4000);
  };

  // Save personal study note
  const handleNoteChange = (dayId: number, qLabel: string, text: string) => {
    const key = `${dayId}_${qLabel}`;
    setStudyNotes(prev => ({ ...prev, [key]: text }));
    saveUserStudyNote(year, quarter, lessonNumber, dayId, qLabel, text);
  };

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const cardBg = isDark
    ? 'bg-slate-900/80 border-slate-800'
    : isSepia
    ? 'bg-[#f5ede0]/80 border-[#d6c4a5]'
    : 'bg-white border-slate-200';

  const memoryVerseDisplay = () => {
    if (!lesson) return '';
    const text = lesson.memoryVerse;
    if (memoryHideLevel === 0) return text;
    if (memoryHideLevel === 2) return '• • • (Recite Memory Verse from Memory) • • •';

    // Partial hide: replace every 2nd or 3rd word with underscores
    return text
      .split(' ')
      .map((word, idx) => (idx % 2 === 1 ? '______' : word))
      .join(' ');
  };

  const activeDay = lesson?.days?.[activeDayIndex] || lesson?.days?.[0];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar: Year, Quarter, Lesson Selector & Offline Controls */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm backdrop-blur-md ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Year / Quarter / Lesson Pickers */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Year */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold opacity-70">Year:</span>
                <select
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  className="text-xs font-bold py-1.5 px-2 rounded-xl border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              {/* Quarter */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold opacity-70">Quarter:</span>
                <select
                  value={quarter}
                  onChange={e => setQuarter(Number(e.target.value))}
                  className="text-xs font-bold py-1.5 px-2 rounded-xl border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                >
                  <option value={1}>Quarter 1 (Jan–Mar)</option>
                  <option value={2}>Quarter 2 (Apr–Jun)</option>
                  <option value={3}>Quarter 3 (Jul–Sep)</option>
                  <option value={4}>Quarter 4 (Oct–Dec)</option>
                </select>
              </div>

              {/* Lesson 1 to 13 */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold opacity-70">Lesson:</span>
                <select
                  value={lessonNumber}
                  onChange={e => setLessonNumber(Number(e.target.value))}
                  className="text-xs font-bold py-1.5 px-2 rounded-xl border bg-amber-600/10 text-amber-800 dark:text-amber-300 border-amber-500/30 font-mono"
                >
                  {Array.from({ length: 13 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>
                      Lesson {n} {n === 3 && year === 2026 && quarter === 4 ? '(Current: Oct 17)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Offline Caching Actions */}
            <div className="flex items-center gap-2">
              {/* Online / Offline badge */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
                  isOfflineMode
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                <span>{isOfflineMode ? 'Offline Stored' : 'Live Sync'}</span>
              </div>

              {/* Cache Full Quarter button */}
              <button
                onClick={handleCacheQuarter}
                disabled={isCachingQuarter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold transition-transform active:scale-95 shadow-xs disabled:opacity-50"
                title="Download all 13 lessons of this quarter for offline study without internet"
              >
                {isCachingQuarter ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Cache Full Quarter</span>
              </button>

              {/* Quick source link */}
              <a
                href={lesson?.sourceUrl || `https://legacy.sdarm.org/publications/periodicals/sbl/en/${year}/${quarter}/${lessonNumber}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                title="Open original page on legacy.sdarm.org"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Caching progress toast / bar */}
          {cachingProgress && (
            <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 space-y-1 text-xs">
              <div className="flex justify-between items-center font-mono">
                <span>
                  Caching Lesson {cachingProgress.current} of {cachingProgress.total}...
                </span>
                <span className="font-semibold text-amber-600">
                  {Math.round((cachingProgress.current / cachingProgress.total) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${(cachingProgress.current / cachingProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {savedNoteIndicator && (
            <div className="mt-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{savedNoteIndicator}</span>
            </div>
          )}
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="py-20 text-center space-y-3 opacity-70">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-amber-600" />
            <p className="text-sm">Pulling Sabbath School lesson from SDARM archives...</p>
          </div>
        )}

        {errorMsg && !isLoading && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 space-y-2">
            <h3 className="font-bold text-sm">Could not load lesson</h3>
            <p className="text-xs">{errorMsg}</p>
            <p className="text-xs opacity-75">
              Make sure you have an internet connection to pull new lessons, or choose an already cached lesson.
            </p>
          </div>
        )}

        {lesson && !isLoading && (
          <>
            {/* Lesson Banner & Title Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${cardBg} relative overflow-hidden`}>
              <div className="space-y-3">
                {/* Quarterly Title */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">
                    {year} • Q{quarter}
                  </span>
                  <span className="text-xs font-medium opacity-75 font-serif-hymn italic">
                    {lesson.quarterlyTheme}
                  </span>
                </div>

                {/* Lesson Header & Title */}
                <div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                    {lesson.lessonHeader} • {lesson.date}
                  </div>
                  <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-950 dark:text-amber-300 mt-1">
                    {lesson.title}
                  </h1>
                </div>

                {/* Suggested Readings & Introduction Quote */}
                {lesson.suggestedReadings && (
                  <div className="text-xs opacity-80 pt-1 font-serif-hymn">
                    <strong>Suggested Readings:</strong> {lesson.suggestedReadings}
                  </div>
                )}

                {lesson.introQuote && (
                  <blockquote className="p-3.5 rounded-xl border-l-4 border-amber-600 bg-amber-500/5 text-xs sm:text-sm font-serif-hymn italic leading-relaxed opacity-90 mt-2">
                    {lesson.introQuote}
                  </blockquote>
                )}

                {/* Audio Narrator & Action Row */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 dark:border-white/10">
                  {/* Audio Narrator Player */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleAudio}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                    >
                      {audioPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{audioPlaying ? 'Pause Narration' : 'Listen to Lesson Audio'}</span>
                    </button>

                    <button
                      onClick={changeAudioSpeed}
                      className="px-2 py-1 text-xs font-mono font-bold rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5"
                      title="Narration Speed"
                    >
                      {audioSpeed}x
                    </button>
                  </div>

                  {/* Sabbath School Opening Hymn Shortcut */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenHymnId(415)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-amber-600/30 hover:bg-amber-600/10 text-amber-800 dark:text-amber-300 transition-colors"
                      title="Sing Song #415: Sweet Sabbath School"
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>Hymn #415 (Sweet Sabbath School)</span>
                    </button>

                    <button
                      onClick={handleSaveToCache}
                      className="p-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 opacity-75 hover:opacity-100"
                      title="Ensure Saved Offline"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Verse Card & Interactive Memorization Mode */}
            <div className={`p-6 rounded-2xl border shadow-sm ${cardBg}`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Memory Verse • {lesson.memoryVerseRef || 'Philippians 3:10, 11'}
                  </h3>
                </div>

                {/* Recitation practice toggle */}
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="opacity-60 hidden sm:inline">Practice Recitation:</span>
                  <button
                    onClick={() => setMemoryHideLevel(prev => (prev === 0 ? 1 : prev === 1 ? 2 : 0))}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-600/30 bg-amber-500/10 font-medium text-amber-700 dark:text-amber-300 text-xs"
                    title="Hide words to test memory recitation"
                  >
                    {memoryHideLevel === 0 ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{memoryHideLevel === 0 ? 'Full Verse' : memoryHideLevel === 1 ? 'Fill Blanks' : 'Hidden'}</span>
                  </button>
                </div>
              </div>

              <p className="font-serif-hymn text-lg sm:text-xl md:text-2xl italic leading-relaxed text-amber-950 dark:text-amber-100 p-2">
                “{memoryVerseDisplay()}”
              </p>
            </div>

            {/* Days Tabs (Sun, Mon, Tue, Wed, Thu, Fri / Review) */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-black/10 dark:border-white/10">
                {lesson.days.map((d, dIdx) => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDayIndex(dIdx)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      activeDayIndex === dIdx
                        ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{d.dayName}</span> {d.dateStr && <span className="text-[10px] opacity-80">({d.dateStr})</span>}
                  </button>
                ))}
              </div>

              {/* Active Day Content */}
              {activeDay && (
                <div className={`p-6 sm:p-8 rounded-2xl border shadow-sm space-y-6 ${cardBg}`}>
                  {/* Day Header */}
                  <div className="border-b border-black/10 dark:border-white/10 pb-3">
                    <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {activeDay.dayName} {activeDay.dateStr}
                    </div>
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-300 mt-0.5">
                      {activeDay.title}
                    </h2>
                  </div>

                  {/* Questions in Active Day */}
                  <div className="space-y-8">
                    {activeDay.questions.map((q, qIdx) => {
                      const noteKey = `${activeDay.id}_${q.label}`;
                      const userNote = studyNotes[noteKey] || '';

                      return (
                        <div key={qIdx} className="space-y-3.5 pt-2">
                          {/* Question Text */}
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              {q.label}
                            </span>
                            <div className="space-y-1">
                              <h4 className="font-medium text-base sm:text-lg leading-snug">
                                {q.question}
                              </h4>
                              {q.scripture && (
                                <span className="inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                                  {q.scripture}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Ellen G. White / Spirit of Prophecy Commentary Quotes */}
                          {q.notes && q.notes.length > 0 && (
                            <div className="ml-8 space-y-2.5">
                              {q.notes.map((note, nIdx) => (
                                <p
                                  key={nIdx}
                                  className="font-serif-hymn text-sm sm:text-base leading-relaxed p-3.5 rounded-xl border-l-3 border-amber-700/60 bg-amber-500/5 text-[#4a3b2b] dark:text-[#d8c8b4]"
                                >
                                  {note}
                                </p>
                              ))}
                            </div>
                          )}

                          {/* Personal Study Answer / Note for Sabbath School Discussion */}
                          <div className="ml-8 pt-1">
                            <div className="flex items-center justify-between text-xs opacity-70 mb-1">
                              <span className="font-medium flex items-center gap-1">
                                <FileText className="w-3 h-3 text-amber-600" />
                                <span>My Sabbath School Notes & Answers:</span>
                              </span>
                              {userNote && <span className="text-[10px] text-emerald-600 font-mono">Saved locally</span>}
                            </div>
                            <textarea
                              rows={2}
                              placeholder="Write your answer or thoughts for Sabbath morning discussion..."
                              value={userNote}
                              onChange={e => handleNoteChange(activeDay.id, q.label, e.target.value)}
                              className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                                isDark
                                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                                  : isSepia
                                  ? 'bg-[#fcf8f0] border-[#cbbca3] text-[#3b2d1c] placeholder-[#9c8973]'
                                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Previous & Next Lesson Navigation */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-black/10 dark:border-white/10">
              <button
                onClick={() => setLessonNumber(prev => Math.max(1, prev - 1))}
                disabled={lessonNumber <= 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold disabled:opacity-30 hover:bg-black/5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Lesson ({lessonNumber - 1})</span>
              </button>

              <span className="text-xs font-mono opacity-60">
                Lesson {lessonNumber} of 13
              </span>

              <button
                onClick={() => setLessonNumber(prev => Math.min(13, prev + 1))}
                disabled={lessonNumber >= 13}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold disabled:opacity-30 hover:bg-black/5"
              >
                <span>Next Lesson ({lessonNumber + 1})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
