// Cartes du menu des tests : route cible, icône et textes.
export const TEST_CARDS = [
  {
    route: 'SurahSelection',
    icon: require('../../../assets/SurahTestIcon.png'),
    title: 'مواضع في سورة معينة',
    description: 'اختر سورة واختبر حفظك آياتها',
  },
  {
    route: 'PageSelection',
    icon: require('../../../assets/PageTestIcon.png'),
    title: 'مواضع في صفحات معينة',
    description: 'حدد نطاق الصفحات من المصحف',
  },
  {
    route: 'HizbSelection',
    icon: require('../../../assets/HizbTestIcon.png'),
    title: 'مواضع في حزب معيّن',
    description: 'اختر حزب واختبر حفظك فيه',
  },
  {
    route: 'GeneralPartsSelection',
    icon: require('../../../assets/GeneralPartsTest.png'),
    compactIcon: true,
    title: 'مواضع شاملة من القرآن',
    description: 'إختبارات في أنصاف و أرباع القرآن',
  },
  {
    route: 'CustomTestSetup',
    icon: require('../../../assets/CustomTesticon.png'),
    title: 'أنشئ اختبارك الخاصّ',
    description: 'خصّص اختبارك وابدأ التحدّي بطريقتك',
  },
];
