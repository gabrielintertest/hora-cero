import React, { useState, useEffect, useCallback } from 'react';
import type { GameSession, Report } from '../../types';
import { apiService } from '../../services/apiService';
import ReportView from './ReportView';

interface AdminDashboardProps {
    onLogout: () => void;
}

const CreateSessionForm: React.FC<{ onSessionCreated: (session: GameSession) => void }> = ({ onSessionCreated }) => {
    const [emails, setEmails] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
        if (emailList.length < 2) {
            setError('Por favor, introduce al menos 2 correos electrónicos válidos separados por comas.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            const newSession = await apiService.createGameSession(emailList);
            onSessionCreated(newSession);
            setEmails('');
        } catch(err) {
            setError('Error al crear la sesión.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Crear Nueva Simulación</h3>
            <div className="mb-4">
                <label htmlFor="emails" className="block text-sm font-medium text-slate-300 mb-1">Correos de los Gerentes (separados por coma)</label>
                <textarea
                    id="emails"
                    value={emails}
                    onChange={e => setEmails(e.target.value)}
                    rows={3}
                    placeholder="gerente1@empresa.com, gerente2@empresa.com, ..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white"
                />
            </div>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                {isLoading ? 'Creando...' : 'Crear Sesión'}
            </button>
        </form>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [view, setView] = useState<'dashboard' | 'report'>('dashboard');

    const fetchSessions = useCallback(async () => {
        const allSessions = await apiService.getAllSessions();
        setSessions(allSessions);
    }, []);

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, [fetchSessions]);

    const handleSessionCreated = (newSession: GameSession) => {
        setSessions(prev => [newSession, ...prev]);
    };
    
    const handleStartGame = async (sessionId: string) => {
        try {
            await apiService.startGame(sessionId);
            fetchSessions();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'No se pudo iniciar el juego.');
        }
    }

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setView('report');
    };
    
    if (view === 'report' && selectedReport) {
        return <ReportView report={selectedReport} onBack={() => setView('dashboard')} />;
    }

    const getStatusChip = (session: GameSession) => {
        const allJoined = session.playerDetails.length === session.invitedPlayerEmails.length;
        switch(session.status) {
            case 'waiting':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-900 text-amber-300">{allJoined ? 'Listo para iniciar' : 'Esperando Jugadores'}</span>;
            case 'in_progress':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900 text-blue-300">En Progreso</span>;
            case 'finished':
                return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-900 text-emerald-300">Finalizado</span>;
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Panel de Administrador</h1>
                    <button onClick={onLogout} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">Cerrar Sesión</button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <CreateSessionForm onSessionCreated={handleSessionCreated} />
                    </div>
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">Sesiones de Simulación</h2>
                        <div className="bg-slate-800 rounded-lg border border-slate-700">
                           <ul className="divide-y divide-slate-700">
                             {sessions.map(session => (
                                <li key={session.id} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-lg">Código de Sesión: <span className="font-mono text-amber-400">{session.id}</span></p>
                                            <p className="text-sm text-slate-400">Jugadores: {session.playerDetails.length} / {session.invitedPlayerEmails.length}</p>
                                        </div>
                                        <div className="text-right">
                                            {getStatusChip(session)}
                                            {session.status === 'waiting' && session.playerDetails.length === session.invitedPlayerEmails.length && (
                                                <button onClick={() => handleStartGame(session.id)} className="mt-2 block w-full text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded">
                                                    Iniciar Juego
                                                </button>
                                            )}
                                            {session.status === 'finished' && session.report && (
                                                <button onClick={() => handleViewReport(session.report!)} className="mt-2 block w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                                                    Ver Informe
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                             ))}
                           </ul>
                           {sessions.length === 0 && <p className="p-4 text-slate-400">No hay sesiones. ¡Crea una para empezar!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;