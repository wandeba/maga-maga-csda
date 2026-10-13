import React, { useState, useEffect } from 'react';
import { hymns, getHymnById } from './data/hymnsData';
import { Hymn, ThemeMode } from './types/hymn';
import { Navbar } from './components/Navbar';
import { HymnIndex } from './components/HymnIndex';
import { HymnView } from './components/HymnView';
import { SabbathSchoolView } from './components/SabbathSchoolView';
import { WorshipOrderModal } from './components/WorshipOrderModal';
import { PresentationModal } from './components/PresentationModal';
import { Menu, BookOpen, Music, Heart, ChevronLeft } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('maga_maga_sda_theme');
    return (saved as ThemeMode) || 'sepia';
  });

  // Main active tab: 'hymnal' or 'sabbath-school'
  const [activeTab, setActiveTab] = useState<'hymnal' | 'sabbath-school'>('hymnal');

  // Selected Hymn state
  const [selectedHymnId, setSelectedHymnId] = useState<number>(() => {
    const saved = localStorage.getItem('maga_maga_sda_last_hymn');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Favorites state
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('maga_maga_sda_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return [1, 19, 362, 366, 371, 395, 414, 502, 546]; // default favorites
  });

  // Filters and views
  const [languageFilter, setLanguageFilter] = useState<'All' | 'Juba Arabic' | 'English' | 'Favorites'>('All');
  const [isWorshipModalOpen, setIsWorshipModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
  const [isSidebarCollapsedOnDesktop, setIsSidebarCollapsedOnDesktop] = useState(false);

  // Sync theme to localStorage and document class
  useEffect(() => {
    localStorage.setItem('maga_maga_sda_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Sync selected hymn to localStorage
  useEffect(() => {
    localStorage.setItem('maga_maga_sda_last_hymn', selectedHymnId.toString());
  }, [selectedHymnId]);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('maga_maga_sda_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const currentHymn = getHymnById(selectedHymnId) || hymns[1];

  const currentHymnIndex = hymns.findIndex(h => h.id === selectedHymnId);
  const hasPrevious = currentHymnIndex > 0;
  const hasNext = currentHymnIndex < hymns.length - 1;

  const handlePreviousHymn = () => {
    if (hasPrevious) {
      setSelectedHymnId(hymns[currentHymnIndex - 1].id);
    }
  };

  const handleNextHymn = () => {
    if (hasNext) {
      setSelectedHymnId(hymns[currentHymnIndex + 1].id);
    }
  };

  const handleSelectHymn = (hymn: Hymn) => {
    setActiveTab('hymnal');
    setSelectedHymnId(hymn.id);
    setIsSidebarOpenOnMobile(false);
  };

  const handleSelectHymnId = (id: number) => {
    const found = getHymnById(id);
    if (found) {
      setActiveTab('hymnal');
      setSelectedHymnId(id);
      setIsSidebarOpenOnMobile(false);
    }
  };

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const appBg = isDark
    ? 'bg-slate-950 text-slate-100'
    : isSepia
    ? 'bg-[#fcf7ee] text-[#3b2d1c]'
    : 'bg-[#fafafa] text-slate-900';

  const sidebarBg = isDark
    ? 'bg-slate-900/95 border-slate-800'
    : isSepia
    ? 'bg-[#f7f0e3] border-[#decbb0]'
    : 'bg-white border-slate-200';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${appBg}`}>
      {/* Top Navigation Bar */}
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        languageFilter={languageFilter}
        onLanguageFilterChange={setLanguageFilter}
        onSelectHymnId={handleSelectHymnId}
        onOpenWorshipModal={() => setIsWorshipModalOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        favoritesCount={favorites.length}
        totalHymnsCount={hymns.length - 1} // excluding 0
        currentHymnId={selectedHymnId}
      />

      {/* Main Layout */}
      {activeTab === 'hymnal' ? (
        <main className="flex-1 flex overflow-hidden relative">
          {/* Mobile Sidebar Backdrop */}
          {isSidebarOpenOnMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs"
              onClick={() => setIsSidebarOpenOnMobile(false)}
            />
          )}

          {/* Left Side: Searchable Index Sidebar */}
          <aside
            className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-full sm:w-96 lg:w-96 shrink-0 border-r transition-all duration-200 flex flex-col ${sidebarBg} ${
              isSidebarOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } ${isSidebarCollapsedOnDesktop ? 'lg:hidden' : 'lg:flex'}`}
          >
            {/* Mobile close bar */}
            <div className="lg:hidden flex items-center justify-between p-3 border-b border-black/10 dark:border-white/10">
              <span className="font-semibold text-sm">Hymn Index</span>
              <button
                onClick={() => setIsSidebarOpenOnMobile(false)}
                className="p-1.5 rounded-lg opacity-70 hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <HymnIndex
              hymns={hymns}
              selectedHymnId={selectedHymnId}
              onSelectHymn={handleSelectHymn}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              languageFilter={languageFilter}
              theme={theme}
            />
          </aside>

          {/* Right Side: Hymn Reader & Accompaniment View */}
          <section className="flex-1 flex flex-col min-w-0 h-[calc(100vh-105px)] overflow-hidden relative">
            {/* Mobile / Desktop Toggle Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-black/5 dark:border-white/5 text-xs opacity-75">
              <button
                onClick={() => setIsSidebarOpenOnMobile(true)}
                className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 font-medium"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Browse All Hymns</span>
              </button>

              <button
                onClick={() => setIsSidebarCollapsedOnDesktop(!isSidebarCollapsedOnDesktop)}
                className="hidden lg:flex items-center gap-1.5 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>{isSidebarCollapsedOnDesktop ? 'Show Song Index' : 'Hide Sidebar'}</span>
              </button>

              <div className="font-serif-hymn italic text-xs">
                Maga Maga C Seventh-day Adventist Church
              </div>
            </div>

            {/* Hymn View Content */}
            <div className="flex-1 overflow-hidden">
              <HymnView
                hymn={currentHymn}
                onPreviousHymn={handlePreviousHymn}
                onNextHymn={handleNextHymn}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                isFavorite={favorites.includes(currentHymn.id)}
                onToggleFavorite={toggleFavorite}
                onOpenPresentation={() => setIsPresentationOpen(true)}
                theme={theme}
              />
            </div>
          </section>
        </main>
      ) : (
        /* Sabbath School Lesson Quarterly View */
        <main className="flex-1 h-[calc(100vh-105px)] overflow-hidden">
          <SabbathSchoolView
            theme={theme}
            onOpenHymnId={handleSelectHymnId}
          />
        </main>
      )}

      {/* Sabbath Worship Order Guide Modal */}
      <WorshipOrderModal
        isOpen={isWorshipModalOpen}
        onClose={() => setIsWorshipModalOpen(false)}
        onSelectHymnId={handleSelectHymnId}
        theme={theme}
      />

      {/* Church Sanctuary Screen / Projector Mode Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        hymn={currentHymn}
        theme={theme}
      />
    </div>
  );
}
