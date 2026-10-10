import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import colors from '../styles/colors';


/**
 * Champ de sélection compact : un déclencheur + un bottom sheet modal.
 * - single : `value` (string|number|null), `onChange(value)` ferme le sheet.
 * Option : { value, label, badge?, sub?, meta? } ; sans badge, le texte est centré.
 * - multiple : `value` (array), `onChange(array)` ; le sheet reste ouvert, bouton « تم ».
 */
const BottomSheetSelect = ({
  label,
  placeholder,
  title,
  options,
  value,
  onChange,
  multiple = false,
  displayText,
}) => {
  const [visible, setVisible] = React.useState(false);

  const isSelected = (v) => (multiple ? value.includes(v) : value === v);

  const selectedOption = !multiple ? options.find((o) => o.value === value) : null;
  const triggerText =
    displayText ??
    (multiple
      ? value.length > 0 ? `${value.length} محدد` : null
      : selectedOption?.label);

  const handlePress = (v) => {
    if (multiple) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange(v);
      setVisible(false);
    }
  };

  const rowHeight = options.some((o) => o.sub) ? 62 : 52;
  const firstSelectedIndex = options.findIndex((o) => isSelected(o.value));

  return (
    <>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}>
        <Text style={styles.triggerArrow}>▼</Text>
        <Text
          style={[styles.triggerText, !triggerText && styles.triggerPlaceholder]}
          numberOfLines={1}>
          {triggerText || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet}>
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="sheetBg" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#dcebe1" />
                  <Stop offset="0.45" stopColor="#f1f7f3" />
                  <Stop offset="1" stopColor="#fffef9" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#sheetBg)" />
            </Svg>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title || label || placeholder}</Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              getItemLayout={(_, index) => ({
                length: rowHeight,
                offset: rowHeight * index,
                index,
              })}
              initialScrollIndex={firstSelectedIndex > 0 ? firstSelectedIndex : undefined}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = isSelected(item.value);
                return (
                  <TouchableOpacity
                    style={[styles.row, { height: rowHeight }, selected && styles.rowSelected]}
                    onPress={() => handlePress(item.value)}
                    activeOpacity={0.6}>
                    {item.badge != null && (
                      <Text style={styles.badgeText}>
                        {String(item.badge).padStart(2, '0')}
                      </Text>
                    )}
                    <View style={[styles.info, item.badge == null && styles.infoCentered]}>
                      <Text
                        style={[styles.rowText, selected && styles.rowTextSelected]}
                        numberOfLines={1}>
                        {item.label}
                      </Text>
                      {item.sub ? <Text style={styles.subText}>{item.sub}</Text> : null}
                    </View>
                    {item.meta ? <Text style={styles.metaText}>{item.meta}</Text> : null}
                    {multiple && selected && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
            {multiple && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setVisible(false)}
                activeOpacity={0.85}>
                <Text style={styles.doneText}>تم</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: colors.bgLight,
    borderRadius: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 3,
    textAlign: 'right',
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    color: '#2C2C2C',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  triggerPlaceholder: {
    color: '#9E9E9E',
  },
  triggerArrow: {
    fontSize: 11,
    color: colors.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '65%',
    paddingBottom: 12,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.4)',
  },
  sheetTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.25)',
  },
  rowSelected: {
    backgroundColor: 'rgba(45, 90, 62, 0.10)',
  },
  badgeText: {
    width: 34,
    fontSize: 17,
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoCentered: {
    alignItems: 'center',
  },
  rowText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C2C2C',
    writingDirection: 'rtl',
  },
  rowTextSelected: {
    color: colors.primary,
  },
  subText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    writingDirection: 'rtl',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  check: {
    position: 'absolute',
    left: 4,
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textLight,
  },
});

export default BottomSheetSelect;
