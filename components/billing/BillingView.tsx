
import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem, Bill, BillItem, BillStatus } from '../../types';
import { Button } from '../common/Button';
import { BillCreator } from './BillCreator';
import { BillDetails } from './BillDetails';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';

interface BillingViewProps {
  menuItems: MenuItem[];
  bills: Bill[];
  onCreateNewBill: (details: { customerName?: string, tableNumber?: string }) => Bill;
  onUpdateBill: (bill: Bill) => void;
  currencySymbol: string;
  taxRate: number;
}

const BillingView: React.FC<BillingViewProps> = ({ 
  menuItems, bills, onCreateNewBill, onUpdateBill, currencySymbol, taxRate 
}) => {
  const [activeBill, setActiveBill] = useState<Bill | null>(null);
  const [isInitialBillSetupModalOpen, setIsInitialBillSetupModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [selectedBillIdForDetails, setSelectedBillIdForDetails] = useState<string | null>(null);

  const handleStartNewBill = () => {
    setCustomerName('');
    setTableNumber('');
    setIsInitialBillSetupModalOpen(true);
  };

  const handleCreateBillAndProceed = () => {
    const newBill = onCreateNewBill({ customerName, tableNumber });
    setActiveBill(newBill);
    setIsInitialBillSetupModalOpen(false);
  };

  const updateActiveBill = useCallback((updatedBill: Bill) => {
    setActiveBill(updatedBill);
    onUpdateBill(updatedBill);
  }, [onUpdateBill]);

  const finalizeAndCloseBill = (status: BillStatus.PAID | BillStatus.CANCELLED) => {
    if (activeBill) {
      const finalBill = { ...activeBill, status: status };
      updateActiveBill(finalBill);
      setActiveBill(null); // Clear active bill after finalizing
    }
  };

  const openBillDetails = (billId: string) => {
    setSelectedBillIdForDetails(billId);
  };
  
  const closeBillDetailsModal = () => {
    setSelectedBillIdForDetails(null);
  };

  const selectedBillForDetails = bills.find(b => b.id === selectedBillIdForDetails);
  const openBills = bills.filter(b => b.status === BillStatus.OPEN && b.id !== activeBill?.id);
  const closedBills = bills.filter(b => b.status !== BillStatus.OPEN);

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-800 rounded-xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Billing Station</h2>
          {!activeBill && (
            <Button onClick={handleStartNewBill} variant="success" size="lg" leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            }>
              Create New Bill
            </Button>
          )}
        </div>

        {activeBill ? (
          <BillCreator
            bill={activeBill}
            menuItems={menuItems}
            onUpdateBill={updateActiveBill}
            onFinalizeBill={finalizeAndCloseBill}
            currencySymbol={currencySymbol}
            taxRate={taxRate}
          />
        ) : (
          <div>
            {openBills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-300 mb-3">Resume Open Bill:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openBills.map(bill => (
                    <button 
                      key={bill.id} 
                      onClick={() => setActiveBill(bill)}
                      className="p-4 bg-slate-700 rounded-lg shadow hover:bg-slate-600 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <p className="font-semibold text-pink-400">{bill.id}</p>
                      <p className="text-sm text-slate-400">
                        {bill.customerName && `Customer: ${bill.customerName}`} {bill.tableNumber && `(Table: ${bill.tableNumber})`}
                      </p>
                      <p className="text-sm text-slate-400">Items: {bill.items.length}</p>
                      <p className="text-lg font-bold text-emerald-400 mt-1">{currencySymbol}{bill.grandTotal.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="text-center text-slate-400 py-8 text-lg">
              {openBills.length === 0 ? "No active or open bills. Click 'Create New Bill' to start." : "Select an open bill to resume or create a new one."}
            </p>
          </div>
        )}
      </div>

      {closedBills.length > 0 && (
        <div className="p-6 bg-slate-800 rounded-xl shadow-xl mt-8">
          <h3 className="text-2xl font-semibold text-slate-300 mb-4">Bill History (Closed Bills)</h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-700 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Bill ID</th>
                  <th scope="col" className="px-6 py-3">Customer / Table</th>
                  <th scope="col" className="px-6 py-3">Total</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {closedBills.sort((a,b) => b.createdAt - a.createdAt).map(bill => (
                  <tr key={bill.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-medium text-pink-400 whitespace-nowrap">{bill.id}</td>
                    <td className="px-6 py-4">{bill.customerName || '-'} / {bill.tableNumber || '-'}</td>
                    <td className="px-6 py-4">{currencySymbol}{bill.grandTotal.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        bill.status === BillStatus.PAID ? 'bg-green-500/20 text-green-400' : 
                        bill.status === BillStatus.CANCELLED ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(bill.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Button onClick={() => openBillDetails(bill.id)} size="sm" variant="secondary">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <Modal isOpen={isInitialBillSetupModalOpen} onClose={() => setIsInitialBillSetupModalOpen(false)} title="Start New Bill">
        <div className="space-y-4">
          <Input 
            label="Customer Name (Optional)" 
            id="customerName" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            placeholder="e.g., Mr. Sharma"
          />
          <Input 
            label="Table Number (Optional)" 
            id="tableNumber" 
            value={tableNumber} 
            onChange={(e) => setTableNumber(e.target.value)} 
            placeholder="e.g., T5"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleCreateBillAndProceed} variant="primary">Create Bill & Add Items</Button>
        </div>
      </Modal>

      {selectedBillForDetails && (
        <Modal isOpen={!!selectedBillForDetails} onClose={closeBillDetailsModal} title={`Bill Details: ${selectedBillForDetails.id}`}>
            <BillDetails bill={selectedBillForDetails} currencySymbol={currencySymbol} taxRate={taxRate}/>
            <div className="mt-6 flex justify-end">
                 <Button onClick={closeBillDetailsModal} variant="secondary">Close</Button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default BillingView;
    