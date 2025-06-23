
import { MenuItem, Bill } from '../types';

const MENU_ITEMS_KEY = 'restaurantAppMenuItems';
const BILLS_KEY = 'restaurantAppBills';

export const loadMenuItems = (): MenuItem[] => {
  try {
    const itemsJson = localStorage.getItem(MENU_ITEMS_KEY);
    return itemsJson ? JSON.parse(itemsJson) : [];
  } catch (error) {
    console.error("Failed to load menu items from local storage:", error);
    return [];
  }
};

export const saveMenuItems = (items: MenuItem[]): void => {
  try {
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save menu items to local storage:", error);
  }
};

export const loadBills = (): Bill[] => {
  try {
    const billsJson = localStorage.getItem(BILLS_KEY);
    return billsJson ? JSON.parse(billsJson) : [];
  } catch (error) {
    console.error("Failed to load bills from local storage:", error);
    return [];
  }
};

export const saveBills = (bills: Bill[]): void => {
  try {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  } catch (error) {
    console.error("Failed to save bills to local storage:", error);
  }
};
    