
import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { CURRENCY_SYMBOL, DEFAULT_CATEGORIES } from '../../constants';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { MenuItemForm } from './MenuItemForm';
import { MenuItemCard } from './MenuItemCard';

interface RepositoryViewProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, 'id' | 'imageUrl'>) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

const RepositoryView: React.FC<RepositoryViewProps> = ({ menuItems, onAddMenuItem, onUpdateMenuItem, onDeleteMenuItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(menuItems.map(item => item.category).concat(DEFAULT_CATEGORIES))];


  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-800 rounded-xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Menu Repository</h2>
          <Button onClick={openAddModal} variant="primary" size="lg" leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }>
            Add New Item
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input 
              type="text"
              placeholder="Search items by name or description..."
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
         <div className="text-center py-12 bg-slate-800 rounded-xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-slate-500 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15h.008m-3.75 3h7.5" />
            </svg>
            <p className="text-xl text-slate-400">No menu items found.</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters, or add a new item!</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              currencySymbol={CURRENCY_SYMBOL}
              onEdit={() => openEditModal(item)}
              onDelete={() => onDeleteMenuItem(item.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}>
        <MenuItemForm
          initialData={editingItem}
          onSubmit={(data) => {
            if (editingItem) {
              onUpdateMenuItem({ ...editingItem, ...data });
            } else {
              onAddMenuItem(data);
            }
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default RepositoryView;
    