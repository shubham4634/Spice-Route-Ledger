
import React from 'react';
import { ViewMode } from '../../types';

interface HeaderProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const navLinkClasses = (viewMode: ViewMode) => 
    `px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75 ${
      activeView === viewMode 
        ? 'bg-pink-600 text-white shadow-lg' 
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <header className="bg-slate-800 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-pink-500 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15h.008M17.25 7.5h-10.5l.625-1.747a2.25 2.25 0 012.148-1.503h5.354a2.25 2.25 0 012.148 1.503L17.25 7.5z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              Spice Route Ledger
            </h1>
          </div>
          <nav className="flex space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveView(ViewMode.REPOSITORY)}
              className={navLinkClasses(ViewMode.REPOSITORY)}
            >
              Menu Repository
            </button>
            <button
              onClick={() => setActiveView(ViewMode.BILLING)}
              className={navLinkClasses(ViewMode.BILLING)}
            >
              Billing
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
    