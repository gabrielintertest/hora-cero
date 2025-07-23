

import React, { useEffect, useRef } from 'react';
import type { EventLogEntry } from '../types';

interface EventLogProps {
  log: EventLogEntry[];
}

const EventLog: React.FC<EventLogProps> = ({ log }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const getEntryStyle = (type: EventLogEntry['type']) => {
    switch (type) {
      case 'start':
        return 'text-amber-400 font-bold';
      case 'decision':
        return 'text-blue-400';
      case 'consequence':
        return 'text-slate-300';
      case 'info':
        return 'text-slate-400 italic';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col h-full">
      <h3 className="text-lg font-bold mb-4 text-slate-200 sticky top-0 bg-slate-800/50 py-2">Registro de Eventos</h3>
      <div className="overflow-y-auto flex-grow pr-2">
        <div className="space-y-4">
          {log.map((entry, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-right">
                <span className="text-xs font-mono bg-slate-700 text-slate-400 rounded-full px-2 py-1">H:{String(entry.hour).padStart(2, '0')}</span>
              </div>
              <p className={`text-sm ${getEntryStyle(entry.type)}`}>
                {entry.type === 'decision' && <strong className="font-semibold">{entry.roleTitle}: </strong>}
                {entry.message}
              </p>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default EventLog;