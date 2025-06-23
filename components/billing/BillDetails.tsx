
import React from 'react';
import { Bill, BillStatus } from '../../types';

interface BillDetailsProps {
  bill: Bill;
  currencySymbol: string;
  taxRate: number;
}

export const BillDetails: React.FC<BillDetailsProps> = ({ bill, currencySymbol, taxRate }) => {
  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-md text-slate-200">
      <div className="mb-4 pb-4 border-b border-slate-600">
        <h4 className="text-xl font-semibold text-pink-400 mb-1">Bill ID: {bill.id}</h4>
        <p className="text-sm">Date: {new Date(bill.createdAt).toLocaleString()}</p>
        <p className="text-sm">Status: 
           <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                bill.status === BillStatus.PAID ? 'bg-green-500/20 text-green-400' : 
                bill.status === BillStatus.CANCELLED ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {bill.status}
            </span>
        </p>
        {bill.customerName && <p className="text-sm">Customer: {bill.customerName}</p>}
        {bill.tableNumber && <p className="text-sm">Table: {bill.tableNumber}</p>}
      </div>

      <h5 className="text-lg font-medium text-slate-300 mb-2">Items:</h5>
      {bill.items.length === 0 ? (
        <p className="text-slate-400">No items in this bill.</p>
      ) : (
        <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
          {bill.items.map((item, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-slate-800 rounded">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-slate-400 ml-2">({item.quantity} x {currencySymbol}{item.price.toFixed(2)})</span>
              </div>
              <span className="font-medium">{currencySymbol}{item.totalPrice.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-4 border-t border-slate-600 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{currencySymbol}{bill.subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
          <span>{currencySymbol}{bill.taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-emerald-400 pt-1">
          <span>Grand Total:</span>
          <span>{currencySymbol}{bill.grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
    