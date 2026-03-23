const ANTHROPIC_API_KEY = 'sk-ant-your-key-here'; // move to .env later

const TAJWEED_SYSTEM_PROMPT = `
أنت خبير في علم التجويد برواية قالون عن نافع المدني.
مهمتك تقييم تلاوة القارئ وتحديد الأخطاء بدقة.

قواعد رواية قالون التي يجب التحقق منها:
1. تفخيم لفظ الجلالة بعد الفتح والضم، وترقيقه بعد الكسر
2. المد المنفصل عند قالون: حركتان أو أربع
3. إدغام النون الساكنة والتنوين في حروف يرملون
4. الإخفاء الحقيقي عند الحروف الخمسة عشر
5. أحكام الوقف والابتداء ومدة الوقف على رؤوس الآي
6. الغنة في الإدغام بغنة والإخفاء
7. تسهيل الهمز المخصوص بقالون في مواضعه
8. السكت المخصوص بقالون في مواضعه

أعد JSON فقط بهذا الشكل بدون أي نص خارجه:
{
  "overall_score": number (0-100),
  "mistakes": [
    {
      "word": "الكلمة",
      "word_index": number,
      "severity": "error" | "warning",
      "type": "تفخيم_ترقيق" | "مد" | "إدغام" | "إخفاء" | "وقف" | "نطق" | "غنة" | "همز" | "سكت",
      "description_ar": "وصف الخطأ بالعربية",
      "expected": "ما يجب أن يكون",
      "heard": "ما سُمع"
    }
  ],
  "praise": "جملة تشجيعية قصيرة",
  "tip": "نصيحة واحدة للتحسين"
}
`;

export const evaluateRecitation = async (verseText, transcript, pauseInfo) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: TAJWEED_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `
الآية المطلوب تلاوتها:
${verseText}

ما سمعته من القارئ:
${transcript}

توقيت الوقفات بين الكلمات:
${pauseInfo || 'غير متاح'}

قيّم هذه التلاوة برواية قالون وأعد JSON فقط.
        `
      }]
    })
  });

  const data = await response.json();
  const jsonText = data.content[0].text.trim();
  return JSON.parse(jsonText);
};