import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  rangeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  rangeInputs: {
    flex: 1,
    flexDirection: 'row-reverse',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    padding: 7,
    fontSize: 15,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    color: colors.textPrimary,
  },
  inputEmpty: {
    fontSize: 14,
    fontWeight: '400',
  },
  removeButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.primaryLight,
    padding: 7,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
});
