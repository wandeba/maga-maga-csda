import React, { useState, useMemo } from 'react';
import { Search, X, Heart, Music, ArrowUpDown, Sparkles, Filter, Bookmark } from 'lucide-react';
import { Hymn, ThemeMode } from '../types/hymn';
import { CATEGORIES } from '../data/hymnsData';

interface HymnIndexProps {
  hymns: Hymn[];
  selectedHymnId: number;
  onSelectHymn: (hymn: Hymn) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  languageFilter: 'All' | 'Juba Arabic' | 'English' | 'Favorites';
  theme: ThemeMode;
}

export const HymnIndex: React.FC<HymnIndexProps> = ({
  hymns,
  selectedHymnId,
  onSelectHymn,
  favorites,
  onToggleFavorite,
  languageFilter,
  theme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'number' | 'alphabetical'>('number');
  const [quickNumberRange, setQuickNumberRange] = useState<string>('all');

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  // Filter and search logic
  const filteredHymns = useMemo(() => {
    let result = [...hymns];

    // Language filter
    if (languageFilter === 'Juba Arabic') {
      result = result.filter(h => h.language === 'Juba Arabic');
    } else if (languageFilter === 'English') {
      result = result.filter(h => h.language === 'English');
    } else if (languageFilter === 'Favorites') {
      result = result.filter(h => favorites.includes(h.id));
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(h => h.category === selectedCategory);
    }

    // Number range filter
    if (quickNumberRange !== 'all') {
      const [minStr, maxStr] = quickNumberRange.split('-');
      const min = parseInt(minStr, 10);
      const max = parseInt(maxStr, 10);
      result = result.filter(h => h.id >= min && h.id <= max);
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      // Check if user typed pure number
      const numMatch = parseInt(q, 10);
      result = result.filter(h => {
        if (!isNaN(numMatch) && h.id === numMatch) return true;
        return (
          h.id.toString().includes(q) ||
          h.title.toLowerCase().includes(q) ||
          h.lyrics.toLowerCase().includes(q) ||
          (h.author && h.author.toLowerCase().includes(q)) ||
          (h.reference && h.reference.toLowerCase().includes(q)) ||
          (h.key && h.key.toLowerCase().includes(q))
        );
      });
    }

    // Sort order
    if (sortOrder === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [hymns, languageFilter, selectedCategory, quickNumberRange, searchQuery, sortOrder, favorites]);

  // Highlight search text helper
  const getPreviewText = (lyrics: string, query: string) => {
    const lines = lyrics.split('\n').filter(l => l.trim().length > 0);
    if (!lines.length) return '';

    if (query.length > 2) {
      const matchedLine = lines.find(l => l.toLowerCase().includes(query.toLowerCase()));
      if (matchedLine) return matchedLine.replace(/^[0-9]+\.\s*/, '');
    }
    return lines[0].replace(/^[0-9]+\.\s*/, '');
  };

  const cardBorder = isDark
    ? 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
    : isSepia
    ? 'border-[#e0d0b8] hover:border-[#caa47b] bg-[#fdfaf5]'
    : 'border-slate-200 hover:border-amber-300 bg-white';

  const cardSelected = isDark
    ? 'border-amber-500/80 bg-slate-800/90 ring-2 ring-amber-500/20'
    : isSepia
    ? 'border-amber-700 bg-[#f4e8d3] ring-2 ring-amber-700/20'
    : 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/20';

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-3 sm:p-4 space-y-3 border-b border-black/10 dark:border-white/10">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by song #, title, lyrics, author, SDAH..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-9 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-400'
                : isSepia
                ? 'bg-[#ede0c8] border-[#cbb898] text-[#3d2f1d] placeholder-[#8d7c67]'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-60 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Range / Sort Selector */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[11px] font-mono opacity-60 shrink-0">Range:</span>
            {[
              { label: 'All', val: 'all' },
              { label: '1–100', val: '1-100' },
              { label: '101–200', val: '101-200' },
              { label: '201–350', val: '201-350' },
              { label: '351–450', val: '351-450' },
              { label: '451–560', val: '451-560' }
            ].map(r => (
              <button
                key={r.val}
                onClick={() => setQuickNumberRange(r.val)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono shrink-0 transition-colors ${
                  quickNumberRange === r.val
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'number' ? 'alphabetical' : 'number')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100 shrink-0 text-[11px]"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>{sortOrder === 'number' ? 'By #' : 'A-Z'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] transition-colors border ${
                selectedCategory === cat
                  ? 'bg-amber-700 text-white border-amber-700 font-semibold shadow-xs'
                  : 'bg-transparent border-black/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Result summary */}
        <div className="flex items-center justify-between text-[11px] opacity-70 px-1">
          <span>
            Showing <strong className="text-amber-600 dark:text-amber-400">{filteredHymns.length}</strong> hymns
          </span>
          {languageFilter !== 'All' && (
            <span className="font-semibold">{languageFilter}</span>
          )}
        </div>
      </div>

      {/* Hymn List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {filteredHymns.length === 0 ? (
          <div className="py-12 text-center space-y-3 opacity-60">
            <Search className="w-8 h-8 mx-auto text-amber-600" />
            <p className="text-sm">No songs found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setQuickNumberRange('all');
              }}
              className="px-3 py-1 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredHymns.map(hymn => {
            const isSelected = hymn.id === selectedHymnId;
            const isFav = favorites.includes(hymn.id);
            const preview = getPreviewText(hymn.lyrics, searchQuery);

            return (
              <div
                key={hymn.id}
                onClick={() => onSelectHymn(hymn)}
                className={`group relative rounded-xl border p-3 cursor-pointer transition-all duration-150 ${
                  isSelected ? cardSelected : cardBorder
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Song Number Badge */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-xs ${
                        isSelected
                          ? 'bg-amber-600 text-white'
                          : hymn.id === 0
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : hymn.language === 'Juba Arabic'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                      }`}
                    >
                      {hymn.id === 0 ? '0' : `#${hymn.id}`}
                    </div>

                    <div className="min-w-0">
                      {/* Song Title */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold text-sm tracking-tight truncate group-hover:text-amber-600 transition-colors">
                          {hymn.title}
                        </h3>
                        {hymn.is_featured && (
                          <span className="text-[10px] px-1 py-0.2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded font-semibold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}
                      </div>

                      {/* First line preview */}
                      <p className="text-xs opacity-70 line-clamp-1 mt-0.5 font-serif-hymn italic">
                        {preview}
                      </p>

                      {/* Tags & Meta */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            hymn.language === 'Juba Arabic'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : hymn.language === 'English'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {hymn.language}
                        </span>

                        {hymn.key && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-amber-100/60 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {hymn.key}
                          </span>
                        )}

                        {hymn.reference && hymn.reference.includes('SDAH') && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {hymn.reference.match(/SDAH\.[0-9]+/)?.[0] || hymn.reference}
                          </span>
                        )}

                        {hymn.author && (
                          <span className="text-[10px] opacity-65 truncate max-w-[130px]">
                            by {hymn.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Favorite Bookmark Button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(hymn.id);
                    }}
                    className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                    title={isFav ? 'Remove favorite' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-red-500 text-red-500 opacity-100' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
