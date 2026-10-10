import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { wp, hp, fp, SPACING, FONT_SIZES, RADIUS } from '../../utils/responsive';

// Modale de choix. actions : [{ label, variant: 'primary'|'secondary'|'success'|'error', onPress }]
const ChoiceModal = ({ visible, title, message, actions, onRequestClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.buttons}>
          {actions.map((action) => {
            const secondary = action.variant === 'secondary';
            return (
              <TouchableOpacity
                key={action.label}
                style={[styles.button, styles[action.variant || 'primary']]}
                onPress={action.onPress}
                activeOpacity={0.85}>
                <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  content: {
    backgroundColor: colors.bgWhite,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: wp(360),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(6) },
    shadowOpacity: 0.3,
    shadowRadius: wp(12),
    elevation: 10,
    borderTopWidth: 3,
    borderTopColor: colors.secondary,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: hp(16),
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: hp(24),
    lineHeight: fp(26),
  },
  buttons: {
    gap: hp(10),
  },
  button: {
    paddingVertical: hp(14),
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.bgLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.error },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: colors.textLight,
  },
  buttonTextSecondary: { color: colors.primary },
});

export default ChoiceModal;
