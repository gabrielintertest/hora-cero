import React, { useReducer, useEffect, useCallback, useState } from 'react';
import type { GameState, GameAction, Dilemma, Player, Report, EventLogEntry } from '../types';
import { ROLES, AVATARS, MAX_HOURS } from '../constants';
import { generateDilemma, evaluateDecision } from '../services/geminiService';
import { apiService } from '../services/apiService';
import SplashScreen from './SplashScreen';
import GameSetup from './GameSetup';
import GameUI from './GameUI';
import GameEndScreen from './GameEndScreen';

const initialState: GameState = {
  sessionId: null,
  phase: 'splash',
  currentHour: 0,
  scores: { financial: 85, reputation: 90, operational: 95, dataIntegrity: 90 },
  activeDilemma: null,
  eventLog: [],
  players: [],
  currentPlayerIndex: 0,
};

const clampScore = (score: number) => Math.max(0, Math.min(100, score));

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_SETUP':
      return { ...state, phase: 'setup' };
    
    case 'INITIALIZE_GAME_FROM_SESSION': {
        const { session } = action.payload;
        if (!session.playerDetails) return state;

        const shuffledRoles = [...ROLES].sort(() => 0.5 - Math.random());
        const shuffledAvatars = [...AVATARS].sort(() => 0.5 - Math.random());

        const players: Player[] = session.playerDetails.map((pd, i) => ({
            id: i,
            name: `${pd.firstName} ${pd.lastName}`,
            firstName: pd.firstName,
            lastName: pd.lastName,
            email: pd.email,
            role: shuffledRoles[i % shuffledRoles.length],
            AvatarComponent: shuffledAvatars[i % shuffledAvatars.length],
            isStanding: i === 0,
            speech: undefined,
        }));
        
        return {
            ...initialState,
            sessionId: session.id,
            phase: 'loading_dilemma',
            players,
            currentPlayerIndex: 0,
            eventLog: [{ hour: 0, type: 'start', message: 'Simulación iniciada. ¡Se han asignado los roles!' }],
        };
    }
    
    case 'FETCH_DILEMMA_START':
        return { ...state, phase: 'loading_dilemma' };
    case 'FETCH_DILEMMA_SUCCESS':
      return { ...state, phase: 'playing', activeDilemma: action.payload };
    case 'FETCH_DILEMMA_FAILURE':
        return {
            ...state,
            phase: 'finished',
            eventLog: [...state.eventLog, { hour: state.currentHour, type: 'error', message: `Error de simulación: ${action.payload}` }]
        }
    case 'MAKE_DECISION_START':
        const newEventLogDecision = [...state.eventLog, { hour: state.currentHour, type: 'decision', roleTitle: action.payload.roleTitle, message: action.payload.choiceText } as EventLogEntry];
        return { ...state, phase: 'evaluating_decision', eventLog: newEventLogDecision };
        
    case 'EVALUATE_DECISION_SUCCESS': {
        const { scoreUpdates, narrative } = action.payload;
        const newScores = {
            financial: clampScore(state.scores.financial + scoreUpdates.financial),
            reputation: clampScore(state.scores.reputation + scoreUpdates.reputation),
            operational: clampScore(state.scores.operational + scoreUpdates.operational),
            dataIntegrity: clampScore(state.scores.dataIntegrity + scoreUpdates.dataIntegrity),
        };
        
        const lastDecisionEvent = state.eventLog.slice().reverse().find(e => e.type === 'decision');
        const lastChoiceText = lastDecisionEvent?.message || '';

        const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
        const isNewRound = nextPlayerIndex === 0;
        const nextHour = isNewRound ? state.currentHour + Math.floor(Math.random() * 3) + 1 : state.currentHour;
        const finalHour = Math.min(nextHour, MAX_HOURS);

        const updatedPlayers = state.players.map((p, index) => ({
            ...p,
            isStanding: index === nextPlayerIndex,
            speech: index === state.currentPlayerIndex ? lastChoiceText : p.speech,
        }));
        
        const events: EventLogEntry[] = [
            { hour: state.currentHour, type: 'consequence', message: narrative },
            ...(isNewRound && finalHour < MAX_HOURS ? [{ hour: finalHour, type: 'round', message: `Inicia una nueva ronda de decisiones.` } as EventLogEntry] : [])
        ];
        
        const updatedEventLog = [...state.eventLog, ...events];

        if (finalHour >= MAX_HOURS) {
          return {
            ...state,
            phase: 'finished',
            scores: newScores,
            players: updatedPlayers,
            eventLog: [...updatedEventLog, { hour: MAX_HOURS, type: 'info', message: 'Fin de las 24 horas críticas. Generando informe...' }]
          };
        }
        
        return {
            ...state,
            scores: newScores,
            eventLog: updatedEventLog,
            players: updatedPlayers,
            currentHour: finalHour,
            currentPlayerIndex: nextPlayerIndex,
            phase: 'loading_dilemma',
        };
    }
    case 'EVALUATE_DECISION_FAILURE':
        return { ...state, phase: 'finished', eventLog: [...state.eventLog, { hour: state.currentHour, type: 'error', message: `Error de simulación: ${action.payload}` }] }
    
    case 'CLEAR_SPEECH_BUBBLE':
        return { ...state, players: state.players.map((p, i) => i === action.payload.playerIndex ? { ...p, speech: undefined } : p) };
        
    case 'GAME_OVER':
      return { ...state, phase: 'finished', eventLog: [...state.eventLog, { hour: state.currentHour, type: 'info', message: 'Simulación terminada.' }] };
    default:
      return state;
  }
}

