import React from 'react';
import { GoogleIcon } from './icons';

interface LoginProps {
  onSignIn: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSignIn }) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to StokeVids</h2>
        <p className="text-gray-400 mb-8">Sign in to start creating and saving your video ads.</p>
        <button
            onClick={onSignIn}
            className="group w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
        >
            <GoogleIcon />
            Sign in with Google
        </button>
    </div>
  );
};
