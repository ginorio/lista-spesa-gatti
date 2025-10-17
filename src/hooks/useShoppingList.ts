import { useState, useEffect } from 'react';
import { Product, ShoppingType } from '@/types/shopping';
import { initialProducts } from '@/data/products';

const STORAGE_KEY = 'shopping-list-products';

export const useShoppingList = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return initialProducts.map(p => ({ ...p, quantity: 0 }));
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const updateQuantity = (productId: string, quantity: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, quantity: Math.max(0, quantity) } : p))
    );
  };

  const toggleChecked = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, checked: !p.checked } : p))
    );
  };

  const addProduct = (name: string, type: ShoppingType) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setProducts(prev => [...prev, { id, name, type, quantity: 0 }]);
  };

  const moveProduct = (productId: string, newType: ShoppingType) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, type: newType } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const resetQuantities = () => {
    setProducts(prev => prev.map(p => ({ ...p, quantity: 0 })));
  };

  const getProductsByType = (type: ShoppingType) => {
    return products.filter(p => p.type === type);
  };

  const getSelectedProducts = () => {
    return products.filter(p => p.quantity > 0);
  };

  return {
    products,
    updateQuantity,
    addProduct,
    moveProduct,
    deleteProduct,
    resetQuantities,
    toggleChecked,
    getProductsByType,
    getSelectedProducts,
  };
};
