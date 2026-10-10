import { shuffle } from './random';
import { isSameVerse, sortByMushafOrder } from './verses';

// Test standard avec nombre de questions défini.
// - sequential : une question tirée au hasard dans chaque bloc du mushaf (répartition uniforme)
// - random : tirage aléatoire sans doublon
export const buildQuestions = (allVerses, { count, mode }) => {
  if (mode === 'sequential') {
    const sorted = sortByMushafOrder(allVerses);
    const numQuestions = Math.min(count, sorted.length);
    const blockSize = Math.floor(sorted.length / numQuestions);

    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
      const blockStart = i * blockSize;
      const blockEnd = i === numQuestions - 1 ? sorted.length : (i + 1) * blockSize;
      const index = blockStart + Math.floor(Math.random() * (blockEnd - blockStart));
      if (index < sorted.length) questions.push(sorted[index]);
    }
    return questions;
  }

  return shuffle(allVerses).slice(0, Math.min(count, allVerses.length));
};

// Un verset est un point de départ valide s'il est suivi d'au moins `needed` versets de la même sourate.
const hasEnoughFollowingVerses = (verse, allVerses, needed) => {
  const index = allVerses.findIndex(v => isSameVerse(v, verse));
  if (index === -1) return false;

  let count = 0;
  for (let i = index + 1; i < allVerses.length && count < needed; i++) {
    if (allVerses[i].surahNumber !== verse.surahNumber) break;
    count++;
  }
  return count >= needed;
};

// Test personnalisé : questions dont le verset est suivi d'assez de versets à lire.
// Retourne [] si aucune question possible.
export const buildCustomQuestions = (allVerses, { count, mode, versesToRead }) => {
  const source = mode === 'sequential' ? sortByMushafOrder(allVerses) : allVerses;
  const validVerses = source.filter(v => hasEnoughFollowingVerses(v, source, versesToRead));
  if (validVerses.length === 0) return [];

  const picked = shuffle(validVerses).slice(0, Math.min(count, validVerses.length));

  // En mode séquentiel, on garde l'ordre du mushaf.
  return mode === 'sequential' ? sortByMushafOrder(picked) : picked;
};
