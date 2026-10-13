export interface Hymn {
  id: number;
  title: string;
  lyrics: string;
  author?: string;
  is_featured?: boolean;
  reference?: string;
  language: 'Juba Arabic' | 'English' | 'Preface';
  category: string;
  key?: string;
}

export type ThemeMode = 'sepia' | 'dark' | 'light';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type InstrumentType = 'pipe_organ' | 'grand_piano' | 'gospel_praise' | 'celestial_bells';

export interface AudioSettings {
  instrument: InstrumentType;
  tempo: number; // BPM (60 - 150)
  transpose: number; // -4 to +4 semitones
  isPlaying: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
  loop: boolean;
}
