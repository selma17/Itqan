import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 35,
  },
  headerTitle: {
    fontSize: 33,
    fontWeight: '700',
    color: colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  // Carte de performance
  performanceCard: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRightWidth: 5,
  },
  performanceContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  performanceTextContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  performanceEmoji: {
    fontSize: 40,
  },
  performanceText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  performanceTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  performanceMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  percentageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgLight,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
  },

  // Cartes avec titre (statistiques / informations)
  card: {
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    backgroundColor: colors.bgLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  cardBody: {
    padding: 16,
  },
  divider: {
    height: 2,
    backgroundColor: colors.secondary,
    marginVertical: 4,
  },

  // Statistiques
  statRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  statIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
  },
  statContent: {
    alignItems: 'flex-end',
    flex: 1,
    paddingRight: 16,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },

  // Informations
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 17,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  pageRangeDetail: {
    width: '100%',
    marginBottom: 8,
  },
  surahHint: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    fontStyle: 'italic',
  },

  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
});
