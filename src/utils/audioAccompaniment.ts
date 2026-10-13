import { InstrumentType } from '../types/hymn';

// Note frequencies in Hz (A4 = 440Hz)
const NOTE_FREQS: Record<string, number> = {
  'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
  'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
  'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
  'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

export interface ChordNote {
  chord: string[]; // List of note names, e.g. ['C3', 'E4', 'G4', 'C5']
  duration: number; // in beats (1 = 1 beat, 2 = 2 beats)
  label?: string;
}

export interface AccompanimentPattern {
  name: string;
  meter: 3 | 4;
  defaultBpm: number;
  sequence: ChordNote[];
}

// Famous hymn chord sequences
export const HYMN_SEQUENCES: Record<number, AccompanimentPattern> = {
  // #395 AMAZING GRACE (3/4 Time)
  395: {
    name: 'Amazing Grace',
    meter: 3,
    defaultBpm: 76,
    sequence: [
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 3, label: 'G (Amazing grace)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 3, label: 'G (how sweet)' },
      { chord: ['C3', 'E4', 'G4', 'C5'], duration: 3, label: 'C (the sound)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 3, label: 'G (that saved)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 3, label: 'G (a wretch)' },
      { chord: ['E3', 'G3', 'B3', 'E4'], duration: 3, label: 'Em (like me)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 3, label: 'D (I once was)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 3, label: 'D7 (lost)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 3, label: 'G (but now)' },
      { chord: ['C3', 'E4', 'G4', 'C5'], duration: 3, label: 'C (am found)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 3, label: 'G (was blind)' },
      { chord: ['D3', 'F#3', 'C4', 'D4'], duration: 3, label: 'D7 (but now)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 6, label: 'G (I see)' },
    ]
  },
  // #366 WHAT A FRIEND WE HAVE IN JESUS
  366: {
    name: 'What a Friend We Have in Jesus',
    meter: 4,
    defaultBpm: 84,
    sequence: [
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (What a friend)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (we have in Jesus)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (All our sins)' },
      { chord: ['C3', 'G3', 'C4', 'E4'], duration: 4, label: 'C7 (and griefs to bear)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (What a privilege)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (to carry)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 2, label: 'F (Everything)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 2, label: 'C (to God)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (in prayer)' },
    ]
  },
  // #371 BLESSED ASSURANCE
  371: {
    name: 'Blessed Assurance',
    meter: 4,
    defaultBpm: 92,
    sequence: [
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (Blessed assurance)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (Jesus is mine)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (O what a foretaste)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 4, label: 'A7 (of glory divine)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (Heir of salvation)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (purchase of God)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 2, label: 'D (Born of His)' },
      { chord: ['A3', 'C#4', 'E4', 'G4'], duration: 2, label: 'A7 (Spirit)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (washed in His blood)' },
      // Chorus
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (This is my story)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (this is my song)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 2, label: 'D (Praising my)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 2, label: 'A (Saviour)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (all the day long)' },
    ]
  },
  // #546 DOXOLOGY (Old Hundredth)
  546: {
    name: 'Praise God from Whom All Blessings Flow',
    meter: 4,
    defaultBpm: 68,
    sequence: [
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (Praise God)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (from whom all)' },
      { chord: ['E3', 'G3', 'B3', 'E4'], duration: 4, label: 'Em (blessings flow)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (Praise Him)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (all creatures)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (here below)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (Praise Him above)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (ye heavenly host)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 2, label: 'G (Praise Father)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 2, label: 'D (Son and)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (Holy Ghost)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (A-)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (-men)' },
    ]
  },
  // #362 I HAVE DECIDED TO FOLLOW JESUS
  362: {
    name: 'I Have Decided to Follow Jesus',
    meter: 4,
    defaultBpm: 96,
    sequence: [
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (I have decided)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (to follow Jesus)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (I have decided)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (to follow Jesus)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (I have decided)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (to follow Jesus)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 2, label: 'C (No turning back)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 2, label: 'G (no turning back)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C' },
    ]
  },
  // #414 WE HAVE THIS HOPE (Official SDA Anthem)
  414: {
    name: 'We Have This Hope',
    meter: 4,
    defaultBpm: 88,
    sequence: [
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (We have this hope)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (that burns within)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (our hearts)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (Hope in the coming)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (of the Lord)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (We have this faith)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (that Christ alone)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (imparts)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (Hallelujah! Christ is King!)' },
    ]
  },
  // #502 JESUS LOVES ME
  502: {
    name: 'Jesus Loves Me',
    meter: 4,
    defaultBpm: 88,
    sequence: [
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (Jesus loves me)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (this I know)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (For the Bible)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (tells me so)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (Little ones to Him belong)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 2, label: 'F (They are weak)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 2, label: 'C (but He is strong)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 2, label: 'G' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 2, label: 'C' },
    ]
  },
  // #510 IT IS WELL WITH MY SOUL
  510: {
    name: 'It Is Well With My Soul',
    meter: 4,
    defaultBpm: 80,
    sequence: [
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (When peace like a river)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (attendeth my way)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (When sorrows)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (like sea billows roll)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (Whatever my lot)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 2, label: 'F (Thou hast taught)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 2, label: 'C (me to say)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (It is well)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (it is well with my soul)' },
    ]
  },
  // #499 HOLY, HOLY, HOLY
  499: {
    name: 'Holy, Holy, Holy',
    meter: 4,
    defaultBpm: 76,
    sequence: [
      { chord: ['Eb3', 'G3', 'Bb3', 'Eb4'], duration: 4, label: 'Eb (Holy, Holy, Holy)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (Lord God Almighty)' },
      { chord: ['Eb3', 'G3', 'Bb3', 'Eb4'], duration: 4, label: 'Eb (Early in the morning)' },
      { chord: ['Ab3', 'C4', 'Eb4', 'Ab4'], duration: 2, label: 'Ab (our song)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 2, label: 'Bb (shall rise)' },
      { chord: ['Eb3', 'G3', 'Bb3', 'Eb4'], duration: 4, label: 'Eb (to Thee)' },
    ]
  },
  // #480 NEARER, MY GOD, TO THEE
  480: {
    name: 'Nearer, My God, to Thee',
    meter: 4,
    defaultBpm: 72,
    sequence: [
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (Nearer my God to Thee)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (Nearer to Thee)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (E\'en though it be a cross)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (that raiseth me)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (Still all my song shall be)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 2, label: 'Bb (Nearer my God)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 2, label: 'C (to Thee)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F' },
    ]
  },
  // #498 ABIDE WITH ME
  498: {
    name: 'Abide With Me',
    meter: 4,
    defaultBpm: 68,
    sequence: [
      { chord: ['Eb3', 'G3', 'Bb3', 'Eb4'], duration: 4, label: 'Eb (Abide with me)' },
      { chord: ['Ab3', 'C4', 'Eb4', 'Ab4'], duration: 4, label: 'Ab (fast falls the eventide)' },
      { chord: ['Eb3', 'G3', 'Bb3', 'Eb4'], duration: 4, label: 'Eb (The darkness deepens)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (Lord with me abide)' },
      { chord: ['Eb3', 'G3', 'Bb3', 'Eb4'], duration: 4, label: 'Eb (When other helpers fail)' },
      { chord: ['Ab3', 'C4', 'Eb4', 'Ab4'], duration: 2, label: 'Ab (and comforts flee)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 2, label: 'Bb (Help of the helpless)' },
      { chord: ['Eb3', 'G3', 'Bb3', 'Eb4'], duration: 4, label: 'Eb (O abide with me)' },
    ]
  },
  // #1 NINA WODI LE RABUNA (Joyful Juba Arabic praise song in E Maj)
  1: {
    name: 'Nina Wodi Le Rabuna (E Major)',
    meter: 4,
    defaultBpm: 104,
    sequence: [
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (Nina wodi le Rabuna)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 4, label: 'A (shukuran)' },
      { chord: ['B3', 'D#4', 'F#4', 'B4'], duration: 4, label: 'B (Nina wodi Shukuran)' },
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (le Allah)' },
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (Nina wodi le Rabuna)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 2, label: 'A (shukuran)' },
      { chord: ['B3', 'D#4', 'F#4', 'B4'], duration: 2, label: 'B (Nina guna)' },
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (Halleluya!)' },
      // Chorus
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (Makasutu mala!)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 4, label: 'A (fii guluub ta Nina)' },
      { chord: ['B3', 'D#4', 'F#4', 'B4'], duration: 4, label: 'B (Nina guna halleluya!)' },
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E' },
    ]
  },
  // #2 RABUNA KAN RASUL (F# Major)
  2: {
    name: 'Rabuna Kan Rasul (F# Major)',
    meter: 4,
    defaultBpm: 100,
    sequence: [
      { chord: ['F#3', 'A#3', 'C#4', 'F#4'], duration: 4, label: 'F# (Rabuna kan rasulu)' },
      { chord: ['B3', 'D#4', 'F#4', 'B4'], duration: 4, label: 'B (Yesu al Messiah)' },
      { chord: ['C#3', 'E#3', 'G#3', 'C#4'], duration: 4, label: 'C# (Huwo ja hina fii dunia)' },
      { chord: ['F#3', 'A#3', 'C#4', 'F#4'], duration: 4, label: 'F# (Nina nofudu mini mutu)' },
      // Chorus
      { chord: ['B3', 'D#4', 'F#4', 'B4'], duration: 4, label: 'B (Yesua, Yesua)' },
      { chord: ['F#3', 'A#3', 'C#4', 'F#4'], duration: 4, label: 'F# (Messiah ja)' },
      { chord: ['C#3', 'E#3', 'G#3', 'C#4'], duration: 4, label: 'C# (wodi geliba le Yesu)' },
      { chord: ['F#3', 'A#3', 'C#4', 'F#4'], duration: 4, label: 'F# (Inta bi kunu fii Samaa)' },
    ]
  },
  // #19 INTA WOGIF GOWI (E Major)
  19: {
    name: 'Inta Wogif Gowi (E Major)',
    meter: 4,
    defaultBpm: 106,
    sequence: [
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (Inta wogifu gowi)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 4, label: 'A (le Yesua)' },
      { chord: ['B3', 'D#4', 'F#4', 'B4'], duration: 4, label: 'B (Inta bi ligo hayaa)' },
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (wa kulasa)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 4, label: 'A (Yesu bi raja tani)' },
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E (fi dunia)' },
      { chord: ['B3', 'D#4', 'F#4', 'B4'], duration: 4, label: 'B (Wodi kulasa le nas al rudu)' },
      { chord: ['E3', 'G#3', 'B3', 'E4'], duration: 4, label: 'E' },
    ]
  },
  // #72 SHABAAB BI GUNA
  72: {
    name: 'Shabaab Bi Guna (African Praise Chorus)',
    meter: 4,
    defaultBpm: 112,
    sequence: [
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (Shabaabu bi guna)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (guna bitoum)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (Lel abad lel abadiya)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (fii samaa)' },
      { chord: ['Bb3', 'D4', 'F4', 'Bb4'], duration: 4, label: 'Bb (Lela bad sei)' },
      { chord: ['C3', 'E3', 'G3', 'C4'], duration: 4, label: 'C (lel abad)' },
      { chord: ['F3', 'A3', 'C4', 'F4'], duration: 4, label: 'F (fii samaa)' },
    ]
  },
  // #170 SALAAM SALAAM
  170: {
    name: 'Salaam Salaam (Moses Wani)',
    meter: 4,
    defaultBpm: 104,
    sequence: [
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (Salaam... Salaamu)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (Salaam ta nina)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 4, label: 'A (fi Rabi Yesu)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (Jena ta Allah)' },
      { chord: ['G3', 'B3', 'D4', 'G4'], duration: 4, label: 'G (Rabi Yesu timu)' },
      { chord: ['A3', 'C#4', 'E4', 'A4'], duration: 4, label: 'A (Yesu timu)' },
      { chord: ['D3', 'F#3', 'A3', 'D4'], duration: 4, label: 'D (timu le nina)' },
    ]
  }
};

