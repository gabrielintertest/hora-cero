
import React from 'react';
import type { GameScore } from '../types';

interface ScoreboardProps {
  scores: GameScore;
}

const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    const colorClasses = {
        red: {
            bg: 'bg-red-500',
            text: 'text-red-300',
        },
        amber: {
            bg: 'bg-amber-500',
            text: 'text-amber-300',
        },
        emerald: {
            bg: 'bg-emerald-500',
            text: 'text-emerald-300',
        },
    };

    const currentColors = colorClasses[color as keyof typeof colorClasses] ?? colorClasses.emerald;

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-slate-300">{label}</span>
                <span className={`font-bold text-lg ${currentColors.text}`}>{value}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className={`${currentColors.bg} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }}></div>
            </div>
        </div>
    );
};

const Scoreboard: React.FC<ScoreboardProps> = ({ scores }) => {
    const getColor = (value: number) => {
        if (value < 30) return 'red';
        if (value < 60) return 'amber';
        return 'emerald';
    };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
      <h3 className="text-lg font-bold mb-4 text-slate-200">Métricas de Impacto</h3>
      <div className="space-y-4">
        <ScoreBar label="Financiero" value={scores.financial} color={getColor(scores.financial)} />
        <ScoreBar label="Reputación" value={scores.reputation} color={getColor(scores.reputation)} />
        <ScoreBar label="Operacional" value={scores.operational} color={getColor(scores.operational)} />
        <ScoreBar label="Integridad de Datos" value={scores.dataIntegrity} color={getColor(scores.dataIntegrity)} />
      </div>
    </div>
  );
};

export default Scoreboard;