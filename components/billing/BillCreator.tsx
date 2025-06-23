import React, { useState, useMemo, useCallback, ChangeEvent } from 'react';
import { MenuItem, Bill, BillItem, BillStatus } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface BillCreatorProps {
  bill: Bill;
  menuItems: MenuItem[];
  onUpdateBill: (bill: Bill) => void;
  onFinalizeBill: (status: BillStatus.PAID | BillStatus.CANCELLED) => void;
  currencySymbol: string;
  taxRate: number;
}

export const BillCreator: React.FC<BillCreatorProps> = ({ 
  bill, menuItems, onUpdateBill, onFinalizeBill, currencySymbol, taxRate 
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const availableMenuItems = useMemo(() => 
    menuItems.filter(item => item.isAvailable).map(item => ({
      value: item.id,
      label: `${item.name} (${currencySymbol}${item.price.toFixed(2)})`
    })), [menuItems, currencySymbol]);

  const calculateTotals = useCallback((items: BillItem[]): Pick<Bill, 'subTotal' | 'taxAmount' | 'grandTotal'> => {
    const subTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subTotal * taxRate;
    const grandTotal = subTotal + taxAmount;
    return { subTotal, taxAmount, grandTotal };
  }, [taxRate]);

  const handleAddItemToBill = () => {
    if (!selectedItemId || quantity <= 0) return;
    const menuItem = menuItems.find(item => item.id === selectedItemId);
    if (!menuItem) return;

    const existingItemIndex = bill.items.findIndex(item => item.menuItemId === selectedItemId);
    let newItems: BillItem[];

    if (existingItemIndex > -1) {
      newItems = bill.items.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity, totalPrice: item.price * (item.quantity + quantity) }
          : item
      );
    } else {
      newItems = [
        ...bill.items,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: quantity,
          totalPrice: menuItem.price * quantity,
        }
      ];
    }
    
    const totals = calculateTotals(newItems);
    onUpdateBill({ ...bill, items: newItems, ...totals });
    setSelectedItemId('');
    setQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = bill.items.filter(item => item.menuItemId !== itemId);
    const totals = calculateTotals(newItems);
    onUpdateBill({ ...bill, items: newItems, ...totals });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const newItems = bill.items.map(item =>
      item.menuItemId === itemId
        ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
        : item
    );
    const totals = calculateTotals(newItems);
    onUpdateBill({ ...bill, items: newItems, ...totals });
  };
  
  if (bill.status !== BillStatus.OPEN) {
    return (
      <div className="p-6 bg-slate-700 rounded-lg shadow-md text-center">
        <p className="text-lg text-slate-300">This bill is already {bill.status.toLowerCase()}.</p>
        <p className="text-sm text-slate-400">Cannot modify a closed bill.</p>
        <Button onClick={() => onUpdateBill({ ...bill, status: BillStatus.OPEN })} variant="secondary" className="mt-4">
            Re-open Bill (Mistake?)
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-pink-400 mb-1">Bill ID: {bill.id}</h3>
      {(bill.customerName || bill.tableNumber) && (
        <p className="text-sm text-slate-300 mb-4">
          {bill.customerName && `Customer: ${bill.customerName}`}
          {bill.customerName && bill.tableNumber && " | "}
          {bill.tableNumber && `Table: ${bill.tableNumber}`}
        </p>
      )}

      {/* Add Item Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-600">
        <div className="md:col-span-2">
          <Select
            label="Select Item"
            options={availableMenuItems}
            value={selectedItemId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedItemId(e.target.value)}
            placeholder="Choose an item..."
          />
        </div>
        <Input
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value))}
          min="1"
        />
        <div className="md:col-span-3">
            <Button onClick={handleAddItemToBill} variant="primary" disabled={!selectedItemId || quantity <= 0} className="w-full">
                Add Item to Bill
            </Button>
        </div>
      </div>

      {/* Bill Items List */}
      <div className="mb-6 max-h-80 overflow-y-auto pr-2 space-y-3">
        {bill.items.length === 0 ? (
          <p className="text-center text-slate-400 py-4">No items added to this bill yet.</p>
        ) : (
          bill.items.map(item => (
            <div key={item.menuItemId} className="flex items-center justify-between p-3 bg-slate-800 rounded-md shadow">
              <div>
                <p className="font-medium text-slate-100">{item.name}</p>
                <p className="text-xs text-slate-400">
                  {currencySymbol}{item.price.toFixed(2)} x 
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateQuantity(item.menuItemId, parseInt(e.target.value))}
                    min="1"
                    className="w-12 mx-1 px-1 py-0.5 text-xs bg-slate-700 border border-slate-600 rounded text-center"
                  />
                  = {currencySymbol}{item.totalPrice.toFixed(2)}
                </p>
              </div>
              <Button onClick={() => handleRemoveItem(item.menuItemId)} variant="danger" size="sm" className="p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Totals Section */}
      <div className="pt-6 border-t border-slate-600 space-y-2">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal:</span>
          <span>{currencySymbol}{bill.subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Tax ({ (taxRate * 100).toFixed(0) }%):</span>
          <span>{currencySymbol}{bill.taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-emerald-400 pt-2">
          <span>Grand Total:</span>
          <span>{currencySymbol}{bill.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <Button onClick={() => onFinalizeBill(BillStatus.CANCELLED)} variant="warning" className="w-full sm:w-auto">
          Cancel Bill
        </Button>
        <Button onClick={() => onFinalizeBill(BillStatus.PAID)} variant="success" className="w-full sm:w-auto">
          Mark as Paid & Close
        </Button>
      </div>
    </div>
  );
};