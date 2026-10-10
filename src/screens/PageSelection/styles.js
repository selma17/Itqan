import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.bgLight,
    borderRadius: 14,
    padding: 6,
    fontSize: 22,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700',
  },
  inputEmpty: {
    fontSize: 14,
    fontWeight: '400',
  },
  inputUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rangeInfoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  pageCountBox: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pageCountLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pageCountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
  },
  helpBox: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.bgWhite,
    padding: 10,
    borderRadius: 16,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  helpIcon: {
    fontSize: 20,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'right',
  },
  helpText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 20,
  },
});
