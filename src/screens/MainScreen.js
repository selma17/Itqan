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

const MainScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);

  const BUG_REPORT_FORM_URL = 'https://forms.gle/SFbAtd3WfLc2gCJDA';
  const UPDATE_SUGGESTION_FORM_URL = 'https://forms.gle/R7pZgFxbzTXsUaSY8';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.selma.itqan';

  const handleBugReport = async () => {
    setMenuVisible(false);
    try {
      const supported = await Linking.canOpenURL(BUG_REPORT_FORM_URL);
      if (supported) {
        await Linking.openURL(BUG_REPORT_FORM_URL);
      } else {
        Alert.alert('خطأ', 'تعذر فتح الرابط');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء فتح النموذج');
    }
  };

  const handleUpdateSuggestion = async () => {
    setMenuVisible(false);
    try {
      const supported = await Linking.canOpenURL(UPDATE_SUGGESTION_FORM_URL);
      if (supported) {
        await Linking.openURL(UPDATE_SUGGESTION_FORM_URL);
      } else {
        Alert.alert('خطأ', 'تعذر فتح الرابط');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء فتح النموذج');
    }
  };

  const handleRateApp = async () => {
    setMenuVisible(false);
    try {
      const supported = await Linking.canOpenURL(PLAY_STORE_URL);
      if (supported) {
        await Linking.openURL(PLAY_STORE_URL);
      } else {
        Alert.alert('خطأ', 'تعذر فتح متجر Play');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء فتح متجر Play');
    }
  };

  const handleShareApp = async () => {
    setMenuVisible(false);
    try {
      const result = await Share.share({
        message: `شارك التطبيق\n${PLAY_STORE_URL}`,
        title: 'إتقان - Itqan',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Partagé via:', result.activityType);
        } else {
          console.log('Partagé avec succès');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Partage annulé');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء مشاركة التطبيق');
    }
  };
  const handleAboutApp = () => {
    setMenuVisible(false);
    setTimeout(() => {
      setAboutVisible(true);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </TouchableOpacity>

          <View style={styles.ornamentTop} />
          <Text style={styles.mainTitle}>مواضع في القرآن الكريم</Text>
          <Text style={styles.subtitle}>برواية قالون عن نافع المدني</Text>
          <View style={styles.ornamentBottom} />
        </View>

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
            <Text style={styles.cardDescription}>
              اختر سورة واختبر حفظك آياتها
            </Text>
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
            <Text style={styles.cardDescription}>
              حدد نطاق الصفحات من المصحف
            </Text>
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
            <Text style={styles.cardDescription}>
              اختر حزب واختبر حفظك فيه
            </Text>
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
            <Text style={styles.cardDescription}>
              خصّص اختبارك وابدأ التحدّي بطريقتك
            </Text>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>←</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('QuranReading')}
        activeOpacity={0.85}>
        <Image 
          source={require('../../assets/quranBookIcon.png')}
          style={styles.fabIconImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}>
          <TouchableOpacity 
            style={styles.sideMenu}
            activeOpacity={1}>
            
            <View style={styles.menuHeader}>
              <TouchableOpacity 
                style={styles.closeMenuButton}
                onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeMenuIcon}>✕</Text>
              </TouchableOpacity>
              <View >
                <Image 
                  source={require('../../assets/itqanIconNoBg.png')}
                  style={styles.appIconImage}
                />
              </View>
              <Text style={styles.appVersion}>v1.0.0</Text>
            </View>

            <ScrollView 
              style={styles.menuContent}
              showsVerticalScrollIndicator={false}>
              

              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>اتصل بنا</Text>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleBugReport}>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemIcon}>📧</Text>
                    <Text style={styles.menuItemText}>الإبلاغ عن خلل</Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleUpdateSuggestion}>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemIcon}>🔄</Text>
                    <Text style={styles.menuItemText}>اقتراح تحديث</Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>عن التطبيق</Text>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleRateApp}>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemIcon}>⭐</Text>
                    <Text style={styles.menuItemText}>قيّم التطبيق</Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleShareApp}>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemIcon}>📤</Text>
                    <Text style={styles.menuItemText}>شارك التطبيق</Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleAboutApp}>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemIcon}>ℹ️</Text>
                    <Text style={styles.menuItemText}>عن إتقان</Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* MODAL À PROPOS */}
      <Modal
        visible={aboutVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAboutVisible(false)}>
        <View style={styles.aboutModalOverlay}>
          <View style={styles.aboutCard}>
            {/* Bouton fermer */}
            <TouchableOpacity
              style={styles.closeAboutButton}
              onPress={() => setAboutVisible(false)}>
              <Text style={styles.closeAboutIcon}>✕</Text>
            </TouchableOpacity>

            {/* Icône de l'app */}
            <View style={styles.aboutIconContainer}>
              <Image 
                source={require('../../assets/itqanIcon.png')}
                style={styles.aboutIconImage}
                resizeMode="contain"
              />
            </View>

            {/* Titre */}
            <Text style={styles.aboutTitle}>عن إتقان</Text>
            
            {/* Ligne décorative */}
            <View style={styles.aboutDivider} />

            {/* Contenu */}
            <ScrollView 
              style={styles.aboutContentScroll}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.aboutText}>
                بسم الله الرحمن الرحيم{'\n\n'}
                
                إتقان هو تطبيق مخصص لاختبار ومراجعة حفظ القرآن الكريم برواية قالون عن نافع المدني.{'\n\n'}
                
                يوفر التطبيق عدة أنماط للاختبار:{'\n'}
                • مواضع في سورة معينة{'\n'}
                • مواضع في صفحات معينة{'\n'}
                • مواضع في حزب معيّن{'\n'}
                • إنشاء اختبار مخصص{'\n\n'}
                
                الهدف من التطبيق هو مساعدة حفظة القرآن الكريم على تثبيت حفظهم ومراجعة ما حفظوه بطريقة منظمة وممتعة.{'\n\n'}
                
                نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم، وأن ينفع به المسلمين في كل مكان.{'\n\n'}
                
                جميع الحقوق محفوظة © 2026
              </Text>
            </ScrollView>

            {/* Bouton OK */}
            <TouchableOpacity
              style={styles.aboutOkButton}
              onPress={() => setAboutVisible(false)}>
              <Text style={styles.aboutOkButtonText}>حسناً</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
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
  menuButton: {
    position: 'absolute',
    top: 30,
    right: 25,
    width: 20,
    height: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 10,
  },
  menuLine: {
    width: 28,
    height: 3,
    backgroundColor: colors.secondary,
    borderRadius: 2,
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
  infoSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  infoDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 26,
    marginBottom: 24,
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 4,
    borderColor: colors.secondary,
  },
  fabIconImage: {
    width: 80,
    height: 80,
    borderRadius: 35,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  sideMenu: {
    width: width * 0.6,
    height: '100%',
    backgroundColor: colors.bgWhite,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  menuHeader: {
    backgroundColor: colors.primary,
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    height: 200,
  },
  closeMenuButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 25,
    height: 25,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeMenuIcon: {
    fontSize: 15,
    color: colors.borderLight,
    fontWeight: 'bold',
  },
  appIconImage: {
    width: 200,
    height: 150,
  },
  appVersion: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '700',
  },
  menuContent: {
    flex: 1,
    backgroundColor: colors.bgLight,
  },
  menuSection: {
    marginTop: 12,
    paddingVertical: 8,
    marginHorizontal: 7,
    borderWidth: 1.5,
    borderRadius:15,
    borderColor: colors.secondary,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginVertical: 3,
    borderWidth: 1.5,
    borderRadius:15,
    borderColor: colors.borderLight,
    backgroundColor: colors.bgWhite
  },
  menuItemContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  menuItemIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  menuItemArrow: {
    fontSize: 24,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  toggleDisabled: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bgWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // MODAL À PROPOS
  aboutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  aboutCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.bgWhite,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
    maxHeight: '85%',
  },
  closeAboutButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeAboutIcon: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  aboutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.secondary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  aboutIconImage: {
    width: 65,
    height: 65,
  },
  aboutTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  aboutDivider: {
    width: 60,
    height: 3,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 20,
  },
  aboutContentScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: 28,
    writingDirection: 'rtl',
  },
  aboutTextBold: {
    fontWeight: '700',
    color: colors.primary,
  },
  aboutOkButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutOkButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
  },
});

export default MainScreen;