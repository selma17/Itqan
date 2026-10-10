import { useEffect, useMemo } from 'react';
import colors from '../../styles/colors';
import { useQuran } from '../../context/QuranContext';
import { getJSON, setJSON, STORAGE_KEYS } from '../../services/storage';
import { formatDuration } from '../../utils/format';
import { buildSurahNames, getHizbLabel, getPageSurahs, getPerformance } from './sourceInfo';

const useCustomResults = (navigation, route) => {
  const { rawData } = useQuran();
  const {
    score, errors, totalQuestions, duration,
    sourceType, selectedSurahs, pageRanges, selectedHizbs,
    mode, versesToRead, showSurahName,
  } = route.params;

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const performance = getPerformance(percentage, colors);

  // Paramètres permettant de relancer exactement le même test
  const testParams = {
    sourceType, selectedSurahs, pageRanges, selectedHizbs,
    mode, versesToRead, showSurahName,
    questionCount: totalQuestions,
  };

  // Sauvegarde dès l'arrivée sur l'écran de résultats
  useEffect(() => {
    setJSON(STORAGE_KEYS.LAST_TEST_PARAMS, testParams).catch(error =>
      console.error('Erreur lors de la sauvegarde des paramètres:', error)
    );
  }, [sourceType, selectedSurahs, pageRanges, selectedHizbs, mode, versesToRead, showSurahName, totalQuestions]);

  const surahNames = useMemo(() => buildSurahNames(rawData), [rawData]);
  const getSurahName = (number) => surahNames[number] || `سورة ${number}`;
  const getHizb = (number) => getHizbLabel(rawData, number);

  const getSourceDescription = () => {
    if (sourceType === 'surahs') {
      return selectedSurahs.length === 1 ? getSurahName(selectedSurahs[0]) : `${selectedSurahs.length} سور`;
    }
    if (sourceType === 'pages') {
      const totalPages = pageRanges.reduce((sum, r) => sum + (parseInt(r.to, 10) - parseInt(r.from, 10) + 1), 0);
      return `${totalPages} صفحة`;
    }
    if (sourceType === 'hizbs') {
      return selectedHizbs.length === 1 ? getHizb(selectedHizbs[0]) : `${selectedHizbs.length} أحزاب`;
    }
    return '';
  };

  // Détail affiché sous la source (puces) : sourates, plages de pages ou hizbs.
  const showSurahChips = sourceType === 'surahs' && selectedSurahs.length > 1 && selectedSurahs.length <= 5;
  const showHizbChips = sourceType === 'hizbs' && selectedHizbs.length > 1 && selectedHizbs.length <= 5;

  const surahChips = showSurahChips ? selectedSurahs.map(n => ({ key: n, label: getSurahName(n) })) : [];
  const hizbChips = showHizbChips ? selectedHizbs.map(n => ({ key: n, label: `حزب ${n} • ${getHizb(n)}` })) : [];

  const pageRangeDetails = sourceType === 'pages'
    ? pageRanges.map((range, index) => ({
        key: index,
        label: `صفحة ${range.from} - ${range.to}`,
        surahs: [...new Set([
          ...getPageSurahs(rawData, parseInt(range.from, 10)),
          ...getPageSurahs(rawData, parseInt(range.to, 10)),
        ])],
      }))
    : [];

  const retryTest = async () => {
    try {
      const saved = await getJSON(STORAGE_KEYS.LAST_TEST_PARAMS);
      if (saved) navigation.navigate('Duaa', saved);
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      navigation.navigate('Duaa', testParams);
    }
  };

  return {
    score,
    errors,
    totalQuestions,
    versesToRead,
    percentage,
    performance,
    sourceDescription: getSourceDescription(),
    chips: [...surahChips, ...hizbChips],
    pageRangeDetails,
    modeLabel: mode === 'sequential' ? 'متسلسل' : 'عشوائي',
    durationLabel: formatDuration(duration),
    retryTest,
    newTest: () => navigation.navigate('CustomTestSetup'),
    backToTests: () => navigation.navigate('Tests'),
  };
};

export default useCustomResults;
