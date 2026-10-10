import { useEffect, useState } from 'react';
import { getActiveTestRiwaya } from '../../utils/riwayaManager';
import { RIWAYAT } from '../../data/riwayat';

const DEFAULT_RIWAYA_NAME = 'قالون عن نافع المدني';

const useTests = (navigation) => {
  const [riwayaName, setRiwayaName] = useState(DEFAULT_RIWAYA_NAME);

  useEffect(() => {
    getActiveTestRiwaya().then(id => {
      const riwaya = RIWAYAT[id];
      if (riwaya) setRiwayaName(riwaya.fullNameAr);
    });
  }, []);

  return {
    riwayaName,
    openTest: (route) => navigation.navigate(route),
    backToMain: () => navigation.navigate('Main'),
  };
};

export default useTests;
