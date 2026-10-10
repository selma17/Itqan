import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  surahInfoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  surahInfoHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  surahNumberBadge: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  surahNumberText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
  },
  surahNameContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  surahType: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  surahStats: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.bgWhite,
    borderRadius: 14,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
});
