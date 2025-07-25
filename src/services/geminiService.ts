import type { GameState, DilemmaResponse, EvaluationResponse, Role } from '../types';
import dilemmas from '../data/dilemmas.json';

// Selecciona un dilema aleatorio del archivo JSON
function getRandomDilemma(): DilemmaResponse {
  const idx = Math.floor(Math.random() * dilemmas.length);
  return dilemmas[idx];
}

// Modo offline: genera dilema a partir de datos locales
export const generateDilemma = async (_role: Role, _gameState: GameState): Promise<DilemmaResponse> => {
  return getRandomDilemma();
};

// Modo offline: simula evaluación con puntuaciones neutras
export const evaluateDecision = async (_role: Role, _choiceText: string, _gameState: GameState): Promise<EvaluationResponse> => {
  return {
    narrative: 'Simulación: Decisión evaluada correctamente.',
    scoreUpdates: { financial: 0, reputation: 0, operational: 0, dataIntegrity: 0 }
  };
};