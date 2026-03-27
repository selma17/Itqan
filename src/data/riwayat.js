// src/data/riwayat.js

export const RIWAYAT = {
  qaloon: {
    id: 'qaloon',
    nameAr: 'قالون',
    fullNameAr: 'رواية قالون عن نافع',
    imam: 'نافع المدني',
    region: 'تونس والمغرب العربي',
    fontFamily: 'QaloonFont',
    fontAsset: require('../../assets/fonts/qaloon.10.ttf'),
    bundled: true,
  },
  hafs: {
    id: 'hafs',
    nameAr: 'حفص',
    fullNameAr: 'رواية حفص عن عاصم',
    imam: 'عاصم الكوفي',
    region: 'العالم الإسلامي',
    fontFamily: 'HafsFont',
    fontAsset: require('../../assets/fonts/hafs.ttf'),
    bundled: false,
    downloadUrl: 'https://github.com/selma17/quran-data/releases/download/v1.0.0-data/hafsQuran.json',
  }, 

  warsh: {
    id: 'warsh',
    nameAr: 'ورش',
    fullNameAr: 'رواية ورش عن نافع',
    imam: 'نافع المدني',
    region: 'المغرب العربي • مصر',
    fontFamily: 'WarshFont',
    fontAsset: require('../../assets/fonts/warsh.ttf'),
    bundled: false,
    downloadUrl: 'https://github.com/selma17/quran-data/releases/download/v1.0.0-data/warshQuran.json',
  },
  doori: {
    id: 'doori',
    nameAr: 'الدوري',
    fullNameAr: 'رواية الدوري عن أبي عمرو',
    imam: 'أبو عمرو البصري',
    region: 'أفريقيا الشرقية • السودان',
    fontFamily: 'DooriFont',
    fontAsset: require('../../assets/fonts/doori.ttf'),
    bundled: false,
    downloadUrl: 'https://github.com/selma17/quran-data/releases/download/v1.0.0-data/dooriQuran.json',
  },
};

export const RIWAYAT_LIST = Object.values(RIWAYAT);