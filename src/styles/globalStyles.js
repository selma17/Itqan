import { StyleSheet } from 'react-native';
import colors from './colors';

export const globalStyles = StyleSheet.create({
  // Conteneurs
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  
  // Cartes
  card: {
    backgroundColor: colors.bgPaper,
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  // Headers
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 32,
  },
  
  // Boutons
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  
  buttonSecondary: {
    backgroundColor: colors.bgWhite,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  
  buttonTextSecondary: {
    color: colors.primary,
  },
  
  buttonSmall: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  
  buttonTextSmall: {
    fontSize: 16,
  },
  
  // Textes
  textPrimary: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  textArabic: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: 36,
  },
  
  textArabicLarge: {
    fontSize: 26,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 44,
  },
  
  // Labels
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'right',
  },
  
  // Inputs
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: colors.bgWhite,
    marginVertical: 10,
  },
  
  // Navigation
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 40,
    height: 40,
    backgroundColor: colors.whiteTransparent,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  backButtonText: {
    fontSize: 24,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  
  // Centrage
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Espacements
  marginTop10: { marginTop: 10 },
  marginTop20: { marginTop: 20 },
  marginTop30: { marginTop: 30 },
  marginBottom10: { marginBottom: 10 },
  marginBottom20: { marginBottom: 20 },
  marginBottom30: { marginBottom: 30 },
  
  paddingHorizontal20: { paddingHorizontal: 20 },
  paddingVertical20: { paddingVertical: 20 },
});

export default globalStyles;