import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Product, ShoppingType } from '@/types/shopping';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductImportListProps {
  recognizedProducts: string[];
  existingProducts: Product[];
  onProductsImported: () => void;
}

const categories: { id: ShoppingType; name: string }[] = [
  { id: 'mensile', name: 'Mensile' },
  { id: 'bisettimanale', name: 'Bisettimanale' },
  { id: 'settimanale', name: 'Settimanale' },
];

export const ProductImportList = ({
  recognizedProducts,
  existingProducts,
  onProductsImported,
}: ProductImportListProps) => {
  const [selectedTypes, setSelectedTypes] = useState<Record<string, ShoppingType[]>>({});
  const { toast } = useToast();
  const { t } = useLanguage();

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

  const handleAddProduct = (productName: string) => {
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
    
    // Get current products from localStorage
    const stored = localStorage.getItem('shopping-list-products');
    let products: Product[] = stored ? JSON.parse(stored) : [];

    if (existing) {
      // Update existing product with new types
      products = products.map((p) => {
        if (p.id === existing.id) {
          const mergedTypes = Array.from(new Set([...p.types, ...types]));
          return { ...p, types: mergedTypes, quantity: Math.max(p.quantity, 1) };
        }
        return p;
      });
      toast({
        title: t('manage.productUpdated'),
        description: `"${productName}" ${t('photo.addedToLists')}`,
      });
    } else {
      // Create new product
      const newProduct: Product = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: productName,
        types: types,
        quantity: 1,
      };
      products.push(newProduct);
      toast({
        title: t('manage.productAdded'),
        description: `"${productName}" ${t('photo.addedToLists')}`,
      });
    }

    // Save to localStorage
    localStorage.setItem('shopping-list-products', JSON.stringify(products));

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));

    // Clear selection for this product
    setSelectedTypes((prev) => {
      const newState = { ...prev };
      delete newState[productName];
      return newState;
    });
  };

  const handleAddAll = () => {
    let addedCount = 0;
    
    recognizedProducts.forEach((productName) => {
      const types = selectedTypes[productName];
      if (types && types.length > 0) {
        const stored = localStorage.getItem('shopping-list-products');
        let products: Product[] = stored ? JSON.parse(stored) : [];
        const existing = findExistingProduct(productName);

        if (existing) {
          products = products.map((p) => {
            if (p.id === existing.id) {
              const mergedTypes = Array.from(new Set([...p.types, ...types]));
              return { ...p, types: mergedTypes, quantity: Math.max(p.quantity, 1) };
            }
            return p;
          });
        } else {
          const newProduct: Product = {
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: productName,
            types: types,
            quantity: 1,
          };
          products.push(newProduct);
        }

        localStorage.setItem('shopping-list-products', JSON.stringify(products));
        addedCount++;
      }
    });

    if (addedCount > 0) {
      window.dispatchEvent(new Event('storage'));
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddProduct(productName)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
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
