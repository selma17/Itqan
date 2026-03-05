// src/utils/responsive.js
// Utilitaire pour rendre l'app responsive sur tous les écrans

import { Dimensions, Platform, StatusBar } from 'react-native';

// Dimensions actuelles de l'écran
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dimensions de référence (iPhone 11 Pro / Pixel 4)
// Ces valeurs servent de base pour les calculs
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Width Percentage
 * Convertit une taille en pourcentage de la largeur de l'écran
 * @param {number} size - Taille de base (en pixels sur écran de référence)
 * @returns {number} - Taille adaptée à la largeur actuelle
 * 
 * Utilisation : width, marginLeft, marginRight, paddingHorizontal, borderRadius
 */
export const wp = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Height Percentage
 * Convertit une taille en pourcentage de la hauteur de l'écran
 * @param {number} size - Taille de base (en pixels sur écran de référence)
 * @returns {number} - Taille adaptée à la hauteur actuelle
 * 
 * Utilisation : height, marginTop, marginBottom, paddingVertical
 */
export const hp = (size) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Font Percentage
 * Adapte la taille de police selon la largeur de l'écran
 * @param {number} size - Taille de police de base
 * @returns {number} - Taille de police adaptée (arrondie)
 * 
 * Utilisation : fontSize uniquement
 * Note : Utilise la largeur comme référence (plus stable que la hauteur)
 */
export const fp = (size) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  // Arrondi pour éviter les demi-pixels
  return Math.round(newSize);
};

/**
 * Spacing Percentage
 * Adapte les espacements (alias de wp pour plus de clarté)
 * @param {number} size - Espacement de base
 * @returns {number} - Espacement adapté
 * 
 * Utilisation : margin, padding (quand on veut un espacement uniforme)
 */
export const sp = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Informations sur l'écran actuel
 */
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  
  // Catégories de tailles
  isSmall: SCREEN_WIDTH < 375,           // iPhone SE, petits Android (< 375px)
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,  // iPhone 11 Pro (375-413px)
  isLarge: SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768,   // iPhone 14 Pro Max, grands Android (414-767px)
  isTablet: SCREEN_WIDTH >= 768,          // iPad, tablettes Android (≥ 768px)
  
  // Orientation
  isPortrait: SCREEN_HEIGHT > SCREEN_WIDTH,
  isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
  
  // Ratios utiles
  aspectRatio: SCREEN_WIDTH / SCREEN_HEIGHT,
};

/**
 * Hauteur de la barre de statut
 * Varie selon la plateforme et l'appareil
 */
export const STATUS_BAR_HEIGHT = Platform.select({
  ios: SCREEN_HEIGHT >= 812 ? 44 : 20,  // iPhone X+ vs anciens iPhone
  android: StatusBar.currentHeight || 24,
  default: 0,
});

/**
 * Fonction utilitaire pour adapter selon la taille d'écran
 * @param {Object} sizes - Objet avec les tailles {small, medium, large, tablet}
 * @returns {number} - La taille appropriée pour l'écran actuel
 * 
 * Exemple :
 * fontSize: adaptiveSize({ small: 14, medium: 16, large: 18, tablet: 20 })
 */
export const adaptiveSize = (sizes) => {
  if (SCREEN.isTablet && sizes.tablet) return sizes.tablet;
  if (SCREEN.isLarge && sizes.large) return sizes.large;
  if (SCREEN.isMedium && sizes.medium) return sizes.medium;
  if (SCREEN.isSmall && sizes.small) return sizes.small;
  
  // Fallback : retourne medium par défaut
  return sizes.medium || sizes.large || sizes.small || 16;
};

/**
 * Fonction pour créer un carré/cercle parfait
 * @param {number} size - Taille de base
 * @returns {Object} - { width, height, borderRadius }
 * 
 * Exemple : style={square(40)} donne un carré de 40x40 responsive
 */
export const square = (size) => ({
  width: wp(size),
  height: wp(size),  // Utilise wp pour garder le ratio 1:1
  borderRadius: wp(size / 2),  // Pour en faire un cercle
});

/**
 * Constantes d'espacement précalculées
 * Utilise-les pour la cohérence dans toute l'app
 */
export const SPACING = {
  xxs: sp(2),
  xs: sp(4),
  sm: sp(8),
  md: sp(16),
  lg: sp(24),
  xl: sp(32),
  xxl: sp(48),
  xxxl: sp(64),
};

/**
 * Constantes de tailles de police précalculées
 */
export const FONT_SIZES = {
  xxs: fp(10),
  xs: fp(12),
  sm: fp(14),
  md: fp(16),
  lg: fp(18),
  xl: fp(20),
  xxl: fp(24),
  xxxl: fp(28),
  xxxxl: fp(32),
  
  // Spécifiques à l'app Quran
  verse: fp(25),           // Texte des versets
  verseLarge: fp(24),      // Versets en mode focus
  surahName: fp(18),       // Noms de sourates
  surahNameLarge: fp(20),  // Noms de sourates en titre
  buttonText: fp(17),      // Texte des boutons
  caption: fp(12),         // Légendes, métadonnées
};

/**
 * Constantes de border radius précalculées
 */
export const RADIUS = {
  xs: wp(4),
  sm: wp(8),
  md: wp(12),
  lg: wp(16),
  xl: wp(20),
  xxl: wp(24),
  round: wp(100),  // Pour des cercles parfaits
};

/**
 * Dimensions de boutons standards
 */
export const BUTTON = {
  height: {
    sm: hp(36),
    md: hp(48),
    lg: hp(56),
  },
  minWidth: {
    sm: wp(80),
    md: wp(120),
    lg: wp(160),
  },
  padding: {
    horizontal: {
      sm: wp(12),
      md: wp(24),
      lg: wp(32),
    },
    vertical: {
      sm: hp(8),
      md: hp(12),
      lg: hp(16),
    },
  },
};

// Export par défaut pour import simplifié
export default {
  wp,
  hp,
  fp,
  sp,
  SCREEN,
  STATUS_BAR_HEIGHT,
  adaptiveSize,
  square,
  SPACING,
  FONT_SIZES,
  RADIUS,
  BUTTON,
};