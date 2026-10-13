import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Music, Sliders, ChevronDown, Repeat, Radio } from 'lucide-react';
import { Hymn, InstrumentType } from '../types/hymn';
import { audioEngine, getAccompanimentForHymn } from '../utils/audioAccompaniment';

interface AudioPlayerBarProps {
  currentHymn: Hymn;
  theme: 'sepia' | 'dark' | 'light';
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ currentHymn, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [instrument, setInstrument] = useState<InstrumentType>('pipe_organ');
  const [tempo, setTempo] = useState<number>(88);
  const [transpose, setTranspose] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [loop, setLoop] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Live beat conductor indicators
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [currentChordLabel, setCurrentChordLabel] = useState<string>('');
  const [currentMeasure, setCurrentMeasure] = useState<number>(1);
  const [totalMeasures, setTotalMeasures] = useState<number>(1);

  // When hymn changes, reset and set recommended defaults
  useEffect(() => {
    audioEngine.stop();
    setIsPlaying(false);

    const pattern = getAccompanimentForHymn(currentHymn.id, currentHymn.key || currentHymn.reference);
    setTempo(pattern.defaultBpm);
    setTranspose(0);
    setCurrentChordLabel(pattern.name);
    setCurrentMeasure(1);
    setTotalMeasures(pattern.sequence.length);

    // Auto select Gospel Praise for lively Juba Arabic choruses if desired
    if (currentHymn.language === 'Juba Arabic') {
      setInstrument('gospel_praise');
    } else {
      setInstrument('pipe_organ');
    }

    return () => {
      audioEngine.stop();
    };
  }, [currentHymn.id]);

