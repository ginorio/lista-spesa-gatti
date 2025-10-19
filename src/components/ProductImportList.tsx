import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Product, ShoppingType } from '@/types/shopping';
import { useToast } from '@/hooks/use-toast';

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
        title: "Attenzione",
        description: "Seleziona almeno un tipo di lista",
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
        title: "Prodotto aggiornato",
        description: `"${productName}" è stato aggiunto ai nuovi tipi di lista`,
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
        title: "Prodotto aggiunto",
        description: `"${productName}" è stato aggiunto alla lista`,
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
        title: "Prodotti aggiunti",
        description: `${addedCount} prodotti sono stati aggiunti alla lista`,
      });
      onProductsImported();
    } else {
      toast({
        title: "Attenzione",
        description: "Seleziona almeno un tipo per ogni prodotto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Prodotti Riconosciuti</h3>
        <Button onClick={handleAddAll} size="sm">
          Aggiungi Tutti
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
                      (esistente)
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
