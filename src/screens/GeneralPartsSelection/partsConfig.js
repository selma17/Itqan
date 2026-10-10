// Définition des parties du Coran et leurs plages de hizbs (hizbs 1-60)
export const PARTS = {
  quarters: [
    { id: 1, label: 'الربع الأول',   hizbFrom: 1,  hizbTo: 15 },
    { id: 2, label: 'الربع الثاني',  hizbFrom: 16, hizbTo: 30 },
    { id: 3, label: 'الربع الثالث',  hizbFrom: 31, hizbTo: 45 },
    { id: 4, label: 'الربع الأخير',  hizbFrom: 46, hizbTo: 60 },
  ],
  halves: [
    { id: 1, label: 'النصف الأول',  hizbFrom: 1,  hizbTo: 30 },
    { id: 2, label: 'النصف الثاني', hizbFrom: 31, hizbTo: 60 },
  ],
  thirds: [
    { id: 1, label: 'الثلث الأول',  hizbFrom: 1,  hizbTo: 20 },
    { id: 2, label: 'الثلث الثاني', hizbFrom: 21, hizbTo: 40 },
    { id: 3, label: 'الثلث الأخير', hizbFrom: 41, hizbTo: 60 },
  ],
  sixths: [
    { id: 1, label: 'السدس الأول',  hizbFrom: 1,  hizbTo: 10 },
    { id: 2, label: 'السدس الثاني', hizbFrom: 11, hizbTo: 20 },
    { id: 3, label: 'السدس الثالث', hizbFrom: 21, hizbTo: 30 },
    { id: 4, label: 'السدس الرابع', hizbFrom: 31, hizbTo: 40 },
    { id: 5, label: 'السدس الخامس', hizbFrom: 41, hizbTo: 50 },
    { id: 6, label: 'السدس الأخير', hizbFrom: 51, hizbTo: 60 },
  ],
};

export const CATEGORY_LABELS = {
  quarters: 'الأرباع',
  halves:   'الأنصاف',
  thirds:   'الأثلاث',
  sixths:   'الأسداس',
};

export const CATEGORY_OPTIONS = Object.keys(PARTS).map(cat => ({
  value: cat,
  label: CATEGORY_LABELS[cat],
}));
