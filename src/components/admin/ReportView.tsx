import React from 'react';
import type { Report, EventLogEntry } from '../../types';
import Scoreboard from '../Scoreboard';
import { ROLES } from '../../constants';

interface ReportViewProps {
    report: Report;
    onBack: () => void;
}

const getEntryStyle = (type: EventLogEntry['type']) => {
    switch (type) {
      case 'start': return 'text-amber-400 font-bold';
      case 'decision': return 'text-blue-400';
      case 'consequence': return 'text-slate-300';
      case 'info': return 'text-slate-400 italic';
      case 'round': return 'text-purple-400 border-t border-b border-purple-800 py-2 my-2';
      default: return 'text-slate-300';
    }
  };

const ReportView: React.FC<ReportViewProps> = ({ report, onBack }) => {
    
    const getRoleIcon = (roleId: string) => {
        const role = ROLES.find(r => r.id === roleId);
        return role ? role.icon : null;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <button onClick={onBack} className="text-blue-400 hover:text-blue-300 mb-4">&larr; Volver al Panel</button>
                    <h1 className="text-4xl font-bold">Informe de Simulación</h1>
                    <p className="text-slate-400">Sesión: <span className="font-mono text-amber-400">{report.id}</span></p>
                    <p className="text-slate-400">Fecha: {new Date(report.date).toLocaleString()}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-2xl font-bold mb-4">Participantes</h2>
                        <ul className="space-y-3">
                            {report.players.map(player => (
                                <li key={player.email} className="flex items-center">
                                   <div className="mr-3 flex-shrink-0">{getRoleIcon(player.role.id)}</div>
                                   <div>
                                     <p className="font-semibold text-slate-200">{player.firstName} {player.lastName}</p>
                                     <p className="text-sm text-slate-400">{player.role.title}</p>
                                   </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                         <h2 className="text-2xl font-bold mb-4">Puntajes Finales</h2>
                        <Scoreboard scores={report.finalScores} />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Registro Completo de Eventos</h2>
                     <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-4">
                        {report.eventLog.map((entry, index) => (
                            <div key={index} className={`flex items-start space-x-3 ${getEntryStyle(entry.type)}`}>
                            <div className="flex-shrink-0 text-right">
                                <span className="text-xs font-mono bg-slate-700 text-slate-400 rounded-full px-2 py-1">H:{String(entry.hour).padStart(2, '0')}</span>
                            </div>
                            <p className="text-sm">
                                {entry.type === 'decision' && <strong className="font-semibold">{entry.roleTitle}: </strong>}
                                {entry.message}
                            </p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportView;