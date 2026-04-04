// src/context/QuranContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { getActiveTestRiwaya } from '../utils/riwayaManager';
import { buildQuranData } from '../data/quranData';

export const QuranContext = createContext(null);

const normalizeRawData = (data) => {
  return data.map(item => ({
    ...item,
    sura_no:      item.sura_no      ?? item.sora      ?? 1,
    sura_name_ar: item.sura_name_ar ?? item.sora_name_ar ?? '',
    sura_name_en: item.sura_name_en ?? item.sora_name_en ?? '',
    aya_no:       item.aya_no       ?? 1,
    aya_text:     item.aya_text     ?? '',
    page:         item.page         ?? 1,
    jozz:         item.jozz         ?? 1,
    hizb:         item.hizb         ?? 1,
    line_start:   item.line_start   ?? 1,
    line_end:     item.line_end     ?? 1,
  }));
};

export const QuranProvider = ({ children }) => {
  const [rawData, setRawData]           = useState(null);
  const [quranData, setQuranData]       = useState(null);
  const [activeRiwaya, setActiveRiwaya] = useState('qaloon');
  const [loading, setLoading]           = useState(true);

  const loadRiwaya = async () => {
    setLoading(true);
    try {
      const riwayaId = await getActiveTestRiwaya();
      setActiveRiwaya(riwayaId);

      let data;
      if (riwayaId === 'qaloon') {
        data = require('../data/qaloonQuran.json');
      } else {
        const path = FileSystem.documentDirectory + `${riwayaId}Quran.json`;
        const info = await FileSystem.getInfoAsync(path);
        if (info.exists) {
          const content = await FileSystem.readAsStringAsync(path);
          data = JSON.parse(content);
        } else {
          data = require('../data/qaloonQuran.json');
          setActiveRiwaya('qaloon');
        }
      }

      const normalized = normalizeRawData(data);
      setRawData(normalized);
      setQuranData(buildQuranData(normalized));
    } catch (e) {
      console.error('QuranContext: erreur chargement riwaya', e);
      const fallback = require('../data/qaloonQuran.json');
      const normalized = normalizeRawData(fallback);
      setRawData(normalized);
      setQuranData(buildQuranData(normalized));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiwaya();
  }, []);

  return (
    <QuranContext.Provider value={{ rawData, quranData, activeRiwaya, loading, reloadRiwaya: loadRiwaya }}>
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => useContext(QuranContext);