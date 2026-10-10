import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { wp, hp, SPACING, FONT_SIZES, RADIUS } from '../../utils/responsive';

const GOLD_LIGHT = '#F4E4C1';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  mainContent: {
    flex: 1,
    padding: SPACING.sm,
  },
  progressBar: {
    backgroundColor: colors.bgWhite,
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    borderRadius: RADIUS.md,
    marginTop: hp(8),
    marginBottom: hp(8),
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    alignSelf: 'center',
  },
  progressText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  controlsContainer: {
    backgroundColor: colors.bgWhite,
    borderTopWidth: 2,
    borderTopColor: GOLD_LIGHT,
    gap: hp(8),
    padding: 15,
    height: 160,
  },
  controlsRow: {
    flexDirection: 'row-reverse',
    gap: wp(10),
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.bgLight,
    paddingVertical: hp(12),
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  controlButtonTextDisabled: {
    color: colors.textSecondary,
  },
  mainButton: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
  },
  mainButtonSuccess: {
    backgroundColor: colors.success,
  },
  mainButtonError: {
    backgroundColor: GOLD_LIGHT,
  },
  mainButtonText: {
    fontSize: FONT_SIZES.buttonText,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: hp(12),
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: colors.error,
  },
  quitButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
  },
});
