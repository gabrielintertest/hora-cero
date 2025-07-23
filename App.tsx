import React, { useState, useEffect } from 'react';
import AdminPortal from './components/admin/AdminPortal';
import GamePortal from './components/GamePortal';

const App: React.FC = () => {
    const [route, setRoute] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setRoute(window.location.pathname);
        };
        window.addEventListener('popstate', onLocationChange);
        return () => {
            window.removeEventListener('popstate', onLocationChange);
        };
    }, []);

    if (route.startsWith('/admin')) {
        return <AdminPortal />;
    }

    return <GamePortal />;
};

export default App;