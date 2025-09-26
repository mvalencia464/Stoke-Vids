import React, { useState, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';

interface HeaderProps {
    user: User | null;
    onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full py-4 px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter text-white">
          Stoke<span className="text-purple-500">Vids</span>
        </h1>
        {user && (
            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500">
                    <img
                        className="h-9 w-9 rounded-full"
                        src={user.photoURL || undefined}
                        alt="User profile"
                    />
                </button>
                {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-fast">
                        <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                           <p className="font-semibold truncate">{user.displayName}</p>
                           <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                onSignOut();
                                setIsDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </header>
  );
};