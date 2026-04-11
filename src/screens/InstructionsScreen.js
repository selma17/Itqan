import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, ScrollView, Image, Dimensions,
  FlatList, Animated,
} from 'react-native';
import colors from '../styles/colors';

const { width } = Dimensions.get('window');
const SCREEN_W = width - 32;

// ─── Données des sections ──────────────────────────────────────────
const SECTIONS = [
  {
    id: 'normal_tests',
    title: 'الاختبارات العادية',
    desc: 'تعرف على كيفية إعداد الاختبارات العادية',
    slides: [
      {
        title: 'مواضع في سورة معينة',
        image: require('../../assets/instructions/surah_selection.png'),
        annotations: [
          { top: '16%', right: '10%', num: 1 },
          { top: '40%', right: '10%', num: 2 },
          { top: '63%', right: '10%', num: 3 },
          { top: '80%', right: '10%', num: 4 },
        ],
        explanations: [
          { num: 1, text: 'اختر السورة التي تريد اختبار حفظك فيها من القائمة المنسدلة' },
          { num: 2, text: 'حدد ترتيب الأسئلة: عشوائي (بدون ترتيب) أو حسب ترتيب المصحف' },
          { num: 3, text: 'أدخل عدد الأسئلة التي تريدها في هذا الاختبار ( هذه الميزة اختيارية و لكن تصبح اجبارية عند اختيار النمط المتسلسل لضمان تباعد المواضع )' },
          { num: 4, text: 'اضغط "بدأ الاختبار" للانتقال الى صفحة الدعاء و من ثم للإختبار' },
        ],
      },
      {
        title: 'مواضع في صفحات معينة',
        image: require('../../assets/instructions/page_selection.png'),
        annotations: [
          { top: '12%', right: '10%', num: 1 },
          { top: '28%', right: '10%', num: 2 },
          { top: '48%', right: '10%', num: 3 },
          { top: '62%', right: '10%', num: 4 },
          { top: '75%', right: '10%', num: 5 },
          { top: '87%', right: '10%', num: 6 },
        ],
        explanations: [
          { num: 1, text: 'أدخل رقم الصفحة الأولى من النطاق الذي تريد اختباره' },
          { num: 2, text: 'أدخل رقم الصفحة الأخيرة من النطاق' },
          { num: 3, text: 'حدد ترتيب الأسئلة: عشوائي أو حسب ترتيب المصحف' },
          { num: 4, text: 'أدخل عدد الأسئلة المطلوبة ( هذه الميزة اختيارية و لكن تصبح اجبارية عند اختيار النمط المتسلسل لضمان تباعد المواضع )' },
          { num: 5, text: 'اختر إن كنت تريد رؤية اسم السورة التي ورد فيها الموضع' },
          { num: 6, text: 'القرآن الكريم يحتوي على 604 صفحة في مصحف المدينة النبوية' },
        ],
      },
      {
        title: 'اختبار حسب الحزب',
        image: require('../../assets/instructions/hizb_selection.png'),
        annotations: [
          { top: '16%', right: '10%', num: 1 },
          { top: '42%', right: '10%', num: 2 },
          { top: '60%', right: '10%', num: 3 },
          { top: '76%', right: '10%', num: 4 },
        ],
        explanations: [
          { num: 1, text: 'اختر الحزب الذي تريد اختبار حفظك فيه من القائمة (1-60)' },
          { num: 2, text: 'حدد ترتيب الأسئلة حسب تفضيلك' },
          { num: 3, text: 'أدخل عدد الأسئلة المطلوبة ( هذه الميزة اختيارية و لكن تصبح اجبارية عند اختيار النمط المتسلسل لضمان تباعد المواضع )' },
          { num: 4, text: 'اختر إن كنت تريد رؤية اسم السورة التي ورد فيها الموضع' },
        ],
      },
      {
        title: 'اختبار حسب الأجزاء',
        image: require('../../assets/instructions/general_parts.png'),
        annotations: [
          { top: '12%', right: '10%', num: 1 },
          { top: '28%', right: '10%', num: 2 },
          { top: '52%', right: '10%', num: 3 },
          { top: '68%', right: '10%', num: 4 },
          { top: '82%', right: '10%', num: 5 },
        ],
        explanations: [
          { num: 1, text: 'اختر نوع التقسيم: أرباع (4 أجزاء)، أنصاف (2)، أثلاث (3)، أسداس (6)' },
          { num: 2, text: 'اختر الجزء المحدد الذي تريد اختباره بعد تحديد نوع التقسيم' },
          { num: 3, text: 'حدد ترتيب الأسئلة حسب تفضيلك' },
          { num: 4, text: 'أدخل عدد الأسئلة المطلوبة ( هذه الميزة اختيارية و لكن تصبح اجبارية عند اختيار النمط المتسلسل لضمان تباعد المواضع )' },
          { num: 5, text: 'اختر إن كنت تريد رؤية اسم السورة التي ورد فيها الموضع' },
        ],
      },
    ],
  },
  {
    id: 'custom_tests',
    title: 'الاختبارات المخصصة',
    desc: 'أنشئ اختبارك الخاص بحرية كاملة',
    slides: [
      {
        title: 'إعداد الاختبار المخصص',
        image: require('../../assets/instructions/custom_setup.png'),
        annotations: [
          { top: '15%', right: '10%', num: 1 },
          { top: '30%', right: '10%', num: 2 },
          { top: '45%', right: '10%', num: 3 },
          { top: '60%', right: '10%', num: 4 },
          { top: '72%', right: '10%', num: 5 },
          { top: '85%', right: '10%', num: 6 },
        ],
        explanations: [
          { num: 1, text: 'اختر مصدر الأسئلة: سور، نطاق صفحات، أو أحزاب' },
          { num: 2, text: 'حدد السور أو الصفحات أو الأحزاب التي تريد التدرب عليها' },
          { num: 3, text: 'أدخل عدد الأسئلة الإجمالي للاختبار ( اذا لم يتم تحديد عدد الاسئلة ، فإنها تضبط على ١٠ مواضع تلقائيا )' },
          { num: 4, text: 'اختر ترتيب الأسئلة: متسلسل حسب المصحف أو عشوائي' },
          { num: 5, text: 'عدد الآيات للقراءة: كم اية سوف تسرد في كل موضع' },
          { num: 6, text: 'اختر إن كنت تريد رؤية اسم السورة التي ورد فيها الموضع' },
        ],
      },
    ],
  },
  {
    id: 'test_interface',
    title: 'واجهة الاختبارات العادية',
    desc: 'تعرف على عناصر شاشة الاختبار',
    slides: [
      {
        title: 'شاشة الاختبار العادي',
        image: require('../../assets/instructions/test_screen.png'),
        annotations: [
          { top: '12%', left: '10%', num: 1 },
          { top: '12%', right: '10%', num: 2 },
          { top: '20%', left: '35%', num: 3 },
          { top: '42%', right: '10%', num: 4 },
          { top: '79%', right: '46%', num: 5 },
          { top: '87%', right: '10%', num: 6 },
          { top: '95%', right: '10%', num: 7 },
        ],
        explanations: [
          { num: 1, text: 'عداد الأخطاء: عدد المواضع التي التي أخطأت فيها' },
          { num: 2, text: 'عداد الصحيح: عدد المواضع التي التي لم تخطئ فيها' },
          { num: 3, text: 'رقم السؤال الحالي من إجمالي الأسئلة، واسم السورة ورقم الآية' },
          { num: 4, text: 'بطاقة الآية: تعرض الآية الكريمة مع رقم الصفحة والجزء في الأسفل' },
          { num: 5, text: '"التالية" و"السابقة": للتنقل بين الآيات في نفس الموضع  (في حالة الشك في صحة اجابتك تستطيع التنقل للاية المناسبة للتثبت من قراءتك )' },
          { num: 6, text: '"سؤال جديد": انتقل للموضع التالي وقيّم إجابتك صح أو خطأ' },
          { num: 7, text: '"إنهاء": أنهِ الاختبار في أي وقت وانظر نتائجك' },
        ],
      },
    ],
  },
  {
    id: 'custom_test_interface',
    title: 'واجهة الاختبارات المخصصة',
    desc: 'تعرف على عناصر شاشة الاختبار المخصص',
    slides: [
      {
        title: 'شاشة الاختبار المخصص',
        image: require('../../assets/instructions/custom_test_screen.png'),
        annotations: [
          { top: '4%', left: '5%', num: 1 },
          { top: '6%', right: '27%', num: 2 },
          { top: '13%', left: '46%', num: 3 },
          { top: '18%', right: '10%', num: 4 },
          { top: '22%', right: '59%', num: 5 },
          { top: '71%', right: '40%', num: 6 },
          { top: '82%', right: '10%', num: 7 },
          { top: '82%', left: '10%', num: 8 },
          { top: '91%', right: '10%', num: 9 },
        ],
        explanations: [
          { num: 1, text: 'زر الإغلاق: أنهِ الاختبار في أي وقت' },
          { num: 2, text: 'الوقت المنقضي منذ بداية الاختبار' },
          { num: 3, text: 'عداد الصحيح والخطأ' },
          { num: 4, text: 'رقم السؤال الحالي من إجمالي الأسئلة' },
          { num: 5, text: 'السياق: رقم الآية التي تبدأ منها القراءة' },
          { num: 6, text: 'بطاقة الآية مع عداد الآيات المقروءة من المطلوب' },
          { num: 7, text: '"الآية التالية": اعرض الآية التالية في نفس الموضع ( بعد كل اية تسردها تضغط عل الاية التالية كي لا نتجاوز عدد الايات التي حددناها في اعدادات الاختبار )' },
          { num: 8, text: `"السؤال التالي": انتقل للموضع التالي (في حالة اتممت الايات المطلوبة، يصبح الزر: السؤال التالي ✓، في حال نسيت الموضع تضغط على الزر قبل تمام الآيات المطلوبة وتعتبر إجابة خاطئة)` },
          { num: 9, text: '"إنهاء": أنهِ الاختبار وانظر نتائجك النهائية' },
        ],
      },
    ],
  },
];

