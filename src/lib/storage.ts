import { Product, Transaction, InventoryItem, AppConfig } from './types';

const STORAGE_KEYS = {
  PRODUCTS: 'cristilove_products',
  TRANSACTIONS: 'cristilove_transactions',
  INVENTORY: 'cristilove_inventory',
  CONFIG: 'cristilove_config',
};

const DEFAULT_CONFIG: AppConfig = {
  shopName: 'CristiLove',
  ownerName: 'Cristi',
  currency: 'CLP',
  lowStockAlert: true,
  dailyReport: false,
};

// Función para verificar si estamos en el navegador
const isBrowser = () => typeof window !== 'undefined';

// Función para cargar datos desde la API
const loadFromAPI = async (type: 'products' | 'transactions'): Promise<any[]> => {
  try {
    const res = await fetch(`/api/${type}`);
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0) {
        // Guardamos en localStorage como respaldo
        const key = type === 'products' ? STORAGE_KEYS.PRODUCTS : STORAGE_KEYS.TRANSACTIONS;
        if (isBrowser()) {
          localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (error) {
    console.error(`Error loading ${type} from API:`, error);
  }
  // Fallback a localStorage si la API falla
  return loadFromLocal(type);
};

// Función para cargar desde localStorage
const loadFromLocal = (type: 'products' | 'transactions'): any[] => {
  if (!isBrowser()) return [];
  const key = type === 'products' ? STORAGE_KEYS.PRODUCTS : STORAGE_KEYS.TRANSACTIONS;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Función para guardar datos en API y localStorage
const saveData = async (type: 'products' | 'transactions', data: any[]) => {
  // Primero guardamos en localStorage para velocidad
  const key = type === 'products' ? STORAGE_KEYS.PRODUCTS : STORAGE_KEYS.TRANSACTIONS;
  if (isBrowser()) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Luego intentamos guardar en la API
  try {
    await fetch(`/api/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(`Error saving ${type} to API:`, error);
  }
};

export const storage = {
  getProducts: (): Product[] => {
    if (!isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  // Función para cargar productos desde la API (para usar en useEffect)
  loadProducts: async (): Promise<Product[]> => {
    return await loadFromAPI('products');
  },

  saveProducts: (products: Product[]) => {
    saveData('products', products);
  },
  
  getTransactions: (): Transaction[] => {
    if (!isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  // Función para cargar transacciones desde la API (para usar en useEffect)
  loadTransactions: async (): Promise<Transaction[]> => {
    return await loadFromAPI('transactions');
  },

  saveTransactions: (transactions: Transaction[]) => {
    saveData('transactions', transactions);
  },
  
  getInventory: (): InventoryItem[] => {
    if (!isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return data ? JSON.parse(data) : [];
  },

  saveInventory: (items: InventoryItem[]) => {
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
    }
  },

  getConfig: (): AppConfig => {
    if (!isBrowser()) return DEFAULT_CONFIG;
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return data ? JSON.parse(data) : DEFAULT_CONFIG;
  },

  saveConfig: (config: AppConfig) => {
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    }
  },

  exportData: () => {
    if (!isBrowser()) return;
    const data = {
      products: storage.getProducts(),
      transactions: storage.getTransactions(),
      config: storage.getConfig(),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cristilove_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  clearAllData: () => {
    if (!isBrowser()) return;
    if (confirm('¿Estás segura? Esto borrará todos los productos y transacciones localmente.')) {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.INVENTORY);
      window.location.reload();
    }
  }
};