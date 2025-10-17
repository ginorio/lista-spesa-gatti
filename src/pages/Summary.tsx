import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useShoppingList } from '@/hooks/useShoppingList';
import { categories } from '@/data/products';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { ShoppingType } from '@/types/shopping';

const Summary = () => {
  const navigate = useNavigate();
  const { getSelectedProducts, resetQuantities } = useShoppingList();
  const selectedProducts = getSelectedProducts();

  const productsByType = categories.reduce((acc, category) => {
    const categoryProducts = selectedProducts.filter(p => p.type === category.id);
    if (categoryProducts.length > 0) {
      acc[category.id] = categoryProducts;
    }
    return acc;
  }, {} as Record<ShoppingType, typeof selectedProducts>);

  // Prodotti trasversali
  const trasversaliProducts = selectedProducts.filter(p => p.type === 'trasversale');

  const handleReset = () => {
    if (confirm('Sei sicuro di voler cancellare tutte le quantità?')) {
      resetQuantities();
    }
  };

  if (selectedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Home
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Nessun prodotto selezionato</CardTitle>
              <CardDescription>
                Inizia a selezionare i prodotti per la tua spesa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')}>
                Vai alla selezione
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Home
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReset}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cancella tutto
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">📋 Riepilogo Spesa</CardTitle>
            <CardDescription>
              {selectedProducts.length} prodotti selezionati
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {categories.map((category) => {
            const categoryProducts = productsByType[category.id];
            if (!categoryProducts) return null;

            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription>{category.store}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryProducts.map((product, index) => (
                      <div key={product.id}>
                        {index > 0 && <Separator className="my-2" />}
                        <div className="flex justify-between items-center py-2">
                          <span className="text-foreground">{product.name}</span>
                          <span className="font-semibold text-primary">
                            x {product.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {trasversaliProducts.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌾</span>
                  <div>
                    <CardTitle className="text-xl">Prodotti Trasversali</CardTitle>
                    <CardDescription>
                      Disponibili in tutti i negozi
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trasversaliProducts.map((product, index) => (
                    <div key={product.id}>
                      {index > 0 && <Separator className="my-2" />}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-foreground">{product.name}</span>
                        <span className="font-semibold text-primary">
                          x {product.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Modifica Selezione
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
