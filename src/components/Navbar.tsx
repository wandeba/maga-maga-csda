import React, { useState } from 'react';
import { BookOpen, Search, Moon, Sun, Monitor, Heart, Calendar, Coffee, Church, Hash } from 'lucide-react';
import { ThemeMode } from '../types/hymn';

interface NavbarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  activeTab: 'hymnal' | 'sabbath-school';
  onActiveTabChange: (tab: 'hymnal' | 'sabbath-school') => void;
  languageFilter: 'All' | 'Juba Arabic' | 'English' | 'Favorites';
  onLanguageFilterChange: (lang: 'All' | 'Juba Arabic' | 'English' | 'Favorites') => void;
  onSelectHymnId: (id: number) => void;
  onOpenWorshipModal: () => void;
  onOpenPresentation: () => void;
  favoritesCount: number;
  totalHymnsCount: number;
  currentHymnId?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  activeTab,
  onActiveTabChange,
  languageFilter,
  onLanguageFilterChange,
  onSelectHymnId,
  onOpenWorshipModal,
  onOpenPresentation,
  favoritesCount,
  totalHymnsCount,
  currentHymnId
}) => {
  const [jumpInput, setJumpInput] = useState('');

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(jumpInput.trim(), 10);
    if (!isNaN(id) && id >= 0 && id <= 560) {
      onActiveTabChange('hymnal');
      onSelectHymnId(id);
      setJumpInput('');
    }
  };

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const navBg = isDark
    ? 'bg-slate-950/90 border-slate-800 text-slate-100'
    : isSepia
    ? 'bg-[#f4ebd9]/95 border-[#d6c4a5] text-[#3c2e1f]'
    : 'bg-white/95 border-amber-200/80 text-slate-900';

  const tabActiveBg = isDark
    ? 'bg-amber-600 text-white'
    : isSepia
    ? 'bg-amber-800 text-amber-50'
    : 'bg-amber-700 text-white';

  const tabInactiveBg = isDark
    ? 'text-slate-300 hover:bg-slate-900'
    : isSepia
    ? 'text-[#5c4a35] hover:bg-[#ebdcc4]'
    : 'text-slate-600 hover:bg-amber-50';

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${navBg}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Church Branding & Emblem */}
          <div
            onClick={() => onSelectHymnId(1)}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
              <Church className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-cinzel text-base sm:text-lg font-bold tracking-tight text-amber-800 dark:text-amber-400">
                  MAGA MAGA C SDA
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-600/10 text-amber-700 dark:text-amber-300 border border-amber-600/20">
                  CHURCH
                </span>
              </div>
              <p className="text-[11px] font-serif-hymn italic opacity-80 leading-tight">
                Juba Arabic & English Hymnal • Kitāb al-Tarānīm
              </p>
            </div>
          </div>

          {/* Quick Jump by Song Number */}
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
            <div className="relative">
              <Hash className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
              <input
                type="number"
                min="0"
                max="560"
                placeholder="Song # (1-560)"
                value={jumpInput}
                onChange={e => setJumpInput(e.target.value)}
                className={`w-28 sm:w-32 pl-7 pr-2 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                    : isSepia
                    ? 'bg-[#ede0c8] border-[#cbb898] text-[#3d2f1d] placeholder-[#8d7c67]'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl transition-transform active:scale-95 shadow-sm"
            >
              Go
            </button>
          </form>

          {/* Main App View Switcher (Hymn Book vs Sabbath School Quarterly) */}
          <div className="flex items-center p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <button
              onClick={() => onActiveTabChange('hymnal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'hymnal'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hymn Book</span>
            </button>
            <button
              onClick={() => onActiveTabChange('sabbath-school')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sabbath-school'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sabbath School Lesson</span>
              <span className="text-[10px] px-1 py-0.2 rounded font-mono bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold hidden sm:inline">
                SBL
              </span>
            </button>
          </div>

          {/* Sabbath Liturgy & Presentation & Theme Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sabbath Order of Service Modal Trigger */}
            <button
              onClick={onOpenWorshipModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-900 text-slate-200'
                  : isSepia
                  ? 'border-[#d3c0a0] hover:bg-[#ebdcc4] text-[#4d3b27]'
                  : 'border-amber-200 hover:bg-amber-50 text-slate-700'
              }`}
              title="Sabbath Worship Order & Liturgy"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Order of Worship</span>
            </button>

            {/* Presentation / Projector Mode for Church Sanctuary Screens */}
            {activeTab === 'hymnal' && (
              <button
                onClick={onOpenPresentation}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-amber-600/10 hover:bg-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-600/20 rounded-xl transition-colors"
                title="Full Screen Church Projector Mode (For pulpit & screen)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Projector</span>
              </button>
            )}

            {/* Theme selector */}
            <div className="flex items-center p-0.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
              <button
                onClick={() => onThemeChange('sepia')}
                className={`p-1.5 rounded-lg transition-colors ${isSepia ? 'bg-amber-200 text-amber-900 font-bold' : 'opacity-60 hover:opacity-100'}`}
                title="Sepia Warm Parchment"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'bg-slate-800 text-amber-400 font-bold' : 'opacity-60 hover:opacity-100'}`}
                title="Dark Sanctuary Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onThemeChange('light')}
                className={`p-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                title="Clean Daylight Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Sub-navigation row */}
        {activeTab === 'hymnal' ? (
          <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between overflow-x-auto gap-2 text-xs">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => onLanguageFilterChange('All')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  languageFilter === 'All' ? tabActiveBg : tabInactiveBg
                }`}
              >
                All Hymns ({totalHymnsCount})
              </button>
              <button
                onClick={() => onLanguageFilterChange('Juba Arabic')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  languageFilter === 'Juba Arabic' ? tabActiveBg : tabInactiveBg
                }`}
              >
                Juba Arabic (1–360)
              </button>
              <button
                onClick={() => onLanguageFilterChange('English')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  languageFilter === 'English' ? tabActiveBg : tabInactiveBg
                }`}
              >
                English (361–560)
              </button>
              <button
                onClick={() => onLanguageFilterChange('Favorites')}
                className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                  languageFilter === 'Favorites' ? tabActiveBg : tabInactiveBg
                }`}
              >
                <Heart className={`w-3 h-3 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                <span>Favorites ({favoritesCount})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] opacity-75 shrink-0">
              <button
                onClick={() => onSelectHymnId(0)}
                className="hover:underline flex items-center gap-1"
                title="Song #0: Acknowledgements & South Sudan SDA History"
              >
                <BookOpen className="w-3 h-3" />
                <span>Preface & Acknowledgement</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between overflow-x-auto gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                Sabbath Bible Lessons Quarterly
              </span>
              <span className="opacity-75">
                • Continuous offline caching from legacy.sdarm.org/publications/periodicals/sbl
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] opacity-80 shrink-0">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-medium">
                Offline Auto-Cache Active
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
