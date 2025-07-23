

import React from 'react';
import type { Dilemma, Choice, GamePhase } from '../types';

interface DilemmaCardProps {
  dilemma: Dilemma | null;
  phase: GamePhase;
  onDecision: (choice: Choice) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
    </div>
);


const DilemmaCard: React.FC<DilemmaCardProps> = ({ dilemma, phase, onDecision }) => {
  const isLoading = phase === 'loading_dilemma' || phase === 'evaluating_decision';

  const renderContent = () => {
    if (phase === 'loading_dilemma') {
      return (
        <div className="text-center p-8">
            <LoadingSpinner />
            <p className="mt-4 text-slate-400">Generando nuevo dilema...</p>
        </div>
      );
    }
    
    if (phase === 'finished') {
        return (
            <div className="text-center p-8">
                <h3 className="text-2xl font-bold text-emerald-400">Simulación Completada</h3>
                <p className="mt-4 text-slate-300">Has navegado las 24 horas críticas. Revisa el registro de eventos y los puntajes finales para evaluar tu desempeño.</p>
            </div>
        );
    }

    if (!dilemma) {
      return <div className="text-center p-8 text-slate-500">Esperando datos de la simulación...</div>;
    }

    return (
      <>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mr-4 flex-shrink-0">{dilemma.role.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{dilemma.role.title}</h3>
              <p className="text-sm text-slate-400">{dilemma.role.mission}</p>
            </div>
          </div>
          <p className="text-slate-300 whitespace-pre-wrap">{dilemma.description}</p>
        </div>
        <div className="border-t border-slate-700 p-6">
          <h4 className="font-bold mb-4 text-slate-200">Tus Opciones:</h4>
          {isLoading ? (
            <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-slate-400">Evaluando consecuencias...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dilemma.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onDecision(choice)}
                  disabled={isLoading}
                  className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200 border border-slate-600 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-wait"
                >
                  <span className="font-semibold text-slate-200">{choice.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg flex flex-col">
      {renderContent()}
    </div>
  );
};

export default DilemmaCard;