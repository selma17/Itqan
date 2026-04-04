import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import colors from '../styles/colors';
import { useQuran } from '../context/QuranContext';

const DuaaScreen = ({ navigation, route }) => {
  const { quranData } = useQuran();
  const { 
    testType, 
    surahNumber, 
    pageFrom, 
    pageTo, 
    hizbNumber,
    hizbFrom,
    hizbTo,
    partLabel,
    selectionMode,
    questionCount,
    sourceType,
    selectedSurahs,
    pageRanges,
    selectedHizbs,
    mode,
    versesToRead,
    showSurahName
  } = route.params;
  if (!quranData) return null;

  const handleReady = () => {
    // Vérifier si c'est un test personnalisé (CustomTest) ou un test standard
    if (sourceType) {
      // Navigation vers CustomTest avec tous les paramètres
      navigation.navigate('CustomTest', {
        sourceType,
        selectedSurahs,
        pageRanges,
        selectedHizbs,
        questionCount,
        mode,
        versesToRead,
        showSurahName,
      });
    } else {
      // Navigation vers Test standard (ancien comportement)
      navigation.navigate('Test', {
        testType,
        surahNumber,
        pageFrom,
        pageTo,
        hizbNumber,
        hizbFrom,
        hizbTo,
        partLabel,
        selectionMode,
        questionCount,
        showSurahName,
      });
    }
  };

  const getTestInfo = () => {
    // Pour les tests personnalisés
    if (sourceType) {
      if (sourceType === 'surahs') {
        if (selectedSurahs && selectedSurahs.length === 1) {
          // Trouver le nom de la sourate
          const surah = quranData.surahs.find(s => s.number === selectedSurahs[0]);
          return surah ? `سورة ${surah.name}` : `السورة رقم ${selectedSurahs[0]}`;
        } else if (selectedSurahs && selectedSurahs.length > 1) {
          // Récupérer les noms des sourates sélectionnées
          const surahNames = selectedSurahs
            .sort((a, b) => a - b) // Trier par ordre numérique
            .map(surahNum => {
              const surah = quranData.surahs.find(s => s.number === surahNum);
              return surah ? surah.name : `سورة ${surahNum}`;
            });
          
          // Afficher les noms séparés par "، "
          return `سور : ${surahNames.join(' - ')}`;
        }
        return "لم يتم اختيار سور";
      } else if (sourceType === 'pages') {
        const totalPages = pageRanges?.reduce((sum, range) => {
          return sum + (parseInt(range.to) - parseInt(range.from) + 1);
        }, 0) || 0;
        return `${totalPages} صفحة`;
      } else if (sourceType === 'hizbs') {
        if (selectedHizbs && selectedHizbs.length === 1) {
          return `الحزب رقم ${selectedHizbs[0]}`;
        }
        return `${selectedHizbs?.length || 0} أحزاب`;
      }
    }
    
    // Pour les tests standards (ancien comportement)
    if (testType === 'surah') {
      return `السورة رقم ${surahNumber}`;
    } else if (testType === 'Hizb') {
      return `الحزب رقم ${hizbNumber}`;
    } 
    else if (testType === 'GeneralPart') {
      return partLabel || 'جزء من القرآن';
    }else {
      return `الصفحات ${pageFrom} - ${pageTo}`;
    } 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>قبل البدء</Text>
        </View>
      </View>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.bismillahCircle}>
          <Text style={styles.bismillahText}>﷽</Text>
        </View>

        <Text style={styles.duaaTitle}>دعاء قبل الاختبار</Text>

        <View style={styles.duaaCard}>
          <Text style={styles.duaaText}>رَبِّ اشْرَحْ لِي صَدْرِي</Text>
          <View style={styles.duaaSeparator} />
          <Text style={styles.duaaText}>وَ يَسِّرْ لِي أَمْرِي</Text>
          <View style={styles.duaaSeparator} />
          <Text style={styles.duaaText}>وَ احْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُ قَوْلِي</Text>
        </View>

        <View style={styles.testInfoCard}>
          <Text style={styles.testInfoIcon}>🖇️</Text>
          <Text style={styles.testInfoTitle}>
            {getTestInfo()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.readyButton}
          onPress={handleReady}
          activeOpacity={0.85}>
          <Text style={styles.readyButtonText}>جاهز للبدء</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
  }, 
  header: {
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 30
  },
  backButtonText: {
    fontSize: 25,
    color: colors.textLight,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 25,
    marginRight: 15
  },
  
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  
  bismillahCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.bgWhite,
    borderWidth: 3,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10,
    marginBottom: 20,
  },
  bismillahText: {
    fontSize: 40,
    color: colors.primary,
  },
  
  duaaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  
  duaaCard: {
    width: '100%',
    backgroundColor: colors.bgWhite,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderTopWidth: 4,
    borderTopColor: colors.secondary,
  },
  duaaText: {
    fontSize: 19,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: '600',
  },
  duaaSeparator: {
    width: 40,
    height: 2,
    backgroundColor: colors.secondaryLight,
    alignSelf: 'center',
    borderRadius: 1,
    marginVertical: 12,
  },
  
  testInfoCard: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.secondary,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  testInfoIcon: {
    fontSize: 22,
  },
  testInfoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'right',
  },
  readyButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  readyButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default DuaaScreen;