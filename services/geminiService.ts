// Funciones simuladas para IA
import type { GameState, DilemmaResponse, EvaluationResponse, Role } from '../types';

export const getIAResponse = async (_prompt: string): Promise<string> => {
    // Simula una respuesta de IA en formato JSON
    return JSON.stringify({
        dilemmaDescription: 'Simulación: Tienes que decidir cómo responder a un ataque cibernético.',
        choices: [
            { id: 'A', text: 'Notificar a todos los empleados.' },
            { id: 'B', text: 'Investigar en silencio.' },
            { id: 'C', text: 'Contactar a las autoridades.' }
        ]
    });
};

export const generateDilemma = async (_role: Role, _gameState: GameState): Promise<DilemmaResponse> => {
    // Devuelve un dilema simulado
    return {
        dilemmaDescription: 'Simulación: ¿Cómo debe responder tu rol ante la amenaza?',
        choices: [
            { id: 'A', text: 'Opción simulada A' },
            { id: 'B', text: 'Opción simulada B' },
            { id: 'C', text: 'Opción simulada C' }
        ]
    };
};

export const evaluateDecision = async (_role: Role, _choiceText: string, _gameState: GameState): Promise<EvaluationResponse> => {
    // Devuelve una evaluación simulada
    return {
        narrative: 'Simulación: Decisión evaluada correctamente.',
        scoreUpdates: {
            financial: 0,
            reputation: 0,
            operational: 0,
            dataIntegrity: 0
        }
    };
};