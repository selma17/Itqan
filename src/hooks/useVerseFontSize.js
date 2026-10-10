import { useEffect, useState } from 'react';
import { fp } from '../utils/responsive';
import { getItem, STORAGE_KEYS } from '../services/storage';

// Tailles de police des versets (index sauvegardé dans les réglages).
export const VERSE_FONT_SIZES = [fp(19), fp(25), fp(31), fp(37)];
const DEFAULT_FONT_SIZE = fp(25);

// Taille de police des versets choisie dans les réglages.
const useVerseFontSize = () => {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    getItem(STORAGE_KEYS.VERSE_FONT_STEP).then(val => {
      if (val !== null) setFontSize(VERSE_FONT_SIZES[Number(val)] ?? DEFAULT_FONT_SIZE);
    });
  }, []);

  return fontSize;
};

export default useVerseFontSize;
