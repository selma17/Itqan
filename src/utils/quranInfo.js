// Calculs d'information sur un ensemble de versets (hizb, parties du Coran...).

const summarizeVerses = (verses) => {
  if (!verses.length) return null;

  const pages = verses.map(v => parseInt(v.page, 10)).filter(p => !isNaN(p));
  if (!pages.length) return null;

  const startPage = Math.min(...pages);
  const endPage = Math.max(...pages);

  const surahsMap = new Map();
  verses.forEach(v => {
    if (v.sura_no && v.sura_name_ar) {
      surahsMap.set(v.sura_no, { number: v.sura_no, name: v.sura_name_ar });
    }
  });
  const surahs = Array.from(surahsMap.values()).sort((a, b) => a.number - b.number);

  return {
    startPage,
    endPage,
    totalPages: endPage - startPage + 1,
    totalVerses: verses.length,
    surahs,
  };
};

export const getHizbRangeInfo = (rawData, hizbFrom, hizbTo = hizbFrom) => {
  if (!Array.isArray(rawData)) return null;
  const verses = rawData.filter(
    item => item.hizb !== undefined && item.hizb >= hizbFrom && item.hizb <= hizbTo
  );
  return summarizeVerses(verses);
};
