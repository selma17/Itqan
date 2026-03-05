import qaloonQuran from './qaloonQuran.json';

const groupBySurah = (ayahs) => {
  const surahs = {};
  
  ayahs.forEach(ayah => {
    const surahNum = ayah.sura_no;
    
    if (!surahs[surahNum]) {
      surahs[surahNum] = {
        number: surahNum,
        name: ayah.sura_name_ar,
        nameEn: ayah.sura_name_en,
        verses: [],
        firstPage: ayah.page,
        firstJuz: ayah.jozz,
      };
    }
    
    surahs[surahNum].verses.push({
      number: ayah.aya_no,
      text: ayah.aya_text,
      page: ayah.page,
      juz: ayah.jozz,
      lineStart: ayah.line_start,
      lineEnd: ayah.line_end,
    });
  });
  
  return Object.values(surahs);
};

const groupByPage = (ayahs) => {
  const pages = {};
  
  ayahs.forEach(ayah => {
    const pageNum = parseInt(ayah.page);
    
    if (!pages[pageNum]) {
      pages[pageNum] = [];
    }
    
    pages[pageNum].push({
      surahNumber: ayah.sura_no,
      surahName: ayah.sura_name_ar,
      verseNumber: ayah.aya_no,
      text: ayah.aya_text,
      juz: ayah.jozz,
      lineStart: ayah.line_start,
      lineEnd: ayah.line_end,
    });
  });
  
  return pages;
};

const groupByHizb = (ayahs) => {
  const hizbs = {};
  
  ayahs.forEach(ayah => {
    const hizbNum = ayah.hizb;
    
    if (!hizbs[hizbNum]) {
      hizbs[hizbNum] = [];
    }
    
    hizbs[hizbNum].push({
      surahNumber: ayah.sura_no,
      surahName: ayah.sura_name_ar,
      verseNumber: ayah.aya_no,
      text: ayah.aya_text,
      juz: ayah.jozz,
      page: ayah.page,
      lineStart: ayah.line_start,
      lineEnd: ayah.line_end,
    });
  });
  
  return hizbs;
};

const surahsData = groupBySurah(qaloonQuran);
const pagesData = groupByPage(qaloonQuran);
const hizbsData = groupByHizb(qaloonQuran);

const getRevelationType = (surahNumber) => {
  const medinanSurahs = [2, 3, 4, 5, 8, 9, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 110];
  return medinanSurahs.includes(surahNumber) ? 'Medinan' : 'Meccan';
};

export const quranData = {
  surahs: surahsData.map(surah => ({
    number: surah.number,
    name: surah.name,
    nameEn: surah.nameEn,
    verses: surah.verses.length,
    page: parseInt(surah.firstPage),
    juz: surah.firstJuz,
    revelationType: getRevelationType(surah.number),
  })),

  verses: surahsData.reduce((acc, surah) => {
    acc[surah.number] = surah.verses.map(v => v.text);
    return acc;
  }, {}),

  versesDetailed: surahsData.reduce((acc, surah) => {
    acc[surah.number] = surah.verses;
    return acc;
  }, {}),

  pageVerses: pagesData,

  sampleVerses: surahsData.reduce((acc, surah) => {
    acc[surah.number] = surah.verses.map(v => v.text);
    return acc;
  }, {}),

  getSurahName: (number) => {
    const surah = quranData.surahs.find(s => s.number === number);
    return surah ? surah.name : 'سورة غير معروفة';
  },

  getSurahVersesCount: (number) => {
    const surah = quranData.surahs.find(s => s.number === number);
    return surah ? surah.verses : 0;
  },

  getVersesByPage: (pageNumber) => {
    return pagesData[pageNumber] || [];
  },

  getVerseText: (surahNumber, verseNumber) => {
    const verses = quranData.versesDetailed[surahNumber];
    if (!verses) return null;
    const verse = verses.find(v => v.number === verseNumber);
    return verse ? verse.text : null;
  },

  getSurahsByPageRange: (pageFrom, pageTo) => {
    const surahsInRange = new Set();
    
    for (let page = pageFrom; page <= pageTo; page++) {
      const verses = pagesData[page];
      if (verses) {
        verses.forEach(v => surahsInRange.add(v.surahNumber));
      }
    }
    
    return Array.from(surahsInRange).sort((a, b) => a - b);
  },

  getRandomVerseFromPage: (pageNumber) => {
    const verses = pagesData[pageNumber];
    if (!verses || verses.length === 0) return null;
    const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random();
    const randomIndex = Math.floor(randomValue * verses.length);
    return verses[randomIndex];
  },

  getRandomVerseFromSurah: (surahNumber) => {
    const verses = quranData.versesDetailed[surahNumber];
    if (!verses || verses.length === 0) return null;
    const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random();
    const randomIndex = Math.floor(randomValue * verses.length);
    return verses[randomIndex];
  },

  getRandomVerseFromPageRange: (pageFrom, pageTo) => {
    const allVerses = [];
    for (let page = pageFrom; page <= pageTo; page++) {
      const versesInPage = pagesData[page];
      if (versesInPage && versesInPage.length > 0) {
        allVerses.push(...versesInPage);
      }
    }
    
    if (allVerses.length === 0) return null;
    
    const shuffled = [...allVerses];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
        ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
        : Math.random();
      const j = Math.floor(randomValue * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const finalRandomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random();
    return shuffled[Math.floor(finalRandomValue * shuffled.length)];
  },

  hizbVerses: hizbsData, 

  getVersesByHizb: (hizbNumber) => {
    return hizbsData[hizbNumber] || [];
  },

  getRandomVerseFromHizb: (hizbNumber) => {
    const verses = hizbsData[hizbNumber];
    if (!verses || verses.length === 0) return null;
    const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues 
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random();
    const randomIndex = Math.floor(randomValue * verses.length);
    return verses[randomIndex];
  },
};

export default quranData;