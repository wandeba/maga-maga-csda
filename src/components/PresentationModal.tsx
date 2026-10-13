import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Volume2, Maximize, Minimize } from 'lucide-react';
import { Hymn, ThemeMode } from '../types/hymn';
import { audioEngine, getAccompanimentForHymn } from '../utils/audioAccompaniment';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hymn: Hymn;
  theme: ThemeMode;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  hymn,
  theme
}) => {
  if (!isOpen) return null;

  // Split into verse sections
  const sections = hymn.lyrics.split(/\n\s*\n/).filter(s => s.trim().length > 0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(audioEngine.getIsRunning());

  // Reset to first section when hymn changes
  useEffect(() => {
    setCurrentSectionIndex(0);
  }, [hymn.id]);

  // Keyboard navigation for presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSectionIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sections.length, onClose]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      const pattern = getAccompanimentForHymn(hymn.id, hymn.key || hymn.reference);
      audioEngine.startAccompaniment(pattern, hymn.language === 'Juba Arabic' ? 'gospel_praise' : 'pipe_organ', pattern.defaultBpm, 0, 0.8, true);
      setIsPlaying(true);
    }
  };

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const currentSectionText = sections[currentSectionIndex] || '';
  const isChorus = currentSectionText.toLowerCase().startsWith('chorus') || currentSectionText.toLowerCase().includes('refrain');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white select-none">
      {/* Top Projector Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-mono font-bold text-sm">
            #{hymn.id}
          </span>
          <div>
            <h2 className="font-cinzel text-lg font-bold text-amber-300 truncate max-w-md sm:max-w-xl">
              {hymn.title}
            </h2>
            <p className="text-xs text-slate-400">
              Maga Maga C SDA Church Sanctuary Display • {hymn.language}
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
            {sections.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSectionIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  currentSectionIndex === idx
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Exit Projector Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Sanctuary Lyrics Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16 text-center overflow-y-auto">
        <div className="max-w-4xl w-full space-y-8 animate-in fade-in duration-200">
          {/* Section Indicator */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-cinzel font-semibold tracking-widest uppercase">
            {isChorus ? 'Chorus / Refrain' : `Stanza ${currentSectionIndex + 1} of ${sections.length}`}
          </div>

          {/* Stanza Lines */}
          <div className="space-y-4 font-serif-hymn text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-tight text-slate-50 drop-shadow-md">
            {currentSectionText
              .replace(/^chorus/i, '')
              .split('\n')
              .map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                const isSolo = trimmed.startsWith('Solo:');
                const isBass = trimmed.startsWith('Bass:');
                const isKulu = trimmed.startsWith('Kulu:');

                return (
                  <p
                    key={lIdx}
                    className={`${
                      isSolo
                        ? 'text-amber-300 font-semibold'
                        : isBass
                        ? 'text-blue-300 font-semibold'
                        : isKulu
                        ? 'text-emerald-300 font-bold'
                        : ''
                    }`}
                  >
                    {trimmed}
                  </p>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom Conductor & Navigation Controls */}
      <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
        {/* Previous / Next Slide buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSectionIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium transition-colors ${
              currentSectionIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-700 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous (←)</span>
          </button>

          <span className="text-sm font-mono text-slate-400">
            {currentSectionIndex + 1} / {sections.length}
          </span>

          <button
            onClick={() => setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1))}
            disabled={currentSectionIndex === sections.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium transition-colors ${
              currentSectionIndex === sections.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-700 text-white'
            }`}
          >
            <span>Next (→ / Space)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Accompaniment Audio Quick Play */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-300 font-medium">Accompaniment:</span>
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Music'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
