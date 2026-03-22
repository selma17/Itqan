const fs   = require('fs');
const path = require('path');

const QALOON_PATH = path.join(__dirname, '../data/qaloonQuran.json');
const OUTPUT_DIR  = path.join(__dirname, '../data/quran-pages');

const qaloonData = JSON.parse(fs.readFileSync(QALOON_PATH, 'utf8'));

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const SURAH_TYPE = {
  1:'meccan',2:'medinan',3:'medinan',4:'medinan',5:'medinan',
  6:'meccan',7:'meccan',8:'medinan',9:'medinan',10:'meccan',
  11:'meccan',12:'meccan',13:'medinan',14:'meccan',15:'meccan',
  16:'meccan',17:'meccan',18:'meccan',19:'meccan',20:'meccan',
  21:'meccan',22:'medinan',23:'meccan',24:'medinan',25:'meccan',
  26:'meccan',27:'meccan',28:'meccan',29:'meccan',30:'meccan',
  31:'meccan',32:'meccan',33:'medinan',34:'meccan',35:'meccan',
  36:'meccan',37:'meccan',38:'meccan',39:'meccan',40:'meccan',
  41:'meccan',42:'meccan',43:'meccan',44:'meccan',45:'meccan',
  46:'meccan',47:'medinan',48:'medinan',49:'medinan',50:'meccan',
  51:'meccan',52:'meccan',53:'meccan',54:'meccan',55:'meccan',
  56:'meccan',57:'medinan',58:'medinan',59:'medinan',60:'medinan',
  61:'medinan',62:'medinan',63:'medinan',64:'medinan',65:'medinan',
  66:'medinan',67:'meccan',68:'meccan',69:'meccan',70:'meccan',
  71:'meccan',72:'meccan',73:'meccan',74:'meccan',75:'meccan',
  76:'medinan',77:'meccan',78:'meccan',79:'meccan',80:'meccan',
  81:'meccan',82:'meccan',83:'meccan',84:'meccan',85:'meccan',
  86:'meccan',87:'meccan',88:'meccan',89:'meccan',90:'meccan',
  91:'meccan',92:'meccan',93:'meccan',94:'meccan',95:'meccan',
  96:'meccan',97:'meccan',98:'medinan',99:'meccan',100:'meccan',
  101:'meccan',102:'meccan',103:'meccan',104:'meccan',105:'meccan',
  106:'meccan',107:'meccan',108:'meccan',109:'meccan',110:'medinan',
  111:'meccan',112:'meccan',113:'meccan',114:'meccan',
};

// ── Index de navigation ──
const surahIndex = {};
const juzIndex   = {};
const hizbIndex  = {};

qaloonData.forEach(aya => {
  const page = parseInt(aya.page);
  if (!surahIndex[aya.sura_no]) {
    surahIndex[aya.sura_no] = {
      sura_no:      aya.sura_no,
      sura_name_ar: aya.sura_name_ar,
      sura_name_en: aya.sura_name_en,
      type:         SURAH_TYPE[aya.sura_no] || 'meccan',
      first_page:   page,
    };
  }
  if (!juzIndex[aya.jozz]) {
    juzIndex[aya.jozz] = { juz_number: aya.jozz, first_page: page };
  }
  if (aya.hizb && !hizbIndex[aya.hizb]) {
    hizbIndex[aya.hizb] = { hizb_number: aya.hizb, first_page: page };
  }
});

// ── Grouper les ayahs par page ──
const pageMap = {};
qaloonData.forEach(aya => {
  const p = parseInt(aya.page);
  if (!pageMap[p]) pageMap[p] = [];
  pageMap[p].push(aya);
});

// ── Générer un fichier par page ──
for (let pageNum = 1; pageNum <= 604; pageNum++) {
  const ayahs    = pageMap[pageNum] || [];
  if (ayahs.length === 0) {
    console.warn(`⚠️  Pas d'ayahs pour la page ${pageNum}`);
    continue;
  }

  const firstAya = ayahs[0];
  const juz      = firstAya.jozz;
  const hizb     = firstAya.hizb;

  const surahsMap = {};
  ayahs.forEach(aya => {
    if (!surahsMap[aya.sura_no]) {
      surahsMap[aya.sura_no] = {
        sura_no:      aya.sura_no,
        sura_name_ar: aya.sura_name_ar,
        sura_name_en: aya.sura_name_en,
        type:         SURAH_TYPE[aya.sura_no] || 'meccan',
        starts_here:  surahIndex[aya.sura_no]?.first_page === pageNum,
      };
    }
  });
  const surahs = Object.values(surahsMap);

  const juz_starts_here  = juzIndex[juz]?.first_page  === pageNum;
  const hizb_starts_here = hizbIndex[hizb]?.first_page === pageNum;

  const ayahs_detail = ayahs.map(aya => ({
    sura_no:  aya.sura_no,
    aya_no:   aya.aya_no,
    aya_text: aya.aya_text,
  }));

  const page_text = ayahs.map(aya => aya.aya_text).join(' ');

  const pageJson = {
    page_number: pageNum,
    juz,
    juz_starts_here,
    hizb,
    hizb_starts_here,
    surahs,
    ayahs: ayahs_detail,
    page_text,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, `page-${pageNum}.json`),
    JSON.stringify(pageJson, null, 2),
    'utf8'
  );

  if (pageNum % 100 === 0) console.log(`✅ ${pageNum}/604`);
}

// ── Index de navigation global ──
const navIndex = {
  surahs: Object.values(surahIndex).sort((a, b) => a.sura_no - b.sura_no),
  juzs:   Object.values(juzIndex).sort((a, b) => a.juz_number - b.juz_number),
  hizbs:  Object.values(hizbIndex).sort((a, b) => a.hizb_number - b.hizb_number),
};

fs.writeFileSync(
  path.join(__dirname, '../data/quranIndex.json'),
  JSON.stringify(navIndex, null, 2),
  'utf8'
);

// ── Index statique pour Metro (quran-pages JSON) ──
let pagesIndexContent = '// AUTO-GENERATED\nexport default {\n';
for (let i = 1; i <= 604; i++) {
  pagesIndexContent += `  ${i}: require('./quran-pages/page-${i}.json'),\n`;
}
pagesIndexContent += '};\n';

fs.writeFileSync(
  path.join(__dirname, '../data/quranPagesIndex.js'),
  pagesIndexContent,
  'utf8'
);

// ── Index statique pour les images du Mushaf ──
let imagesIndexContent = '// AUTO-GENERATED\nexport default {\n';
for (let i = 1; i <= 604; i++) {
  imagesIndexContent += `  ${i}: require('../../assets/quran-pages/${i}.png'),\n`;
}
imagesIndexContent += '};\n';

fs.writeFileSync(
  path.join(__dirname, '../data/quranImagesIndex.js'),
  imagesIndexContent,
  'utf8'
);

console.log(`\n🎉 Terminé !`);
console.log(`   Pages JSON     : ${OUTPUT_DIR}`);
console.log(`   quranIndex     : src/data/quranIndex.json`);
console.log(`   quranPagesIndex: src/data/quranPagesIndex.js`);
console.log(`   quranImagesIndex: src/data/quranImagesIndex.js`);
console.log(`   Sourates : ${navIndex.surahs.length}`);
console.log(`   Juz      : ${navIndex.juzs.length}`);
console.log(`   Hizbs    : ${navIndex.hizbs.length}`);