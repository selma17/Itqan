import { secureRandom, shuffle } from './random';
import { sortByMushafOrder } from './verses';

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
      const index = blockStart + Math.floor(secureRandom() * (blockEnd - blockStart));
      if (index < sorted.length) questions.push(sorted[index]);
    }
    return questions;
  }

  return shuffle(allVerses).slice(0, Math.min(count, allVerses.length));
};

// Test personnalisé : questions dont le verset est suivi d'assez de versets à lire.
// Retourne [] si aucune question possible.
export const buildCustomQuestions = (allVerses, { count, mode, versesToRead }) => {
  const source = mode === 'sequential' ? sortByMushafOrder(allVerses) : allVerses;
  // followers[i] = nombre de versets consécutifs de la même sourate après l'index i (un seul passage).
  const followers = new Array(source.length).fill(0);
  for (let i = source.length - 2; i >= 0; i--) {
    if (source[i + 1].surahNumber === source[i].surahNumber) followers[i] = followers[i + 1] + 1;
  }
  const validVerses = source.filter((_, i) => followers[i] >= versesToRead);
  if (validVerses.length === 0) return [];

  const picked = shuffle(validVerses).slice(0, Math.min(count, validVerses.length));

  // En mode séquentiel, on garde l'ordre du mushaf.
  return mode === 'sequential' ? sortByMushafOrder(picked) : picked;
};
