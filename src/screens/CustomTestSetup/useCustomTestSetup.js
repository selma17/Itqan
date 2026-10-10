import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import quranData from '../../data/quranData';
import useTestSetupForm from '../../hooks/useTestSetupForm';
import { showMessage } from '../../utils/notify';

const DEFAULT_VERSES_TO_READ = 3;
const APPROX_VERSES_PER_PAGE = 15;
const APPROX_VERSES_PER_HIZB = 20;

const EMPTY_RANGE = { from: '', to: '' };
const hasBothBounds = (range) => range.from && range.to;

const useCustomTestSetup = (navigation, route) => {
  const autoStartParams = route.params;
  const form = useTestSetupForm({ defaultQuestionCount: '10' });

  const [sourceType, setSourceType] = useState('surahs');
  const [selectedSurahs, setSelectedSurahs] = useState([]);
  const [pageRanges, setPageRanges] = useState([EMPTY_RANGE]);
  const [selectedHizbs, setSelectedHizbs] = useState([]);
  const [versesToRead, setVersesToRead] = useState('');

  // Relance directe d'un test sauvegardé
  useEffect(() => {
    if (autoStartParams?.autoStart) {
      navigation.replace('CustomTest', {
        sourceType: autoStartParams.sourceType,
        selectedSurahs: autoStartParams.selectedSurahs,
        pageRanges: autoStartParams.pageRanges,
        selectedHizbs: autoStartParams.selectedHizbs,
        mode: autoStartParams.mode,
        versesToRead: autoStartParams.versesToRead,
      });
    }
  }, [autoStartParams, navigation]);

  // ── Plages de pages ──
  const addPageRange = () => setPageRanges(ranges => [...ranges, EMPTY_RANGE]);

  const removePageRange = (index) =>
    setPageRanges(ranges => (ranges.length > 1 ? ranges.filter((_, i) => i !== index) : ranges));

  const changePageRange = (index, field, value) =>
    setPageRanges(ranges => ranges.map((r, i) => (i === index ? { ...r, [field]: value } : r)));

  // ── Sélections ──
  const removeSurah = (surahNumber) => setSelectedSurahs(list => list.filter(s => s !== surahNumber));
  const removeHizb = (hizbNumber) => setSelectedHizbs(list => list.filter(h => h !== hizbNumber));

  const selectedSurahBadges = selectedSurahs.map(n => ({
    key: n,
    label: quranData.surahs.find(s => s.number === n)?.name,
  }));
  const selectedHizbBadges = selectedHizbs.map(n => ({ key: n, label: `حزب ${n}` }));

  // Estimation indicative du nombre de versets disponibles dans la source.
  const estimateSourceVerses = () => {
    if (sourceType === 'surahs') {
      if (selectedSurahs.length === 0) return { error: 'الرجاء اختيار سورة واحدة على الأقل أولاً' };
      const total = selectedSurahs.reduce(
        (sum, n) => sum + (quranData.surahs.find(s => s.number === n)?.verses || 0),
        0
      );
      return { total };
    }

    if (sourceType === 'pages') {
      const validRanges = pageRanges.filter(hasBothBounds);
      if (validRanges.length === 0) return { error: 'الرجاء إدخال نطاق صفحات صحيح أولاً' };
      const total = validRanges.reduce((sum, r) => {
        const from = parseInt(r.from, 10);
        const to = parseInt(r.to, 10);
        return from && to && from <= to ? sum + (to - from + 1) * APPROX_VERSES_PER_PAGE : sum;
      }, 0);
      return { total };
    }

    if (selectedHizbs.length === 0) return { error: 'الرجاء اختيار حزب واحد على الأقل أولاً' };
    return { total: selectedHizbs.length * APPROX_VERSES_PER_HIZB };
  };

  // Au focus du champ "versets à lire", on vérifie que la source est suffisante.
  const checkVersesToRead = () => {
    const needed = parseInt(versesToRead, 10) || DEFAULT_VERSES_TO_READ;
    const { total, error } = estimateSourceVerses();

    if (error) {
      showMessage(error, { long: true });
    } else if (total >= needed) {
      showMessage(`✓ المصدر المحدد يحتوي على ${total} آية تقريباً، وهو كافٍ لعدد الآيات المطلوب (${needed} آية)`, { long: true });
    } else {
      showMessage(`⚠ تحذير: المصدر المحدد يحتوي على ${total} آية تقريباً فقط، وقد لا يكون كافياً لعدد الآيات المطلوب (${needed} آية)`, { long: true });
    }
  };

  // Retourne le message d'erreur (titre + texte) ou null si tout est valide.
  const validate = () => {
    if (sourceType === 'surahs' && selectedSurahs.length === 0) {
      return ['تنبيه', 'الرجاء اختيار سورة واحدة على الأقل'];
    }

    if (sourceType === 'pages') {
      const validRanges = pageRanges.filter(hasBothBounds);
      if (validRanges.length === 0) return ['تنبيه', 'الرجاء إدخال نطاق صفحات صحيح'];
      const invalid = validRanges.some(r => {
        const from = parseInt(r.from, 10);
        const to = parseInt(r.to, 10);
        return from > to || from < 1 || to > 604;
      });
      if (invalid) return ['خطأ', 'نطاق الصفحات غير صحيح (1-604)'];
    }

    if (sourceType === 'hizbs' && selectedHizbs.length === 0) {
      return ['تنبيه', 'الرجاء اختيار حزب واحد على الأقل'];
    }

    const qCount = parseInt(form.questionCount, 10);
    if (!qCount || qCount < 1 || qCount > 100) return ['خطأ', 'عدد الأسئلة يجب أن يكون بين 1 و 100'];

    const vCount = parseInt(versesToRead, 10);
    if (!vCount || vCount < 1 || vCount > 20) return ['خطأ', 'عدد الآيات يجب أن يكون بين 1 و 20'];

    return null;
  };

  const validateAndStart = () => {
    const error = validate();
    if (error) {
      Alert.alert(...error);
      return;
    }

    navigation.navigate('Duaa', {
      sourceType,
      selectedSurahs,
      pageRanges: pageRanges.filter(hasBothBounds),
      selectedHizbs,
      questionCount: parseInt(form.questionCount, 10),
      mode: form.mode,
      versesToRead: parseInt(versesToRead, 10),
      showSurahName: form.showSurahName,
    });
  };

  return {
    form,
    sourceType,
    setSourceType,
    selectedSurahs,
    setSelectedSurahs,
    selectedSurahBadges,
    removeSurah,
    pageRanges,
    addPageRange,
    removePageRange,
    changePageRange,
    selectedHizbs,
    setSelectedHizbs,
    selectedHizbBadges,
    removeHizb,
    versesToRead,
    setVersesToRead,
    checkVersesToRead,
    validateAndStart,
    goBack: () => navigation.goBack(),
  };
};

export default useCustomTestSetup;
