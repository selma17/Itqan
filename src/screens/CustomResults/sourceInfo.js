// Libellés décrivant la source d'un test personnalisé, calculés depuis rawData.

export const buildSurahNames = (rawData) => {
  const names = {};
  rawData.forEach(verse => {
    if (!names[verse.sura_no]) names[verse.sura_no] = verse.sura_name_ar;
  });
  return names;
};

export const getHizbLabel = (rawData, hizbNumber) => {
  const verses = rawData.filter(v => v.hizb === hizbNumber);
  if (verses.length === 0) return `حزب ${hizbNumber}`;

  const first = verses[0].sura_name_ar;
  const last = verses[verses.length - 1].sura_name_ar;
  return first === last ? first : `${first} - ${last}`;
};

export const getPageSurahs = (rawData, pageNumber) => [
  ...new Set(rawData.filter(v => parseInt(v.page, 10) === pageNumber).map(v => v.sura_name_ar)),
];

export const getPerformance = (percentage, colors) => {
  if (percentage >= 90) {
    return { emoji: '🌟', title: 'ممتاز!', message: 'أداء رائع! حفظك متقن بإذن الله', color: colors.success };
  }
  if (percentage >= 70) {
    return { emoji: '👍', title: 'جيد جداً!', message: 'أداء جيد، استمر في المراجعة', color: colors.primary };
  }
  if (percentage >= 50) {
    return { emoji: '📖', title: 'جيد', message: 'تحتاج المزيد من المراجعة', color: colors.secondary };
  }
  return { emoji: '💪', title: 'استمر!', message: 'راجع حفظك وحاول مرة أخرى', color: colors.error };
};
