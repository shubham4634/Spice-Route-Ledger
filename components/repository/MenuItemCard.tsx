
import React from 'react';
import { MenuItem } from '../../types';
import { Button } from '../common/Button';

interface MenuItemCardProps {
  item: MenuItem;
  currencySymbol: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, currencySymbol, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <img 
        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/400/300`} 
        alt={item.name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-pink-400 mb-1 truncate" title={item.name}>{item.name}</h3>
        <p className="text-sm text-slate-400 mb-1">{item.category}</p>
        <p className="text-xs text-slate-500 mb-3 h-10 overflow-hidden line-clamp-2" title={item.description}>
          {item.description || 'No description available.'}
        </p>
        
        <div className="flex justify-between items-center mb-4 mt-auto">
          <p className="text-2xl font-bold text-emerald-400">
            {currencySymbol}{item.price.toFixed(2)}
          </p>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            item.isAvailable 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="flex space-x-2">
          <Button onClick={onEdit} variant="secondary" size="sm" className="flex-1" leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          }>
            Edit
          </Button>
          <Button onClick={onDelete} variant="danger" size="sm" className="flex-1" leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.242.26m3.242.26V4.872c0-.602.404-1.127 1.002-1.231l.232-.044a1.875 1.875 0 011.968 0l.232.044c.597.104 1.002.63 1.002 1.231v.618C15.143 5.485 14.88 5.617 14.53 5.79M4.772 5.79m14.456 0L12.028 2.09m-7.256 3.7A48.802 48.802 0 0112.028 2.09" />
            </svg>
          }>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
    