const GamePortal: React.FC = () => {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);
    const [sessionCode, setSessionCode] = useState('');
    const [error, setError] = useState('');
    const [session, setSession] = useState(null);

    const fetchNextDilemma = useCallback(async (state: GameState) => {
        if (state.currentHour >= MAX_HOURS) {
            if (state.phase !== 'finished') dispatch({ type: 'GAME_OVER' });
            return;
        }
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (!currentPlayer) return;

        try {
            const dilemmaResponse = await generateDilemma(currentPlayer.role, state);
            const dilemma: Dilemma = { role: currentPlayer.role, description: dilemmaResponse.dilemmaDescription, choices: dilemmaResponse.choices };
            dispatch({ type: 'FETCH_DILEMMA_SUCCESS', payload: dilemma });
        } catch (err) {
            console.error(err);
            dispatch({ type: 'FETCH_DILEMMA_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
        }
    }, []);

    useEffect(() => {
        if (gameState.phase === 'loading_dilemma' && gameState.players.length > 0) {
            const timer = setTimeout(() => {
                fetchNextDilemma(gameState);
            }, 1500); // Allow time for speech bubble etc.
            return () => clearTimeout(timer);
        }
    }, [gameState.phase, gameState.currentPlayerIndex, fetchNextDilemma, gameState]);

    useEffect(() => {
        const handleDecision = async () => {
            if (gameState.phase === 'evaluating_decision' && gameState.activeDilemma) {
                const lastEvent = gameState.eventLog[gameState.eventLog.length - 1];
                if (lastEvent?.type !== 'decision') return;

                try {
                    const evaluation = await evaluateDecision(gameState.activeDilemma.role, lastEvent.message, gameState);
                    dispatch({ type: 'EVALUATE_DECISION_SUCCESS', payload: evaluation });
                } catch (err) {
                    console.error(err);
                    dispatch({ type: 'EVALUATE_DECISION_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
                }
            }
        };
        handleDecision();
    }, [gameState.phase, gameState.activeDilemma, gameState.eventLog, gameState]);
    
    useEffect(() => {
        if (gameState.sessionId && gameState.phase !== 'finished') {
            apiService.saveGameState(gameState.sessionId, gameState);
        }
    }, [gameState]);

    useEffect(() => {
        const createAndSaveReport = async () => {
            if (gameState.phase === 'finished' && gameState.sessionId) {
                const existingReport = (await apiService.getGameSession(gameState.sessionId))?.report;
                if(existingReport) return; // Report already created

                const report: Report = {
                    id: gameState.sessionId,
                    date: new Date().toISOString(),
                    players: gameState.players.map(p => ({
                        firstName: p.firstName,
                        lastName: p.lastName,
                        email: p.email,
                        role: p.role,
                    })),
                    finalScores: gameState.scores,
                    eventLog: gameState.eventLog,
                };
                await apiService.saveReport(report);
            }
        };
        createAndSaveReport();
    }, [gameState.phase, gameState.sessionId, gameState.players, gameState.scores, gameState.eventLog]);
    

    const handleJoinSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const foundSession = await apiService.getGameSession(sessionCode.toUpperCase());
            if (foundSession) {
                if (foundSession.status === 'in_progress' && foundSession.gameState) {
                     // Rejoin logic
                     console.log("Rejoining session");
                     // This part is complex, for now we just load the lobby
                     setSession(foundSession);
                     dispatch({ type: 'START_SETUP' });
                } else if (foundSession.status === 'waiting') {
                    setSession(foundSession);
                    dispatch({ type: 'START_SETUP' });
                } else {
                    setError('Esta simulación ya ha finalizado.');
                }
            } else {
                setError('Código de sesión no válido.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al buscar sesión.');
        }
    };

    if (gameState.phase === 'splash') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
                <SplashScreen onStartSetup={() => {}} />
                <div className="mt-12 w-full max-w-sm">
                    <form onSubmit={handleJoinSession} className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
                        <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">Unirse a una Simulación</h3>
                        <label htmlFor="session-code" className="block text-sm font-medium text-slate-300 mb-2">
                            Ingresa el Código de Acceso
                        </label>
                        <input
                            type="text"
                            id="session-code"
                            value={sessionCode}
                            onChange={e => setSessionCode(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white uppercase text-center tracking-widest font-mono text-lg"
                            maxLength={6}
                        />
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            Unirse
                        </button>
                    </form>
                </div>
                 <footer className="text-center mt-8">
                    <a href="/admin" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
                        Acceder al Portal de Administración
                    </a>
                </footer>
            </div>
        );
    }

    if (gameState.phase === 'setup' && session) {
        return <GameSetup session={session} onGameStart={(startedSession) => dispatch({ type: 'INITIALIZE_GAME_FROM_SESSION', payload: { session: startedSession } })} />;
    }
    
    if (gameState.phase === 'finished') {
        return <GameEndScreen finalState={gameState} />;
    }

    if (gameState.phase !== 'setup' && gameState.players.length > 0) {
        return <GameUI gameState={gameState} dispatch={dispatch} />;
    }

    // Fallback or loading state
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Cargando...</div>;
};

export default GamePortal;