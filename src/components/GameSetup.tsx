import React, { useState, useEffect } from 'react';
import type { GameSession, Player } from '../types';
import { apiService } from '../services/apiService';

interface GameSetupProps {
  session: GameSession;
  onGameStart: (session: GameSession) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ session: initialSession, onGameStart }) => {
  const [session, setSession] = useState(initialSession);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Poll for session updates to see other players joining
  useEffect(() => {
    if (session.status === 'waiting') {
      const interval = setInterval(async () => {
        try {
          const updatedSession = await apiService.getGameSession(session.id);
          if (updatedSession) {
            setSession(updatedSession);
            if (updatedSession.status === 'in_progress') {
                onGameStart(updatedSession);
            }
          }
        } catch (err) {
            console.error("Failed to poll session", err);
        }
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    }
  }, [session.id, session.status, onGameStart]);
  
  const getIsPlayerJoined = (email: string) => {
      return session.playerDetails.some(p => p.email === email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedEmail || !firstName || !lastName) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    try {
        const updatedSession = await apiService.joinGameSession(session.id, { email: selectedEmail, firstName, lastName });
        setSession(updatedSession);
        setIsSubmitted(true);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Un error desconocido ocurrió.');
    }
  };
  
  const unjoinedPlayers = session.invitedPlayerEmails.filter(email => !getIsPlayerJoined(email));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
      <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Sala de Espera</h1>
        <p className="text-slate-400 mb-6">El juego comenzará cuando todos los participantes se hayan unido.</p>
        
        <div className="mb-6">
            <p className="text-slate-300">Código de acceso (para otros jugadores):</p>
            <p className="text-4xl font-mono tracking-widest text-amber-400 bg-slate-900 inline-block px-4 py-2 rounded-lg mt-2">{session.id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-slate-200 mb-3 text-left">Jugadores Unidos</h2>
                <ul className="space-y-2">
                    {session.playerDetails.map(p => (
                        <li key={p.email} className="text-left text-emerald-400 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            {p.firstName} {p.lastName}
                        </li>
                    ))}
                    {session.invitedPlayerEmails.length === session.playerDetails.length && (
                        <p className="text-amber-400 mt-4">¡Todos listos! Esperando que el administrador inicie la simulación...</p>
                    )}
                </ul>
            </div>
            
            {!isSubmitted ? (
                 <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h2 className="text-lg font-bold text-slate-200 mb-3 text-left">Únete a la Simulación</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 text-left mb-1">Selecciona tu correo</label>
                            <select
                                id="email"
                                value={selectedEmail}
                                onChange={e => setSelectedEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>-- Selecciona --</option>
                                {unjoinedPlayers.map(email => <option key={email} value={email}>{email}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 text-left mb-1">Nombre</label>
                            <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 text-left mb-1">Apellido</label>
                            <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Confirmar Asistencia</button>
                    </form>
                 </div>
            ) : (
                <div className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-center">
                    <p className="text-lg text-emerald-300">¡Gracias por confirmar! Esperando a los demás...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GameSetup;