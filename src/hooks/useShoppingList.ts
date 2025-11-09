import { useState, useEffect } from 'react';
import { Product, ShoppingType } from '@/types/shopping';
import { initialProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useShoppingList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUserId(session?.user?.id ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    loadProducts();
  }, [userId]);

  const loadProducts = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_products')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        const defaultProducts = initialProducts.map(p => ({
          ...p,
          quantity: 0,
          checked: false,
        }));
        setProducts(defaultProducts);
        
        for (const product of defaultProducts) {
          await supabase.from('user_products').insert({
            user_id: userId,
            name: product.name,
            types: product.types,
            quantity: 0,
            checked: false,
          });
        }
      } else {
      const mappedProducts: Product[] = data.map(p => ({
        id: p.id,
        name: p.name,
        types: p.types as ShoppingType[],
        quantity: p.quantity,
        checked: p.checked ?? false,
        custom_name: p.custom_name,
        comment: p.comment,
        location: p.location,
      }));
        setProducts(mappedProducts);
      }
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i prodotti',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const syncProduct = async (product: Product) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_products')
        .upsert({
          id: product.id,
          user_id: userId,
          name: product.name,
          types: product.types,
          quantity: product.quantity,
          checked: product.checked ?? false,
          custom_name: product.custom_name,
          comment: product.comment,
          location: product.location,
        });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile salvare il prodotto',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const updatedProduct = products.find(p => p.id === productId);
    if (!updatedProduct) return;

    const newProduct = { ...updatedProduct, quantity: Math.max(0, quantity) };
    setProducts(prev =>
      prev.map(p => (p.id === productId ? newProduct : p))
    );
    await syncProduct(newProduct);
  };

  const toggleChecked = async (productId: string) => {
    const updatedProduct = products.find(p => p.id === productId);
    if (!updatedProduct) return;

    const newProduct = { ...updatedProduct, checked: !updatedProduct.checked };
    setProducts(prev =>
      prev.map(p => (p.id === productId ? newProduct : p))
    );
    await syncProduct(newProduct);
  };

  const addProduct = async (name: string, types: ShoppingType[], initialQuantity: number = 0) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_products')
        .insert({
          user_id: userId,
          name,
          types,
          quantity: initialQuantity,
          checked: false,
        })
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        types: data.types as ShoppingType[],
        quantity: data.quantity,
        checked: data.checked ?? false,
      };

      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere il prodotto',
        variant: 'destructive',
      });
      return undefined;
    }
  };

  const updateProduct = async (productId: string, name: string, types: ShoppingType[], custom_name?: string, comment?: string, location?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updatedProduct = { ...product, name, types, custom_name, comment, location };
    setProducts(prev =>
      prev.map(p => (p.id === productId ? updatedProduct : p))
    );
    await syncProduct(updatedProduct);
  };

  const moveProduct = async (productId: string, newType: ShoppingType) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updatedProduct = { ...product, types: [newType] };
    setProducts(prev =>
      prev.map(p => (p.id === productId ? updatedProduct : p))
    );
    await syncProduct(updatedProduct);
  };

  const deleteProduct = async (productId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il prodotto',
        variant: 'destructive',
      });
    }
  };

  const resetQuantities = async () => {
    const updatedProducts = products.map(p => ({ ...p, quantity: 0 }));
    setProducts(updatedProducts);

    for (const product of updatedProducts) {
      await syncProduct(product);
    }
  };

  const getProductsByType = (type: ShoppingType) => {
    return products.filter(p => p.types.includes(type));
  };

  const getSelectedProducts = () => {
    return products.filter(p => p.quantity > 0);
  };

  return {
    products,
    loading,
    updateQuantity,
    addProduct,
    updateProduct,
    moveProduct,
    deleteProduct,
    resetQuantities,
    toggleChecked,
    getProductsByType,
    getSelectedProducts,
  };
};
