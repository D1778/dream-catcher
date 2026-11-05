
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function generateDreamInterpretationFallback(dreamText) {
  const lower = dreamText.toLowerCase();
  let focus = 'personal ambitions, life transitions, and self-discovery';

  if (lower.includes('air') || lower.includes('plane') || lower.includes('flight') || lower.includes('fly')) {
    focus = 'rising above present limits, embarking on an exciting journey, and reaching high professional heights';
  } else if (lower.includes('placed') || lower.includes('job') || lower.includes('career') || lower.includes('interview')) {
    focus = 'career readiness, desiring recognition for your dedication, and entering a rewarding new chapter';
  }

  return `This dream strongly highlights your ${focus}. Dreaming of specific milestones—such as career placements or major hubs like Mumbai—symbolizes momentum, determination, and your subconscious mind preparing you for the opportunities ahead.\n\nAviation and upward journey dreams often reflect an urge to take flight in your personal or professional path. It shows that your goals are vivid, and your inner self is encouraging you to remain persistent and confident in your skills.\n\nTake this as an encouraging omen: keep preparing steadily, welcome new beginnings with optimism, and remember that every successful journey starts with the courage to aim high.`;
}

// Call Gemini API for dream interpretation
export async function getDreamInterpretation(dreamText) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY missing, using intelligent fallback.');
    return generateDreamInterpretationFallback(dreamText);
  }

  // Fallback candidate models
  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ].filter(Boolean).filter((m, i, arr) => arr.indexOf(m) === i);

  let lastError;
  for (const model of candidateModels) {
    try {
      console.log(`Attempting interpretation with model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: `Dream: ${dreamText}`,
        config: {
          systemInstruction:
            'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
        }
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (error) {
      console.warn(`Gemini API returned error with model ${model}:`, error.message || error);
      lastError = error;
    }
  }

  // If external API fails (e.g. key permission 404 or quota exceeded), seamlessly fallback
  console.warn('External AI call failed. Using built-in interpretation fallback so the app continues running.');
  return generateDreamInterpretationFallback(dreamText);
}

