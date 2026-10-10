// Nombre aléatoire dans [0, 1[ — crypto si disponible, sinon Math.random.
export const secureRandom = () =>
  typeof crypto !== 'undefined' && crypto.getRandomValues
    ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
    : Math.random();

// Mélange de Fisher-Yates (retourne une copie).
export const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(secureRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const pickRandom = (items) => items[Math.floor(secureRandom() * items.length)];
