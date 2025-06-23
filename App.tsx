
import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem, Bill, ViewMode, BillStatus } from './types';
import { CURRENCY_SYMBOL, TAX_RATE } from './constants';
import RepositoryView from './components/repository/RepositoryView';
import BillingView from './components/billing/BillingView';
import { loadMenuItems, saveMenuItems, loadBills, saveBills } from './services/localStorageService';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.REPOSITORY);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    setMenuItems(loadMenuItems());
    setBills(loadBills());
  }, []);

  const handleSaveMenuItems = useCallback((updatedItems: MenuItem[]) => {
    setMenuItems(updatedItems);
    saveMenuItems(updatedItems);
  }, []);

  const handleSaveBills = useCallback((updatedBills: Bill[]) => {
    setBills(updatedBills);
    saveBills(updatedBills);
  }, []);

  const addMenuItem = (item: Omit<MenuItem, 'id' | 'imageUrl'>) => {
    const newItem: MenuItem = { 
      ...item, 
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: `https://picsum.photos/seed/${item.name.replace(/\s+/g, '')}/400/300` // Unique image per item name
    };
    const updatedItems = [...menuItems, newItem];
    handleSaveMenuItems(updatedItems);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    const updatedItems = menuItems.map(item => item.id === updatedItem.id ? updatedItem : item);
    handleSaveMenuItems(updatedItems);
  };

  const deleteMenuItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      const updatedItems = menuItems.filter(item => item.id !== itemId);
      handleSaveMenuItems(updatedItems);
    }
  };
  
  const createNewBill = (billDetails: { customerName?: string, tableNumber?: string }): Bill => {
    const newBill: Bill = {
      id: `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      items: [],
      subTotal: 0,
      taxAmount: 0,
      grandTotal: 0,
      createdAt: Date.now(),
      status: BillStatus.OPEN,
      customerName: billDetails.customerName,
      tableNumber: billDetails.tableNumber,
    };
    const updatedBills = [...bills, newBill];
    handleSaveBills(updatedBills);
    return newBill;
  };

  const updateBill = (updatedBill: Bill) => {
    const updatedBills = bills.map(b => b.id === updatedBill.id ? updatedBill : b);
    handleSaveBills(updatedBills);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === ViewMode.REPOSITORY && (
          <RepositoryView
            menuItems={menuItems}
            onAddMenuItem={addMenuItem}
            onUpdateMenuItem={updateMenuItem}
            onDeleteMenuItem={deleteMenuItem}
          />
        )}
        {activeView === ViewMode.BILLING && (
          <BillingView 
            menuItems={menuItems.filter(item => item.isAvailable)} 
            bills={bills}
            onCreateNewBill={createNewBill}
            onUpdateBill={updateBill}
            currencySymbol={CURRENCY_SYMBOL}
            taxRate={TAX_RATE}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
    