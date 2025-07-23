import type { GameSession, Report, AdminState } from '../types';

// --- Mock Backend using localStorage ---
// In a real application, these functions would make network requests to a secure backend server.
// For this simulation, we use localStorage to persist data across browser sessions.

const DB_KEY = 'horaCeroDB';

interface Database {
    sessions: Record<string, GameSession>;
    reports: Record<string, Report>;
}

const getDB = (): Database => {
    try {
        const db = localStorage.getItem(DB_KEY);
        return db ? JSON.parse(db) : { sessions: {}, reports: {} };
    } catch (e) {
        console.error("Failed to parse DB from localStorage", e);
        return { sessions: {}, reports: {} };
    }
};

const saveDB = (db: Database) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const generateAccessCode = (): string => {
    // Keep generating until we find a unique code
    while (true) {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const db = getDB();
        if (!db.sessions[code]) {
            return code;
        }
    }
}

export const apiService = {
    // --- Admin Authentication ---
    loginAdmin(password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // En esta versión, la contraseña es siempre 'password'.
            const adminPassword = 'password';
            setTimeout(() => {
                if (password === adminPassword) {
                    localStorage.setItem('admin_auth', 'true');
                    resolve(true);
                } else {
                    reject(new Error('Contraseña incorrecta.'));
                }
            }, 500);
        });
    },

    logoutAdmin(): void {
        localStorage.removeItem('admin_auth');
    },

    isAdminAuthenticated(): boolean {
        return localStorage.getItem('admin_auth') === 'true';
    },

    // --- Game Session Management ---
    async createGameSession(invitedPlayerEmails: string[]): Promise<GameSession> {
        const code = generateAccessCode();
        const newSession: GameSession = {
            id: code,
            status: 'waiting',
            invitedPlayerEmails,
            playerDetails: [],
        };
        const db = getDB();
        db.sessions[code] = newSession;
        saveDB(db);
        return newSession;
    },

    async getGameSession(sessionId: string): Promise<GameSession | null> {
        const db = getDB();
        return db.sessions[sessionId] || null;
    },


    async joinGameSession(sessionId: string, playerInfo: { email: string; firstName: string; lastName: string }): Promise<GameSession> {
        const db = getDB();
        const session = db.sessions[sessionId];
        if (!session) throw new Error('Sesión no encontrada.');
        if (session.status !== 'waiting') throw new Error('Esta sesión ya no acepta nuevos jugadores.');
        if (!session.invitedPlayerEmails.includes(playerInfo.email)) throw new Error('No estás invitado a esta sesión.');
        if (session.playerDetails.some(p => p.email === playerInfo.email)) throw new Error('Ya te has unido a esta sesión.');
        
        session.playerDetails.push(playerInfo);
        saveDB(db);
        return session;
    },

    async startGame(sessionId: string): Promise<GameSession> {
        const db = getDB();
        const session = db.sessions[sessionId];
        if (!session) throw new Error('Sesión no encontrada.');
        if (session.status !== 'waiting') throw new Error('El juego ya ha comenzado.');
        if(session.playerDetails.length !== session.invitedPlayerEmails.length) throw new Error('No todos los jugadores invitados se han unido.');

        session.status = 'in_progress';
        saveDB(db);
        return session;
    },

    async saveGameState(sessionId: string, gameState: any): Promise<void> {
        const db = getDB();
        if(db.sessions[sessionId]){
            db.sessions[sessionId].gameState = gameState;
            saveDB(db);
        }
    },

    // --- Reporting ---
    async saveReport(report: Report): Promise<void> {
        const db = getDB();
        const session = db.sessions[report.id];
        
        db.reports[report.id] = report;
        if(session) {
            session.status = 'finished';
            session.report = report;
        }
        
        saveDB(db);
    },

    async getAllReports(): Promise<Report[]> {
        const db = getDB();
        return Object.values(db.reports).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    
    async getAllSessions(): Promise<GameSession[]> {
        const db = getDB();
        return Object.values(db.sessions).reverse();
    }
};

// --- Simulated External Services ---
export async function obtenerRecomendaciones(dilema: string): Promise<string[]> {
  return Promise.resolve([
    "Recomendación simulada 1 para: " + dilema,
    "Recomendación simulada 2 para: " + dilema,
  ]);
}

export async function obtenerRespuestaAutomatica(input: string): Promise<string> {
  return Promise.resolve("Respuesta automática simulada para: " + input);
}