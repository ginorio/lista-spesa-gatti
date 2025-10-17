export type ShoppingType = 'mensile' | 'bisettimanale' | 'settimanale' | 'trasversale';

export interface Product {
  id: string;
  name: string;
  type: ShoppingType;
  quantity: number;
  checked?: boolean;
}

export interface ShoppingCategory {
  id: ShoppingType;
  name: string;
  description: string;
  store: string;
  icon: string;
}
