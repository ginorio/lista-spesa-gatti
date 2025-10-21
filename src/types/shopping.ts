export type ShoppingType = 'mensile' | 'bisettimanale' | 'settimanale' | 'trasversale';

export interface Product {
  id: string;
  name: string;
  types: ShoppingType[]; // Changed from single type to array
  quantity: number;
  checked?: boolean;
  custom_name?: string;
  comment?: string;
  location?: string;
}

export interface ShoppingCategory {
  id: ShoppingType;
  name: string;
  description: string;
  store: string;
  icon: string;
}
