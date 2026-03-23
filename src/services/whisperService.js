const OPENAI_API_KEY = 'sk-your-openai-key-here'; // move to .env later

export const transcribeAudio = async (fileUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: 'audio/m4a',
    name: 'recitation.m4a',
  });
  formData.append('model', 'whisper-1');
  formData.append('language', 'ar');
  formData.append('response_format', 'verbose_json'); // gives word-level timing

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });

  const data = await response.json();

  // Extract pause durations between words
  const pauseInfo = data.words?.map((w, i) => {
    const next = data.words[i + 1];
    return next
      ? `"${w.word}" ← وقفة ${(next.start - w.end).toFixed(2)}ث → "${next.word}"`
      : null;
  }).filter(Boolean).join('\n');

  return { text: data.text, pauseInfo };
};