// ─── Composant Annotation ─────────────────────────────────────────
const Annotation = ({ top, left, right, num, active }) => (
  <View style={[
    styles.annotationDot,
    { top: top },
    left !== undefined ? { left } : { right },
    active && styles.annotationDotActive,
  ]}>
    <Text style={styles.annotationNum}>{num}</Text>
  </View>
);

// ─── Composant Slide ──────────────────────────────────────────────
const Slide = ({ slide, activeAnnotation, onNext, isLast, sectionDone }) => {
  const currentExplanation = slide.explanations[activeAnnotation];
  const progress = activeAnnotation + 1;
  const total = slide.explanations.length;

  return (
    <View style={styles.slideContainer}>
      {/* Screenshot avec annotations */}
      <View style={styles.screenshotWrap}>
        <Image
          source={slide.image}
          style={styles.screenshot}
          resizeMode="contain"
        />
        {slide.annotations.map((ann, i) => (
          <Annotation
            key={i}
            top={ann.top}
            left={ann.left}
            right={ann.right}
            num={ann.num}
            active={i === activeAnnotation}
          />
        ))}
      </View>

      {/* Tooltip explication */}
      {!sectionDone && currentExplanation && (
        <View style={styles.tooltip}>
          <View style={styles.tooltipHeader}>
            <View style={styles.progressDots}>
              {slide.explanations.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i < activeAnnotation && styles.progressDotDone,
                    i === activeAnnotation && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.tooltipStep}>{progress}/{total}</Text>
          </View>

          <View style={styles.tooltipNumWrap}>
            <Text style={styles.tooltipNumText}>{currentExplanation.num}</Text>
          </View>
          <Text style={styles.tooltipText}>{currentExplanation.text}</Text>

          <TouchableOpacity
            style={[styles.understoodBtn, isLast && styles.understoodBtnLast]}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.understoodBtnText}>
              {isLast ? 'تم ✓' : 'فهمت '}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {sectionDone && (
        <View style={styles.doneBox}>
          <Text style={styles.doneIcon}>✦</Text>
          <Text style={styles.doneText}>أحسنت! أنت جاهز لاستخدام هذه الميزة</Text>
        </View>
      )}
    </View>
  );
};

// ─── Composant Section Card ───────────────────────────────────────
const SectionCard = ({ section }) => {
  const [expanded, setExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeAnnotation, setActiveAnnotation] = useState(0);
  const [sectionDone, setSectionDone] = useState(false);
  const flatRef = useRef(null);

  const slide = section.slides[currentSlide];
  const totalAnnotations = slide.explanations.length;
  const isLastAnnotation = activeAnnotation === totalAnnotations - 1;
  const isLastSlide = currentSlide === section.slides.length - 1;

  const handleNext = () => {
    if (!isLastAnnotation) {
      setActiveAnnotation(a => a + 1);
    } else if (!isLastSlide) {
      setCurrentSlide(s => s + 1);
      setActiveAnnotation(0);
      flatRef.current?.scrollToIndex({ index: currentSlide + 1, animated: true });
    } else {
      setSectionDone(true);
    }
  };

  const handleOpen = () => {
    setExpanded(e => !e);
    if (!expanded) {
      setCurrentSlide(0);
      setActiveAnnotation(0);
      setSectionDone(false);
    }
  };

  return (
    <View style={[styles.sectionCard, expanded && styles.sectionCardExpanded]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={handleOpen}
        activeOpacity={0.8}
      >
        <View style={styles.arrowWrap}>
          <Text style={[styles.arrowIcon, expanded && styles.arrowIconOpen]}>›</Text>
        </View>
        <View style={styles.sectionRight}>
          <View style={styles.sectionIconWrap}>
            <Text style={styles.sectionIcon}>{section.icon}</Text>
          </View>
          <View style={styles.sectionTexts}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionDesc}>{section.desc}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          {/* Onglets slides si multiple */}
          {section.slides.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabsScroll}
              contentContainerStyle={styles.tabsContent}
            >
              {section.slides.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.tab, currentSlide === i && styles.tabActive]}
                  onPress={() => { setCurrentSlide(i); setActiveAnnotation(0); setSectionDone(false); }}
                >
                  <Text style={[styles.tabText, currentSlide === i && styles.tabTextActive]}>
                    {s.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Slide
            slide={slide}
            activeAnnotation={activeAnnotation}
            onNext={handleNext}
            isLast={isLastAnnotation && isLastSlide}
            sectionDone={sectionDone}
          />
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────
const InstructionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>›</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>دليل الاستخدام</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>مرحباً بك في إتقان ✦</Text>
          <Text style={styles.welcomeSub}>
            اضغط على أي قسم لتتعلم كيفية استخدامه خطوة بخطوة
          </Text>
        </View>

        <Text style={styles.sectionLabel}>الاختبارات</Text>
        {SECTIONS.slice(0, 2).map(s => <SectionCard key={s.id} section={s} />)}

        <Text style={styles.sectionLabel}>واجهة الاختبار</Text>
        {SECTIONS.slice(2, 4).map(s => <SectionCard key={s.id} section={s} />)}

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },

  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    justifyContent: 'center'
  },
  backBtn: {
    top: 35,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  backIcon: { fontSize: 26, color: colors.textLight, transform: [{ rotate: '180deg' }], top: 4},
  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.textLight,
    alignSelf: "center"
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  welcomeCard: {
    backgroundColor: colors.secondaryLight, borderRadius: 18,
    padding: 18, marginBottom: 20, alignItems: 'flex-end',
    borderColor: colors.secondary, borderWidth: 2,
  },
  welcomeTitle: {
    color: colors.secondary, fontSize: 16, fontWeight: '700',
    marginBottom: 6,
  },
  welcomeSub: {
    color: 'rgba(92, 90, 90, 0.56)', fontSize: 13, lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  sectionLabel: {
    fontSize: 12, color: colors.textSecondary, fontWeight: '600',
    textAlign: 'right', marginBottom: 10, marginTop: 4,
  },

  sectionCard: {
    backgroundColor: colors.bgPaper, borderRadius: 16,
    borderWidth: 2, borderColor: colors.borderLight,
    marginBottom: 12, overflow: 'hidden',
  },
  sectionCardExpanded: { borderColor: 'rgba(212,175,55,0.4)' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 14,
  },
  arrowWrap: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 18, color: colors.secondary,
    transform: [{ rotate: '180deg' }],
    top: 3
  },
  arrowIconOpen: { transform: [{ rotate: '90deg' }] },
  sectionRight: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' },
  sectionTexts: { alignItems: 'flex-end' },
  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: colors.textPrimary,
  },
  sectionDesc: {
    fontSize: 11, color: colors.textSecondary, marginTop: 2,
  },

  expandedContent: { borderTopWidth: 2, borderTopColor: colors.borderLight },

  tabsScroll: { backgroundColor: colors.bgPaper },
  tabsContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  tab: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: colors.borderLight,
    backgroundColor: colors.bgLight,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 11, color: colors.textSecondary, fontFamily: 'ScheherazadeNew_400Regular' },
  tabTextActive: { color: colors.textLight, fontWeight: '600' },

  slideContainer: { padding: 14 },

  screenshotWrap: {
    position: 'relative', alignItems: 'center',
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.secondary,
    backgroundColor: colors.bgWhite, marginBottom: 12,
  },
  screenshot: {
    width: SCREEN_W - 28,
    height: (SCREEN_W - 28) * 1.8,
  },

  annotationDot: {
    position: 'absolute', width: 26, height: 26,
    borderRadius: 13, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'white',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  annotationDotActive: {
    backgroundColor: colors.secondary,
    transform: [{ scale: 1.15 }],
  },
  annotationNum: {
    fontSize: 11, fontWeight: '800', color: 'white',
  },

  tooltip: {
    backgroundColor: colors.textPrimary, borderRadius: 14,
    padding: 14, marginBottom: 4,
  },
  tooltipHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  progressDots: { flexDirection: 'row', gap: 4 },
  progressDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressDotActive: { width: 16, backgroundColor: colors.secondary },
  progressDotDone: { backgroundColor: 'rgba(212,175,55,0.5)' },
  tooltipStep: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },

  tooltipNumWrap: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'flex-end', marginBottom: 8,
  },
  tooltipNumText: { fontSize: 11, fontWeight: '800', color: colors.textPrimary },

  tooltipText: {
    fontSize: 13, color: 'white', lineHeight: 22,
    textAlign: 'right', writingDirection: 'rtl', marginBottom: 14,
  },

  understoodBtn: {
    backgroundColor: colors.primary, borderRadius: 10,
    paddingVertical: 10, alignItems: 'center',
  },
  understoodBtnLast: { backgroundColor: colors.secondary },
  understoodBtnText: {
    fontSize: 14, fontWeight: '700', color: 'white',
  },

  doneBox: {
    backgroundColor: 'rgba(45,90,62,0.08)', borderRadius: 14,
    padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(45,90,62,0.15)',
  },
  doneIcon: { fontSize: 28, color: colors.secondary, marginBottom: 8 },
  doneText: {
    fontSize: 14, color: colors.primary, fontWeight: '600',
    textAlign: 'center',
  },
});

export default InstructionsScreen;