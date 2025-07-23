import React from 'react';
import type { GameState, GameAction, Choice } from '../types';
import { MAX_HOURS } from '../constants';
import Scoreboard from './Scoreboard';
import EventLog from './EventLog';
import DilemmaCard from './DilemmaCard';
import MeetingRoom from './MeetingRoom';

interface GameUIProps {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const Header: React.FC<{ currentHour: number }> = ({ currentHour }) => {
  const progress = (currentHour / MAX_HOURS) * 100;
  return (
    <header className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-slate-100">
          Sala de Crisis: <span className="text-red-500">Ataque de Ransomware</span>
        </h1>
        <div className="text-lg font-bold">
            Hora <span className="text-amber-400 text-2xl">{currentHour}</span> / {MAX_HOURS}
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div className="bg-gradient-to-r from-amber-500 to-red-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </header>
  );
};

const GameUI: React.FC<GameUIProps> = ({ gameState, dispatch }) => {
  const { phase, currentHour, scores, eventLog, activeDilemma, players, currentPlayerIndex } = gameState;

  const handleDecision = (choice: Choice) => {
    if (phase === 'playing' && activeDilemma) {
        dispatch({ type: 'MAKE_DECISION_START', payload: { choiceText: choice.text, roleTitle: activeDilemma.role.title } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header currentHour={currentHour} />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <MeetingRoom players={players} />
            <DilemmaCard dilemma={activeDilemma} phase={phase} onDecision={handleDecision} />
          </div>
          <div className="flex flex-col gap-6 h-[50vh] lg:h-auto">
             <Scoreboard scores={scores} />
             <EventLog log={eventLog} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GameUI;
