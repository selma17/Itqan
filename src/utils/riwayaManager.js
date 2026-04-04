// src/utils/riwayaManager.js
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RIWAYAT } from '../data/riwayat';

const STORAGE_KEY_TEST    = 'riwaya_test';
const STORAGE_KEY_MUSHAF  = 'riwaya_mushaf';

// ── Chemin local d'un JSON téléchargé ─────────────────────────────
const getLocalPath = (riwayaId) =>
  FileSystem.documentDirectory + `${riwayaId}Quran.json`;

// ── Vérifier si une riwaya est disponible localement ──────────────
export const isRiwayaDownloaded = async (riwayaId) => {
  if (riwayaId === 'qaloon') return true; // toujours bundlé
  const path = getLocalPath(riwayaId);
  const info = await FileSystem.getInfoAsync(path);
  return info.exists;
};

// ── Télécharger une riwaya ─────────────────────────────────────────
// onProgress(fraction) — fraction entre 0 et 1
export const downloadRiwaya = async (riwayaId, onProgress) => {
  const riwaya = RIWAYAT[riwayaId];
  if (!riwaya || riwaya.bundled) return { success: true };

  const localPath = getLocalPath(riwayaId);

  const downloadResumable = FileSystem.createDownloadResumable(
    riwaya.downloadUrl,
    localPath,
    {
        headers: {
        'Accept': 'application/octet-stream',
        }
    },
    ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        if (onProgress && totalBytesExpectedToWrite > 0) {
        onProgress(totalBytesWritten / totalBytesExpectedToWrite);
        }
    }
    );

    console.log('Downloading from:', riwaya.downloadUrl);
    const result = await downloadResumable.downloadAsync();
    console.log('Download result:', result);

  try {
    const result = await downloadResumable.downloadAsync();
    if (result && result.status === 200) {
      return { success: true, path: localPath };
    }
    return { success: false, error: 'statut inattendu' };
  } catch (e) {
    console.error('Download error:', e);
    return { success: false, error: e.message };
  }
};

// ── Supprimer une riwaya téléchargée ──────────────────────────────
export const deleteRiwaya = async (riwayaId) => {
  if (riwayaId === 'qaloon') return; // ne jamais supprimer qaloon
  const path = getLocalPath(riwayaId);
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) await FileSystem.deleteAsync(path);
};

// ── Charger les données d'une riwaya ──────────────────────────────
export const loadRiwayaData = async (riwayaId) => {
  if (riwayaId === 'qaloon') {
    return require('../data/qaloonQuran.json');
  }
  const path = getLocalPath(riwayaId);
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) throw new Error(`Riwaya ${riwayaId} non téléchargée`);
  const content = await FileSystem.readAsStringAsync(path);
  return JSON.parse(content);
};

// ── Taille d'un fichier téléchargé (en MB) ────────────────────────
export const getRiwayaFileSize = async (riwayaId) => {
  if (riwayaId === 'qaloon') return null;
  const path = getLocalPath(riwayaId);
  const info = await FileSystem.getInfoAsync(path, { size: true });
  if (!info.exists) return null;
  return (info.size / (1024 * 1024)).toFixed(1); // MB
};

// ── Persistance AsyncStorage ───────────────────────────────────────
export const getActiveTestRiwaya = async () => {
  const val = await AsyncStorage.getItem(STORAGE_KEY_TEST);
  return val || 'qaloon'; // défaut : qaloon
};

export const setActiveTestRiwaya = async (riwayaId) => {
  await AsyncStorage.setItem(STORAGE_KEY_TEST, riwayaId);
};

export const getActiveMushafRiwaya = async () => {
  const val = await AsyncStorage.getItem(STORAGE_KEY_MUSHAF);
  return val || 'hafs'; // défaut : hafs
};

export const setActiveMushafRiwaya = async (riwayaId) => {
  await AsyncStorage.setItem(STORAGE_KEY_MUSHAF, riwayaId);
};