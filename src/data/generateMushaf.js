const fs = require("fs");

// Lire le fichier source
const data = JSON.parse(fs.readFileSync("qaloonQuran.json", "utf8"));

const pages = {};

data.forEach((ayah) => {
  const pageNum = Number(ayah.page);

  if (!pages[pageNum]) {
    pages[pageNum] = {};
  }

  // Ajouter le nom de la sourate si c'est le début
  if (ayah.aya_no === 1) {
    const surahLine = ayah.line_start - 2; // souvent 2 lignes avant
    const bismillahLine = ayah.line_start - 1;

    // Nom de sourate
    if (!pages[pageNum][surahLine]) {
      pages[pageNum][surahLine] = ayah.sura_name_ar;
    }

    // Bismillah sauf Sourate 9
    if (ayah.sura_no !== 9) {
      if (!pages[pageNum][bismillahLine]) {
        pages[pageNum][bismillahLine] =
          "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      }
    }
  }

  // Ajouter le texte dans les lignes correspondantes
  for (let line = ayah.line_start; line <= ayah.line_end; line++) {
    if (!pages[pageNum][line]) {
      pages[pageNum][line] = "";
    }

    pages[pageNum][line] += " " + ayah.aya_text;
  }
});

// Construire le résultat final
const result = Object.keys(pages).map((page) => {
  const sortedLines = Object.keys(pages[page])
    .map(Number)
    .sort((a, b) => a - b)
    .map((lineNumber) => ({
      lineNumber,
      text: pages[page][lineNumber].trim(),
    }));

  return {
    page: Number(page),
    linesCount: sortedLines.length,
    lines: sortedLines,
  };
});

// Écrire le nouveau fichier
fs.writeFileSync(
  "mushafPages.json",
  JSON.stringify(result, null, 2),
  "utf8"
);

console.log("✅ mushafPages.json généré avec succès !");