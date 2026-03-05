const fs = require("fs");
const path = require("path");

// chemins corrects
const dataPath = path.join(__dirname, "../data/qaloonQuran.json");

// charger le Coran
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

/**
 * Définition OFFICIELLE des 60 hizb
 * (exactement ton document)
 */
const hizbRanges = [
  { hizb: 1, start: { s: 1, a: 1 }, end: { s: 2, a: 74 } },
  { hizb: 2, start: { s: 2, a: 75 }, end: { s: 2, a: 141 } },
  { hizb: 3, start: { s: 2, a: 142 }, end: { s: 2, a: 202 } },
  { hizb: 4, start: { s: 2, a: 203 }, end: { s: 2, a: 250 } },
  { hizb: 5, start: { s: 2, a: 251 }, end: { s: 3, a: 14 } },
  { hizb: 6, start: { s: 3, a: 15 }, end: { s: 3, a: 90 } },
  { hizb: 7, start: { s: 3, a: 91 }, end: { s: 3, a: 170 } },
  { hizb: 8, start: { s: 3, a: 171 }, end: { s: 4, a: 23 } },
  { hizb: 9, start: { s: 4, a: 24 }, end: { s: 4, a: 85 } },
  { hizb: 10, start: { s: 4, a: 86 }, end: { s: 4, a: 146 } },
  { hizb: 11, start: { s: 4, a: 147 }, end: { s: 5, a: 24 } },
  { hizb: 12, start: { s: 5, a: 25 }, end: { s: 5, a: 83 } },
  { hizb: 13, start: { s: 5, a: 84 }, end: { s: 6, a: 36 } },
  { hizb: 14, start: { s: 6, a: 37 }, end: { s: 6, a: 111 } },
  { hizb: 15, start: { s: 6, a: 112 }, end: { s: 6, a: 167 } },
  { hizb: 16, start: { s: 7, a: 1 }, end: { s: 7, a: 86 } },
  { hizb: 17, start: { s: 7, a: 87 }, end: { s: 7, a: 170 } },
  { hizb: 18, start: { s: 7, a: 171 }, end: { s: 8, a: 40 } },
  { hizb: 19, start: { s: 8, a: 41 }, end: { s: 9, a: 33 } },
  { hizb: 20, start: { s: 9, a: 34 }, end: { s: 9, a: 93 } },
  { hizb: 21, start: { s: 9, a: 94 }, end: { s: 10, a: 25 } },
  { hizb: 22, start: { s: 10, a: 26 }, end: { s: 11, a: 5 } },
  { hizb: 23, start: { s: 11, a: 6 }, end: { s: 11, a: 82 } },
  { hizb: 24, start: { s: 11, a: 83 }, end: { s: 12, a: 52 } },
  { hizb: 25, start: { s: 12, a: 53 }, end: { s: 13, a: 20 } },
  { hizb: 26, start: { s: 13, a: 21 }, end: { s: 14, a: 54 } },
  { hizb: 27, start: { s: 15, a: 1 }, end: { s: 16, a: 50 } },
  { hizb: 28, start: { s: 16, a: 51 }, end: { s: 16, a: 128 } },
  { hizb: 29, start: { s: 17, a: 1 }, end: { s: 17, a: 98 } },
  { hizb: 30, start: { s: 17, a: 99 }, end: { s: 18, a: 73 } },
  { hizb: 31, start: { s: 18, a: 74 }, end: { s: 19, a: 98 } },
  { hizb: 32, start: { s: 20, a: 1 }, end: { s: 20, a: 134 } },
  { hizb: 33, start: { s: 21, a: 1 }, end: { s: 21, a: 111 } },
  { hizb: 34, start: { s: 22, a: 1 }, end: { s: 22, a: 76 } },
  { hizb: 35, start: { s: 23, a: 1 }, end: { s: 24, a: 20 } },
  { hizb: 36, start: { s: 24, a: 21 }, end: { s: 25, a: 20 } },
  { hizb: 37, start: { s: 25, a: 21 }, end: { s: 26, a: 111 } },
  { hizb: 38, start: { s: 26, a: 112 }, end: { s: 27, a: 57 } },
  { hizb: 39, start: { s: 27, a: 58 }, end: { s: 28, a: 50 } },
  { hizb: 40, start: { s: 28, a: 51 }, end: { s: 29, a: 45 } },
  { hizb: 41, start: { s: 29, a: 46 }, end: { s: 31, a: 20 } },
  { hizb: 42, start: { s: 31, a: 21 }, end: { s: 33, a: 34 } },
  { hizb: 43, start: { s: 33, a: 35 }, end: { s: 34, a: 23 } },
  { hizb: 44, start: { s: 34, a: 24 }, end: { s: 36, a: 26 } },
  { hizb: 45, start: { s: 36, a: 27 }, end: { s: 37, a: 144 } },
  { hizb: 46, start: { s: 37, a: 145 }, end: { s: 39, a: 30 } },
  { hizb: 47, start: { s: 39, a: 31 }, end: { s: 40, a: 40 } },
  { hizb: 48, start: { s: 40, a: 41 }, end: { s: 41, a: 45 } },
  { hizb: 49, start: { s: 41, a: 46 }, end: { s: 43, a: 22 } },
  { hizb: 50, start: { s: 43, a: 23 }, end: { s: 45, a: 36 } },
  { hizb: 51, start: { s: 46, a: 1 }, end: { s: 48, a: 17 } },
  { hizb: 52, start: { s: 48, a: 18 }, end: { s: 51, a: 30 } },
  { hizb: 53, start: { s: 51, a: 31 }, end: { s: 54, a: 55 } },
  { hizb: 54, start: { s: 55, a: 1 }, end: { s: 57, a: 28 } },
  { hizb: 55, start: { s: 58, a: 1 }, end: { s: 61, a: 14 } },
  { hizb: 56, start: { s: 62, a: 1 }, end: { s: 66, a: 12 } },
  { hizb: 57, start: { s: 67, a: 1 }, end: { s: 71, a: 30 } },
  { hizb: 58, start: { s: 72, a: 1 }, end: { s: 77, a: 50 } },
  { hizb: 59, start: { s: 78, a: 1 }, end: { s: 86, a: 16 } },
  { hizb: 60, start: { s: 87, a: 1 }, end: { s: 114, a: 6 } }
];

// fonction de comparaison
function inRange(s, a, start, end) {
  if (s < start.s || s > end.s) return false;
  if (s === start.s && a < start.a) return false;
  if (s === end.s && a > end.a) return false;
  return true;
}

// ajout du hizb
const updated = data.map(aya => {
  const hizbObj = hizbRanges.find(h =>
    inRange(aya.sura_no, aya.aya_no, h.start, h.end)
  );

  return {
    ...aya,
    hizb: hizbObj ? hizbObj.hizb : null
  };
});

// écriture du fichier
fs.writeFileSync(
  dataPath,
  JSON.stringify(updated, null, 2),
  "utf8"
);

console.log("✅ Champ hizb ajouté correctement (Qaloun – Madinah)");
