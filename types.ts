
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
  imageUrl?: string; 
}

export interface BillItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Bill {
  id: string;
  items: BillItem[];
  subTotal: number;
  taxAmount: number;
  grandTotal: number;
  createdAt: number; // timestamp
  status: BillStatus;
  customerName?: string;
  tableNumber?: string;
}

export enum BillStatus {
  OPEN = 'Open',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
}

export enum ViewMode {
  REPOSITORY = 'repository',
  BILLING = 'billing',
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}
    