// Generic fallback progressions based on key and musical character
export function getAccompanimentForHymn(hymnId: number, keyHint?: string): AccompanimentPattern {
  if (HYMN_SEQUENCES[hymnId]) {
    return HYMN_SEQUENCES[hymnId];
  }

  // Determine root key
  let root = 'C';
  let defaultBpm = 86;
  let isPraiseFast = hymnId <= 360; // Juba Arabic songs often have lively congregational tempo

  if (keyHint) {
    const cleanKey = keyHint.replace(/;/g, '').trim();
    if (cleanKey.includes('F#')) root = 'F#';
    else if (cleanKey.includes('Eb')) root = 'Eb';
    else if (cleanKey.includes('Gb')) root = 'Gb';
    else if (cleanKey.includes('Bb')) root = 'Bb';
    else if (cleanKey.includes('Db')) root = 'Db';
    else if (cleanKey.includes('Ab')) root = 'Ab';
    else if (cleanKey.includes('D')) root = 'D';
    else if (cleanKey.includes('E')) root = 'E';
    else if (cleanKey.includes('F')) root = 'F';
    else if (cleanKey.includes('G')) root = 'G';
    else if (cleanKey.includes('A')) root = 'A';
    else if (cleanKey.includes('B')) root = 'B';
  } else if (hymnId % 5 === 0) {
    root = 'G';
  } else if (hymnId % 3 === 0) {
    root = 'F';
  } else if (hymnId % 2 === 0) {
    root = 'D';
  } else {
    root = 'Eb';
  }

  if (isPraiseFast) {
    defaultBpm = 98;
  }

  // Build standard 8-measure church praise progression: I - IV - I - V - I - IV - V7 - I
  const majorChords: Record<string, { I: string[]; IV: string[]; V: string[]; vi: string[] }> = {
    'C': {
      I: ['C3', 'E3', 'G3', 'C4'],
      IV: ['F3', 'A3', 'C4', 'F4'],
      V: ['G3', 'B3', 'D4', 'G4'],
      vi: ['A3', 'C4', 'E4', 'A4']
    },
    'D': {
      I: ['D3', 'F#3', 'A3', 'D4'],
      IV: ['G3', 'B3', 'D4', 'G4'],
      V: ['A3', 'C#4', 'E4', 'A4'],
      vi: ['B3', 'D4', 'F#4', 'B4']
    },
    'E': {
      I: ['E3', 'G#3', 'B3', 'E4'],
      IV: ['A3', 'C#4', 'E4', 'A4'],
      V: ['B3', 'D#4', 'F#4', 'B4'],
      vi: ['C#4', 'E4', 'G#4', 'C#5']
    },
    'F': {
      I: ['F3', 'A3', 'C4', 'F4'],
      IV: ['Bb3', 'D4', 'F4', 'Bb4'],
      V: ['C3', 'E3', 'G3', 'C4'],
      vi: ['D3', 'F3', 'A3', 'D4']
    },
    'F#': {
      I: ['F#3', 'A#3', 'C#4', 'F#4'],
      IV: ['B3', 'D#4', 'F#4', 'B4'],
      V: ['C#3', 'E#3', 'G#3', 'C#4'],
      vi: ['D#3', 'F#3', 'A#3', 'D#4']
    },
    'G': {
      I: ['G3', 'B3', 'D4', 'G4'],
      IV: ['C3', 'E3', 'G3', 'C4'],
      V: ['D3', 'F#3', 'A3', 'D4'],
      vi: ['E3', 'G3', 'B3', 'E4']
    },
    'Ab': {
      I: ['Ab3', 'C4', 'Eb4', 'Ab4'],
      IV: ['Db3', 'F3', 'Ab3', 'Db4'],
      V: ['Eb3', 'G3', 'Bb3', 'Eb4'],
      vi: ['F3', 'Ab3', 'C4', 'F4']
    },
    'Bb': {
      I: ['Bb3', 'D4', 'F4', 'Bb4'],
      IV: ['Eb3', 'G3', 'Bb3', 'Eb4'],
      V: ['F3', 'A3', 'C4', 'F4'],
      vi: ['G3', 'Bb3', 'D4', 'G4']
    },
    'Eb': {
      I: ['Eb3', 'G3', 'Bb3', 'Eb4'],
      IV: ['Ab3', 'C4', 'Eb4', 'Ab4'],
      V: ['Bb3', 'D4', 'F4', 'Bb4'],
      vi: ['C3', 'Eb3', 'G3', 'C4']
    }
  };

  const chords = majorChords[root] || majorChords['F'];

  return {
    name: `${root} Major Standard Accompaniment`,
    meter: 4,
    defaultBpm,
    sequence: [
      { chord: chords.I, duration: 4, label: `${root} (Verse)` },
      { chord: chords.IV, duration: 4, label: 'Subdominant' },
      { chord: chords.I, duration: 4, label: 'Tonic' },
      { chord: chords.V, duration: 4, label: 'Dominant' },
      { chord: chords.I, duration: 4, label: `${root} (Chorus)` },
      { chord: chords.IV, duration: 4, label: 'Subdominant' },
      { chord: chords.vi, duration: 2, label: 'Relative Minor' },
      { chord: chords.V, duration: 2, label: 'Dominant' },
      { chord: chords.I, duration: 4, label: 'Amen Resolution' }
    ]
  };
}