  useEffect(() => {
    audioEngine.setCallbacks(
      (beat, label, measure, total) => {
        setCurrentBeat(beat);
        setCurrentChordLabel(label);
        setCurrentMeasure(measure);
        setTotalMeasures(total);
      },
      () => {
        setIsPlaying(false);
      }
    );
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      const pattern = getAccompanimentForHymn(currentHymn.id, currentHymn.key || currentHymn.reference);
      const effectiveVol = isMuted ? 0 : volume;
      audioEngine.startAccompaniment(pattern, instrument, tempo, transpose, effectiveVol, loop);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    audioEngine.stop();
    const pattern = getAccompanimentForHymn(currentHymn.id, currentHymn.key || currentHymn.reference);
    const effectiveVol = isMuted ? 0 : volume;
    audioEngine.startAccompaniment(pattern, instrument, tempo, transpose, effectiveVol, loop);
    setIsPlaying(true);
  };

  const handleInstrumentChange = (newInst: InstrumentType) => {
    setInstrument(newInst);
    if (isPlaying) {
      audioEngine.stop();
      const pattern = getAccompanimentForHymn(currentHymn.id, currentHymn.key || currentHymn.reference);
      const effectiveVol = isMuted ? 0 : volume;
      audioEngine.startAccompaniment(pattern, newInst, tempo, transpose, effectiveVol, loop);
    }
  };

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);
    if (isPlaying) {
      audioEngine.stop();
      const pattern = getAccompanimentForHymn(currentHymn.id, currentHymn.key || currentHymn.reference);
      const effectiveVol = isMuted ? 0 : volume;
      audioEngine.startAccompaniment(pattern, instrument, newTempo, transpose, effectiveVol, loop);
    }
  };

  const handleTransposeChange = (newTranspose: number) => {
    setTranspose(newTranspose);
    if (isPlaying) {
      audioEngine.stop();
      const pattern = getAccompanimentForHymn(currentHymn.id, currentHymn.key || currentHymn.reference);
      const effectiveVol = isMuted ? 0 : volume;
      audioEngine.startAccompaniment(pattern, instrument, tempo, newTranspose, effectiveVol, loop);
    }
  };

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const containerBg = isDark
    ? 'bg-slate-900/95 border-slate-700/80 text-slate-100 shadow-xl'
    : isSepia
    ? 'bg-[#f5ebd7]/95 border-[#d6c4a5] text-[#3d2f1d] shadow-lg'
    : 'bg-white/95 border-amber-200/60 text-slate-800 shadow-lg';

  const badgeBg = isDark
    ? 'bg-slate-800 text-amber-400 border-slate-700'
    : isSepia
    ? 'bg-[#ede0c8] text-amber-900 border-[#d8c39e]'
    : 'bg-amber-50 text-amber-900 border-amber-200';

  return (
    <div className={`rounded-2xl border p-4 backdrop-blur-md transition-all ${containerBg}`}>
      {/* Top row: Track Info & Main Play Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md ${
              isPlaying
                ? 'bg-amber-600 text-white hover:bg-amber-700 ring-4 ring-amber-500/30'
                : 'bg-amber-700 text-white hover:bg-amber-800'
            }`}
            title={isPlaying ? 'Pause Accompaniment' : 'Play Accompaniment'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            className={`p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
              !isPlaying ? 'opacity-60' : ''
            }`}
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">
                {currentHymn.id > 0 ? `#${currentHymn.id}` : ''} {currentHymn.title}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${badgeBg}`}>
                {currentHymn.key || 'Key of C/F'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-75">
              <span>{currentChordLabel || 'Church Accompaniment'}</span>
              <span>•</span>
              <span>{tempo} BPM</span>
              {transpose !== 0 && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {transpose > 0 ? `+${transpose}` : transpose} semi
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Conductor Beat Visualizer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-mono font-medium">Beat:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(b => (
              <span
                key={b}
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold transition-all ${
                  isPlaying && currentBeat === b
                    ? 'bg-amber-500 text-white scale-125 shadow-sm shadow-amber-500/50'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 opacity-60'
                }`}
              >
                {b}
              </span>
            ))}
          </div>
          <span className="text-[11px] font-mono opacity-70 ml-1">
            {currentMeasure}/{totalMeasures}
          </span>
        </div>

        {/* Quick controls: Instrument and Settings Drawer Toggle */}
        <div className="flex items-center gap-2">
          {/* Instrument select */}
          <div className="relative">
            <select
              value={instrument}
              onChange={e => handleInstrumentChange(e.target.value as InstrumentType)}
              className={`text-xs font-medium py-1.5 pl-2.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${badgeBg}`}
            >
              <option value="pipe_organ">Pipe Organ (Cathedral)</option>
              <option value="grand_piano">Grand Piano (Warm)</option>
              <option value="gospel_praise">Gospel Praise & Shaker</option>
              <option value="celestial_bells">Celestial Bells & Chime</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {/* Loop toggle */}
          <button
            onClick={() => setLoop(!loop)}
            className={`p-2 rounded-lg transition-colors border ${
              loop
                ? 'bg-amber-600/10 border-amber-500/40 text-amber-700 dark:text-amber-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            title={loop ? 'Looping enabled (Plays continuously)' : 'Single playthrough'}
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-75 hover:opacity-100 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Settings collapse toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg border transition-colors ${
              showSettings
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                : 'border-transparent opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title="Tempo, Pitch Transpose & Volume Controls"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Accompaniment Settings Panel */}
      {showSettings && (
        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Tempo adjustment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center font-medium">
              <span>Tempo (Speed)</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">{tempo} BPM</span>
            </div>
            <input
              type="range"
              min="60"
              max="140"
              step="2"
              value={tempo}
              onChange={e => handleTempoChange(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] opacity-70">
              <button
                type="button"
                onClick={() => handleTempoChange(72)}
                className="hover:text-amber-600 underline cursor-pointer"
              >
                Slow (72)
              </button>
              <button
                type="button"
                onClick={() => handleTempoChange(88)}
                className="hover:text-amber-600 underline cursor-pointer"
              >
                Standard (88)
              </button>
              <button
                type="button"
                onClick={() => handleTempoChange(112)}
                className="hover:text-amber-600 underline cursor-pointer"
              >
                Joyful (112)
              </button>
            </div>
          </div>

          {/* Pitch transposition */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center font-medium">
              <span>Key Transposition (Congregational Range)</span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                {transpose === 0 ? 'Original Key' : transpose > 0 ? `+${transpose} Semitones` : `${transpose} Semitones`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTransposeChange(Math.max(-4, transpose - 1))}
                className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 font-bold"
              >
                -1
              </button>
              <input
                type="range"
                min="-4"
                max="4"
                step="1"
                value={transpose}
                onChange={e => handleTransposeChange(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <button
                onClick={() => handleTransposeChange(Math.min(4, transpose + 1))}
                className="px-2 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 font-bold"
              >
                +1
              </button>
              <button
                onClick={() => handleTransposeChange(0)}
                className="text-[10px] px-1.5 py-1 rounded border opacity-70 hover:opacity-100"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Volume adjustment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center font-medium">
              <span>Accompaniment Volume</span>
              <span className="font-mono">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="text-[10px] opacity-70">
              {instrument === 'gospel_praise'
                ? 'Includes authentic African gospel shakers & conga beats'
                : 'Sacred pipe organ harmonies for congregation singing'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
