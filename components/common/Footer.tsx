
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 py-6 text-center shadow-inner mt-auto">
      <p>&copy; {new Date().getFullYear()} Spice Route Ledger. All rights reserved.</p>
      <p className="text-xs mt-1">Crafted with care for delicious dining experiences.</p>
    </footer>
  );
};
    