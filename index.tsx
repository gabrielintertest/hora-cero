import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode fue eliminado para prevenir dobles renderizados en desarrollo,
  // lo cual afectaba la lógica de useEffect y las llamadas a la API.
  <App />
);