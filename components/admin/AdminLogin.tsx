import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await apiService.loginAdmin(password);
            onLoginSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
                    <h1 className="text-3xl font-bold text-slate-100 mb-6 text-center">Portal de Administración</h1>
                    <div className="mb-4">
                        <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="username">
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 text-slate-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******************"
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 text-slate-200 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         <p className="text-xs text-slate-500">Pista: la contraseña por defecto es 'password'.</p>
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
