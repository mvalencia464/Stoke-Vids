import React from 'react';
import { ConfigErrorIcon } from './icons';

export const ConfigError: React.FC = () => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-xl shadow-lg border border-red-500/50 animate-fade-in">
        <ConfigErrorIcon />
        <h2 className="text-2xl font-bold text-white mt-4 mb-2">Configuration Error</h2>
        <p className="text-gray-400 mb-4">
            The application is not configured correctly. Authentication services are unavailable.
        </p>
        <p className="text-xs text-gray-500">
            Please ensure that Firebase environment variables (<code>FIREBASE_*</code>) are correctly set up.
        </p>
    </div>
  );
};