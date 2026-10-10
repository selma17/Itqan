import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { wp, hp, SPACING, FONT_SIZES, RADIUS } from '../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  mainContent: {
    flex: 1,
    padding: SPACING.md,
  },
  controlsContainer: {
    backgroundColor: colors.bgWhite,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: hp(10),
  },
  questionCounter: {
    alignSelf: 'center',
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: wp(12),
    paddingVertical: hp(4),
    borderRadius: RADIUS.sm,
    marginBottom: hp(4),
  },
  questionCounterText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: '600',
    color: colors.primary,
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
    borderColor: colors.border,
  },
  controlButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  newQuestionButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(14),
    borderRadius: RADIUS.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.25,
    shadowRadius: wp(4),
    elevation: 3,
  },
  newQuestionButtonText: {
    fontSize: FONT_SIZES.buttonText,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
  quitButton: {
    backgroundColor: colors.bgLight,
    paddingVertical: hp(10),
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quitButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
