import { Product, Transaction, InventoryItem } from './types';

const STORAGE_KEYS = {
  PRODUCTS: 'cristilove_products',
  TRANSACTIONS: 'cristilove_transactions',
  INVENTORY: 'cristilove_inventory',
};

export const storage = {
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },
  
  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  
  getInventory: (): InventoryItem[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return data ? JSON.parse(data) : [];
  },
  saveInventory: (items: InventoryItem[]) => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  },
};
