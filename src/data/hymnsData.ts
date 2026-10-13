import hymnsRaw from './hymns.json';
import { Hymn } from '../types/hymn';

export const hymns: Hymn[] = hymnsRaw as Hymn[];

export const CATEGORIES = [
  'All',
  'Sabbath (Sebit)',
  'Second Coming (Maji al-Messiah)',
  'Praise & Thanksgiving (Shukuran)',
  'The Cross & Redemption (Seliib)',
  'Prayer & Worship (Salaa)',
  'Youth & Mission (Shabaab)',
  'Heaven & Hope (Samaa)',
  'Doxology & Service (Kenisa)'
];

export const SDAH_HYMNS = hymns.filter(h => h.reference && h.reference.includes('SDAH'));
export const JUBA_ARABIC_HYMNS = hymns.filter(h => h.language === 'Juba Arabic');
export const ENGLISH_HYMNS = hymns.filter(h => h.language === 'English');

export function getHymnById(id: number): Hymn | undefined {
  return hymns.find(h => h.id === id);
}
