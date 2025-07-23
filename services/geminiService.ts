// Funciones IA con Google GenAI
import type { GameState, DilemmaResponse, EvaluationResponse, Role } from '../types';

import { TextServiceClient } from '@google/genai';
// Instantiate the Google GenAI client with API key from env
const genaiClient = new TextServiceClient({ apiKey: process.env.GEMINI_API_KEY });

export const generateDilemma = async (role: Role, gameState: GameState): Promise<DilemmaResponse> => {
    const prompt = `Eres el rol ${role.title}. Estado del juego: ${JSON.stringify(gameState)}. ` +
        `Proporciona un dilema con descripción y tres opciones de respuesta, formato JSON:` +
        `{ "dilemmaDescription": string, "choices": [{ "id": string, "text": string }] }`;
    try {
        const [response] = await genaiClient.generateText({
            model: 'text-bison-001',
            prompt: { text: prompt }
        });
        return JSON.parse(response.text) as DilemmaResponse;
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
        const [response] = await genaiClient.generateText({
            model: 'text-bison-001',
            prompt: { text: prompt }
        });
        return JSON.parse(response.text) as EvaluationResponse;
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