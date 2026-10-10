// Construction de la liste des versets d'un test à partir de quranData.
// Tous les versets sont normalisés : { surahNumber, surahName, verseNumber, text, page, juz }.

const toTestVerse = (v, fallbackPage) => ({
  surahNumber: v.surahNumber,
  surahName: v.surahName,
  verseNumber: v.verseNumber,
  text: v.text,
  page: v.page || fallbackPage,
  juz: v.juz,
});

export const getSurahVerses = (quranData, surahNumber) =>
  (quranData.versesDetailed[surahNumber] || []).map(v => ({
    surahNumber,
    surahName: quranData.getSurahName(surahNumber),
    verseNumber: v.number,
    text: v.text,
    page: v.page,
    juz: v.juz,
  }));

export const getPageRangeVerses = (quranData, from, to) => {
  const verses = [];
  for (let page = from; page <= to; page++) {
    (quranData.getVersesByPage(page) || []).forEach(v => verses.push(toTestVerse(v, page)));
  }
  return verses;
};

export const getHizbRangeVerses = (quranData, from, to = from) => {
  const verses = [];
  for (let hizb = from; hizb <= to; hizb++) {
    (quranData.getVersesByHizb(hizb) || []).forEach(v => verses.push(toTestVerse(v)));
  }
  return verses;
};

// Versets d'un test standard (surah / pages / Hizb / GeneralPart).
export const getTestVerses = (quranData, params) => {
  const { testType, surahNumber, pageFrom, pageTo, hizbNumber, hizbFrom, hizbTo } = params;
  switch (testType) {
    case 'surah':
      return getSurahVerses(quranData, surahNumber);
    case 'pages':
      return getPageRangeVerses(quranData, pageFrom, pageTo);
    case 'Hizb':
      return getHizbRangeVerses(quranData, hizbNumber);
    case 'GeneralPart':
      return getHizbRangeVerses(quranData, hizbFrom, hizbTo);
    default:
      return [];
  }
};

// Versets d'un test personnalisé (plusieurs sourates / plages de pages / hizbs).
export const getCustomTestVerses = (quranData, { sourceType, selectedSurahs, pageRanges, selectedHizbs }) => {
  switch (sourceType) {
    case 'surahs':
      return selectedSurahs.flatMap(n => getSurahVerses(quranData, n));
    case 'pages':
      return pageRanges.flatMap(r => getPageRangeVerses(quranData, parseInt(r.from, 10), parseInt(r.to, 10)));
    case 'hizbs':
      return selectedHizbs.flatMap(h => getHizbRangeVerses(quranData, h));
    default:
      return [];
  }
};

export const sortByMushafOrder = (verses) =>
  [...verses].sort((a, b) =>
    a.surahNumber !== b.surahNumber ? a.surahNumber - b.surahNumber : a.verseNumber - b.verseNumber
  );

export const getVerseKey = (verse) => `${verse.surahNumber}-${verse.verseNumber}`;

export const isSameVerse =(a, b) => a.surahNumber === b.surahNumber && a.verseNumber === b.verseNumber;

// Verset précédent (-1) ou suivant (+1) dans la liste, en vérifiant la continuité.
// Retourne { verse } si trouvé, { boundary: true } si on est au bord de la liste, {} sinon.
export const getAdjacentVerse = (verses, current, direction) => {
  const index = verses.findIndex(v => isSameVerse(v, current));

  if (direction < 0) {
    if (index <= 0) return { boundary: true };
    const prev = verses[index - 1];
    const continuous = prev.surahNumber === current.surahNumber
      ? prev.verseNumber === current.verseNumber - 1
      : prev.surahNumber === current.surahNumber - 1 && current.verseNumber === 1;
    return continuous ? { verse: prev } : {};
  }

  if (index >= verses.length - 1) return { boundary: true };
  const next = verses[index + 1];
  const continuous = next.surahNumber === current.surahNumber
    ? next.verseNumber === current.verseNumber + 1
    : next.surahNumber === current.surahNumber + 1 && next.verseNumber === 1;
  return continuous ? { verse: next } : {};
};