// Synthesizer Engine
class HymnAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private currentStep = 0;
  private timerId: any = null;
  private activeNodes: { oscs: OscillatorNode[]; gains: GainNode[] }[] = [];
  private onBeatCallback: ((beat: number, chordLabel: string, measureIndex: number, totalMeasures: number) => void) | null = null;
  private onStopCallback: (() => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCallbacks(
    onBeat: (beat: number, chordLabel: string, measureIndex: number, totalMeasures: number) => void,
    onStop: () => void
  ) {
    this.onBeatCallback = onBeat;
    this.onStopCallback = onStop;
  }

  // Transpose helper
  private getTransposedFrequency(noteName: string, semitones: number): number {
    const baseFreq = NOTE_FREQS[noteName];
    if (!baseFreq) return 440;
    return baseFreq * Math.pow(2, semitones / 12);
  }

  // Play a percussion beat for African Gospel Praise mode
  private playPercussion(beat: number, volume: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Bass Drum / Conga low on beat 1 and 3
    if (beat === 1 || beat === 3) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.35 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    // Shaker / Hi-hat on every beat (accents on 2 & 4 for gospel clapping vibe!)
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;

    const noiseGain = this.ctx.createGain();
    const noiseVol = (beat === 2 || beat === 4 ? 0.22 : 0.12) * volume;
    noiseGain.gain.setValueAtTime(noiseVol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.05);
  }

  // Synthesize chord sound for Pipe Organ / Piano / Bells
  private playChord(
    chord: string[],
    durationSeconds: number,
    instrument: InstrumentType,
    transpose: number,
    volume: number
  ) {
    if (!this.ctx || volume <= 0) return;
    const now = this.ctx.currentTime;

    chord.forEach((noteName, idx) => {
      const freq = this.getTransposedFrequency(noteName, transpose);
      if (!freq || !this.ctx) return;

      const masterGain = this.ctx.createGain();
      masterGain.connect(this.ctx.destination);

      const oscs: OscillatorNode[] = [];
      const gains: GainNode[] = [];

      if (instrument === 'pipe_organ' || instrument === 'gospel_praise') {
        // Church Pipe Organ: Full SATB harmonic ranks with diapason 8', flute 4', reed 2'
        const harmonics = [
          { mult: 1, type: 'sine' as OscillatorType, vol: 0.4 },
          { mult: 1, detune: 6, type: 'triangle' as OscillatorType, vol: 0.35 },
          { mult: 2, type: 'sine' as OscillatorType, vol: 0.25 },
          { mult: 3, type: 'sine' as OscillatorType, vol: 0.12 },
          { mult: 4, type: 'triangle' as OscillatorType, vol: 0.08 }
        ];

        // Bass pedal octave boost for lowest note
        if (idx === 0) {
          harmonics.push({ mult: 0.5, type: 'sine' as OscillatorType, vol: 0.5 });
        }

        harmonics.forEach(h => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();

          osc.type = h.type;
          osc.frequency.setValueAtTime(freq * h.mult, now);
          if (h.detune) osc.detune.setValueAtTime(h.detune, now);

          g.gain.setValueAtTime(h.vol, now);
          osc.connect(g);
          g.connect(masterGain);

          osc.start(now);
          osc.stop(now + durationSeconds + 0.35);

          oscs.push(osc);
          gains.push(g);
        });

        // Organ envelope: gentle attack, sustained chord, cathedral release
        const attack = 0.05;
        const release = 0.35;
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.35 * volume, now + attack);
        masterGain.gain.setValueAtTime(0.32 * volume, now + durationSeconds - 0.05);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds + release);

      } else if (instrument === 'grand_piano') {
        // Acoustic Grand Piano: percussive hammer strike with harmonic decay
        const osc = this.ctx.createOscillator();
        const oscHarmonic = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(freq * 2, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2500, now);
        filter.frequency.exponentialRampToValueAtTime(450, now + durationSeconds);

        osc.connect(filter);
        oscHarmonic.connect(filter);
        filter.connect(masterGain);

        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.42 * volume, now + 0.01);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds * 0.95);

        osc.start(now);
        oscHarmonic.start(now);
        osc.stop(now + durationSeconds);
        oscHarmonic.stop(now + durationSeconds);

        oscs.push(osc, oscHarmonic);

      } else {
        // Celestial Bells: FM Synthesis with chiming resonance
        const carrier = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();

        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(freq, now);

        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(freq * 2.76, now); // Bell harmonic ratio
        modGain.gain.setValueAtTime(freq * 1.5, now);
        modGain.gain.exponentialRampToValueAtTime(1, now + durationSeconds);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(masterGain);

        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.3 * volume, now + 0.015);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds + 0.2);

        carrier.start(now);
        modulator.start(now);
        carrier.stop(now + durationSeconds + 0.25);
        modulator.stop(now + durationSeconds + 0.25);

        oscs.push(carrier, modulator);
      }

      this.activeNodes.push({ oscs, gains });
    });
  }

  // Play a full accompaniment
  public startAccompaniment(
    pattern: AccompanimentPattern,
    instrument: InstrumentType,
    tempoBpm: number,
    transpose: number,
    volume: number,
    loop: boolean
  ) {
    this.stop();
    this.initContext();
    this.isRunning = true;

    const beatDurationSec = 60 / tempoBpm;
    let measureIndex = 0;
    const totalMeasures = pattern.sequence.length;

    const scheduleStep = () => {
      if (!this.isRunning) return;

      const current = pattern.sequence[measureIndex];
      const stepDurationSec = current.duration * beatDurationSec;

      // Play chord
      this.playChord(current.chord, stepDurationSec, instrument, transpose, volume);

      // Metronome and beat animation
      let beatCounter = 1;
      const beatInterval = (stepDurationSec * 1000) / current.duration;

      const triggerBeat = () => {
        if (!this.isRunning) return;
        if (this.onBeatCallback) {
          this.onBeatCallback(beatCounter, current.label || pattern.name, measureIndex + 1, totalMeasures);
        }
        if (instrument === 'gospel_praise') {
          this.playPercussion(beatCounter, volume);
        }
        beatCounter++;
      };

      triggerBeat();
      const beatTimer = setInterval(() => {
        if (beatCounter <= current.duration && this.isRunning) {
          triggerBeat();
        } else {
          clearInterval(beatTimer);
        }
      }, beatInterval);

      // Advance to next chord
      measureIndex++;
      if (measureIndex >= pattern.sequence.length) {
        if (loop) {
          measureIndex = 0;
          this.timerId = setTimeout(scheduleStep, stepDurationSec * 1000);
        } else {
          this.timerId = setTimeout(() => {
            this.stop();
            if (this.onStopCallback) this.onStopCallback();
          }, stepDurationSec * 1000);
        }
      } else {
        this.timerId = setTimeout(scheduleStep, stepDurationSec * 1000);
      }
    };

    scheduleStep();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.activeNodes.forEach(nodeGroup => {
      nodeGroup.oscs.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      });
      nodeGroup.gains.forEach(g => {
        try {
          g.disconnect();
        } catch (_) {}
      });
    });
    this.activeNodes = [];
  }

  public getIsRunning() {
    return this.isRunning;
  }
}

export const audioEngine = new HymnAudioEngine();
