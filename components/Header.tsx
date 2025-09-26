import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter text-white">
          Stoke<span className="text-purple-500">Vids</span>
        </h1>
      </div>
    </header>
  );
};