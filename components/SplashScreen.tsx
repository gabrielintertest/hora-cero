import React from 'react';

interface SplashScreenProps {
  onStartSetup: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStartSetup }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400 mb-4">
          Hora Cero
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6">Amenaza en la Red</h2>
        <p className="text-slate-400 md:text-lg mb-8">
          Acabas de entrar en la sala de crisis. La empresa está bajo un ataque de ransomware. Los sistemas están cayendo, los datos están en riesgo y cada minuto cuenta. Como gerente clave, tus decisiones en las próximas 24 horas determinarán el destino de la compañía.
        </p>
        <p className="text-slate-400 md:text-lg mb-12">
          Este es un juego de rol interactivo. No hay respuestas perfectamente correctas. Cada elección tiene consecuencias. ¿Estás listo para liderar?
        </p>
        <button
          onClick={onStartSetup}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-4 px-10 rounded-lg shadow-lg shadow-red-500/30 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Preparar Simulación
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
