import type { ReactNode } from 'react';
import type { AvatarProps } from './components/avatars';

export interface Role {
  id: string;
  title: string;
  mission: string;
  icon: ReactNode;
}

export interface Choice {
  id: string;
  text: string;
}

export interface Dilemma {
  role: Role;
  description: string;
  choices: Choice[];
}

export interface GameScore {
  financial: number;
  reputation: number;
  operational: number;
  dataIntegrity: number;
}

export interface EventLogEntry {
  hour: number;
  message: string;
  type: 'decision' | 'consequence' | 'info' | 'start' | 'round' | 'error';
  roleTitle?: string;
}

export interface Player {
    id: number;
    name: string; // Será "Esperando jugador..." hasta que se unan
    email: string;
    firstName?: string;
    lastName?: string;
    role: Role;
    AvatarComponent: React.FC<AvatarProps>;
    isStanding: boolean;
    speech?: string;
}

export type GamePhase = 'splash' | 'setup' | 'playing' | 'loading_dilemma' | 'evaluating_decision' | 'finished';

export interface GameState {
  sessionId: string | null;
  phase: GamePhase;
  currentHour: number;
  scores: GameScore;
  activeDilemma: Dilemma | null;
  eventLog: EventLogEntry[];
  players: Player[];
  currentPlayerIndex: number;
}

export interface DilemmaResponse {
  dilemmaDescription: string;
  choices: Choice[];
}

export interface EvaluationResponse {
  narrative: string;
  scoreUpdates: {
      financial: number;
      reputation: number;
      operational: number;
      dataIntegrity: number;
  };
}

export interface Report {
    id: string; // sessionId
    date: string;
    players: Pick<Player, 'firstName' | 'lastName' | 'email' | 'role'>[];
    finalScores: GameScore;
    eventLog: EventLogEntry[];
}

export interface GameSession {
    id: string; // El código de acceso de 6 dígitos
    status: 'waiting' | 'in_progress' | 'finished';
    invitedPlayerEmails: string[];
    playerDetails: { email: string; firstName: string; lastName: string }[];
    gameState?: GameState;
    report?: Report;
}


export interface AdminState {
    isAuthenticated: boolean;
    sessions: GameSession[];
    error: string | null;
}


export type GameAction =
  | { type: 'START_SETUP' }
  | { type: 'INITIALIZE_GAME_FROM_SESSION'; payload: { session: GameSession } }
  | { type: 'UPDATE_PLAYER_DETAILS'; payload: { email: string; firstName: string; lastName: string } }
  | { type: 'FETCH_DILEMMA_START' }
  | { type: 'FETCH_DILEMMA_SUCCESS'; payload: Dilemma }
  | { type: 'FETCH_DILEMMA_FAILURE'; payload: string }
  | { type: 'MAKE_DECISION_START'; payload: { choiceText: string; roleTitle: string } }
  | { type: 'EVALUATE_DECISION_SUCCESS'; payload: EvaluationResponse }
  | { type: 'EVALUATE_DECISION_FAILURE'; payload: string }
  | { type: 'CLEAR_SPEECH_BUBBLE'; payload: { playerIndex: number } }
  | { type: 'GAME_OVER' };