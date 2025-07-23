import React from 'react';
import type { GameState } from '../types';
import Scoreboard from './Scoreboard';

interface GameEndScreenProps {
    finalState: GameState;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({ finalState }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
            <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
                <h1 className="text-4xl font-bold text-emerald-400 mb-4">Simulación Completada</h1>
                <p className="text-slate-300 mb-6">
                    Has navegado las 24 horas críticas del ataque. Se ha generado un informe detallado de la sesión.
                </p>
                <p className="text-slate-400 mb-8">
                    El administrador de la simulación puede acceder al informe completo desde el panel de administración.
                </p>

                <div className="my-8">
                    <h2 className="text-2xl font-bold text-slate-200 mb-4">Resultados Finales</h2>
                    <Scoreboard scores={finalState.scores} />
                </div>
                
                <a 
                    href="/admin" 
                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Ir al Portal de Administración
                </a>
            </div>
        </div>
    );
};

export default GameEndScreen;
