import { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Product, ShoppingType } from '@/types/shopping';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useShoppingList } from '@/hooks/useShoppingList';

interface ProductImportListProps {
  recognizedProducts: string[];
  onProductsImported: () => void;
}

const categories: { id: ShoppingType; name: string }[] = [
  { id: 'mensile', name: 'Mensile' },
  { id: 'bisettimanale', name: 'Bisettimanale' },
  { id: 'settimanale', name: 'Settimanale' },
];

export const ProductImportList = ({
  recognizedProducts,
  onProductsImported,
}: ProductImportListProps) => {
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ShoppingType[]>>({});
  const { toast } = useToast();
  const { t } = useLanguage();
  const { products: existingProducts, addProduct, updateQuantity } = useShoppingList();

  const toggleType = (productName: string, type: ShoppingType) => {
    setSelectedTypes((prev) => {
      const current = prev[productName] || [];
      const newTypes = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, [productName]: newTypes };
    });
  };

  const findExistingProduct = (productName: string): Product | undefined => {
    const normalized = productName.toLowerCase().trim();
    return existingProducts.find((p) => 
      p.name.toLowerCase().trim() === normalized
    );
  };

  const handleAddProduct = async (productName: string, addToCart: boolean = false) => {
    const types = selectedTypes[productName];
    if (!types || types.length === 0) {
      toast({
        title: t('manage.insertProductName'),
        description: t('manage.selectAtLeastOneList'),
        variant: "destructive",
      });
      return;
    }

    const existing = findExistingProduct(productName);

    if (existing) {
      toast({
        title: t('manage.productUpdated'),
        description: `"${productName}" ${t('photo.addedToLists')}`,
      });
      if (addToCart) {
        await updateQuantity(existing.id, Math.max(existing.quantity, 1));
      }
    } else {
      await addProduct(productName, types);
      toast({
        title: t('manage.productAdded'),
        description: `"${productName}" ${t('photo.addedToLists')}`,
      });
      
      if (addToCart) {
        // Find the newly added product and set quantity
        const newProduct = existingProducts.find(p => p.name === productName);
        if (newProduct) {
          await updateQuantity(newProduct.id, 1);
        }
      }
    }

    // Clear selection for this product
    setSelectedTypes((prev) => {
      const newState = { ...prev };
      delete newState[productName];
      return newState;
    });
  };

  const handleAddAll = async () => {
    let addedCount = 0;
    
    for (const productName of recognizedProducts) {
      const types = selectedTypes[productName];
      if (types && types.length > 0) {
        await handleAddProduct(productName, false);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      toast({
        title: t('photo.productsAdded'),
        description: `${addedCount} ${t('photo.productsAdded')}`,
      });
      onProductsImported();
    } else {
      toast({
        title: t('auth.error'),
        description: t('manage.selectAtLeastOneList'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{t('photo.recognized')}</h3>
        <Button onClick={handleAddAll} size="sm">
          {t('photo.addAll')}
        </Button>
      </div>

      <div className="space-y-3">
        {recognizedProducts.map((productName, index) => {
          const existing = findExistingProduct(productName);
          return (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {productName}
                  {existing && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({t('photo.alreadyExists')})
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddProduct(productName, false)}
                    title={t('photo.addProduct')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleAddProduct(productName, true)}
                    title={t('photo.addToCart')}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedTypes[productName]?.includes(cat.id) || false}
                      onCheckedChange={() => toggleType(productName, cat.id)}
                    />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
