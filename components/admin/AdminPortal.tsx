import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPortal: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth status on component mount
        setIsAuthenticated(apiService.isAdminAuthenticated());
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        apiService.logoutAdmin();
        setIsAuthenticated(false);
    }

    if (isLoading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminPortal;
