// Funciones IA con Google GenAI
import type { GameState, DilemmaResponse, EvaluationResponse, Role } from '../types';

// Browser-friendly fetch wrapper for Google GenAI REST API
const GENAI_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';
async function callGenAI(prompt: string): Promise<string> {
  const res = await fetch(`${GENAI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: { text: prompt },
      model: 'text-bison-001'
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.output;
}

export const generateDilemma = async (role: Role, gameState: GameState): Promise<DilemmaResponse> => {
    const prompt = `Eres el rol ${role.title}. Estado del juego: ${JSON.stringify(gameState)}. ` +
        `Proporciona un dilema con descripción y tres opciones de respuesta, formato JSON:` +
        `{ "dilemmaDescription": string, "choices": [{ "id": string, "text": string }] }`;
    try {
        const output = await callGenAI(prompt);
        return JSON.parse(output || '') as DilemmaResponse;
    } catch (err) {
        console.warn('AI generateDilemma failed, falling back to simulation', err);
        return {
            dilemmaDescription: 'Simulación: ¿Cómo debe responder tu rol ante la amenaza?',
            choices: [
                { id: 'A', text: 'Opción simulada A' },
                { id: 'B', text: 'Opción simulada B' },
                { id: 'C', text: 'Opción simulada C' }
            ]
        };
    }
};

export const evaluateDecision = async (role: Role, choiceText: string, gameState: GameState): Promise<EvaluationResponse> => {
    const prompt = `Eres el rol ${role.title}. Estado del juego: ${JSON.stringify(gameState)}. ` +
        `El jugador eligió: "${choiceText}". ` +
        `Evalúa esta decisión y devuelve un objeto JSON con:` +
        `{ "narrative": string, "scoreUpdates": { "financial": number, "reputation": number, "operational": number, "dataIntegrity": number } }`;
    try {
        const output = await callGenAI(prompt);
        return JSON.parse(output || '') as EvaluationResponse;
    } catch (err) {
        console.warn('AI evaluateDecision failed, falling back to simulation', err);
        return {
            narrative: 'Simulación: Decisión evaluada correctamente.',
            scoreUpdates: {
                financial: 0,
                reputation: 0,
                operational: 0,
                dataIntegrity: 0
            }
        };
    }
};