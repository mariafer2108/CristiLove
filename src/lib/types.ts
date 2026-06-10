export type ItemType = 'product' | 'material';

export interface RecipeItem {
  materialId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  type: ItemType;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  lastUpdated: string;
  unit?: string; // Para materiales (ej. "hojas", "metros")
  recipe?: RecipeItem[]; // Solo para productos que se fabrican
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  relatedProductId?: string;
}

// Deprecated in favor of Product with type: 'material'
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
}

export interface AppConfig {
  shopName: string;
  ownerName: string;
  currency: string;
  lowStockAlert: boolean;
  dailyReport: boolean;
}
