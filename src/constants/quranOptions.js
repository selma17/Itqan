import quranData from '../data/quranData';

// Options pour BottomSheetSelect : sourates et hizbs.
export const SURAH_OPTIONS = quranData.surahs.map(surah => ({
  value: surah.number,
  label: surah.name,
  badge: surah.number,
  sub: `${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · ${surah.verses} آية`,
  meta: `ص ${surah.page}`,
}));

export const HIZB_COUNT = 60;

export const HIZB_OPTIONS = Array.from({ length: HIZB_COUNT }, (_, i) => ({
  value: i + 1,
  label: `الحزب ${i + 1}`,
  badge: i + 1,
}));
