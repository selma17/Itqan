const LEVELS = [
  { min: 90, title: 'ممتاز', message: 'بارك الله فيك', emoji: '🌟' },
  { min: 75, title: 'جيد جداً', message: 'واصل بإذن الله', emoji: '⭐' },
  { min: 60, title: 'جيد', message: 'استمر في المراجعة', emoji: '✨' },
  { min: 0, title: 'راجع حفظك', message: 'بالمثابرة ستصل للإتقان', emoji: '❤️' },
];

const useResults = (navigation, route) => {
  const { score, errors, ...testParams } = route.params;

  const total = score + errors;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const level = LEVELS.find(l => percentage >= l.min);

  return {
    score,
    errors,
    total,
    percentage,
    level,
    backToTests: () => navigation.navigate('Tests'),
    // Relance le même test via l'écran de du'a avec les mêmes paramètres.
    restartTest: () => navigation.navigate('Duaa', testParams),
  };
};

export default useResults;
