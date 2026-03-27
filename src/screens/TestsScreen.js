import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
  Share,
  Alert,
  Image,
} from 'react-native';
import colors from '../styles/colors';

const { width } = Dimensions.get('window');

const TestsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* ── HEADER ── */}
        <View style={styles.headerContainer}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>›</Text>
          </TouchableOpacity>

          <View style={styles.ornamentTop} />
          <Text style={styles.mainTitle}>مواضع في القرآن الكريم</Text>
          <Text style={styles.subtitle}>برواية قالون عن نافع المدني</Text>
          <View style={styles.ornamentBottom} />
        </View>

        {/* ── 4 CARDS ── */}
        <View style={styles.cardsContainer}>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SurahSelection')}
            activeOpacity={0.85}>
            <View style={styles.cardGradient} />
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/SurahTestIcon.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardTitle}>مواضع في سورة معينة</Text>
            <Text style={styles.cardDescription}>اختر سورة واختبر حفظك آياتها</Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PageSelection')}
            activeOpacity={0.85}>
            <View style={styles.cardGradient} />
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/PageTestIcon.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardTitle}>مواضع في صفحات معينة</Text>
            <Text style={styles.cardDescription}>حدد نطاق الصفحات من المصحف</Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HizbSelection')}
            activeOpacity={0.85}>
            <View style={styles.cardGradient} />
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/HizbTestIcon.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardTitle}>مواضع في حزب معيّن</Text>
            <Text style={styles.cardDescription}>اختر حزب واختبر حفظك فيه</Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CustomTestSetup')}
            activeOpacity={0.85}>
            <View style={styles.cardGradient} />
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/CustomTesticon.png')}
                style={styles.cardIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardTitle}>أنشئ اختبارك الخاصّ</Text>
            <Text style={styles.cardDescription}>خصّص اختبارك وابدأ التحدّي بطريقتك</Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: -20,
  },
  ornamentTop: {
    width: 60,
    height: 3,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  ornamentBottom: {
    width: 40,
    height: 3,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 2,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 20,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  backButtonText: {
    top: 5,
    fontSize: 28,
    color: colors.secondary,
    fontWeight: 'bold',
    transform: [{ rotate: '180deg' }],
  },

  // ── CARDS ──
  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 20,
  },
  card: {
    backgroundColor: colors.bgWhite,
    borderRadius: 24,
    padding: 20,
    paddingRight: 25,
    marginBottom: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    position: 'relative',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: colors.secondary,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
    overflow: 'hidden',
  },
  cardIconImage: {
    width: 63,
    height: 63,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 5,
    fontFamily: 'ScheherazadeNew_400Regular',
  },
  cardDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 12,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default TestsScreen;