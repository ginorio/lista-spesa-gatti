import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShoppingList } from '@/hooks/useShoppingList';
import { categories } from '@/data/products';
import { ArrowLeft, Plus, Trash2, MoveRight } from 'lucide-react';
import { ShoppingType } from '@/types/shopping';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const Manage = () => {
  const navigate = useNavigate();
  const { products, addProduct, moveProduct, deleteProduct } = useShoppingList();
  const [newProductName, setNewProductName] = useState('');
  const [newProductType, setNewProductType] = useState<ShoppingType>('mensile');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [moveToType, setMoveToType] = useState<ShoppingType>('mensile');

  const handleAddProduct = () => {
    if (!newProductName.trim()) {
      toast.error('Inserisci il nome del prodotto');
      return;
    }

    addProduct(newProductName, newProductType);
    toast.success(`Prodotto "${newProductName}" aggiunto a ${categories.find(c => c.id === newProductType)?.name}`);
    setNewProductName('');
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Sei sicuro di voler eliminare "${productName}"?`)) {
      deleteProduct(productId);
      toast.success('Prodotto eliminato');
      setSelectedProducts(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleMoveProducts = () => {
    if (selectedProducts.size === 0) {
      toast.error('Seleziona almeno un prodotto');
      return;
    }

    selectedProducts.forEach(productId => {
      moveProduct(productId, moveToType);
    });

    toast.success(`${selectedProducts.size} prodotti spostati in ${categories.find(c => c.id === moveToType)?.name}`);
    setSelectedProducts(new Set());
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const allCategories = [
    ...categories,
    { id: 'trasversale' as ShoppingType, name: 'Prodotti Trasversali', description: '', store: '', icon: '🌾' }
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProducts = allCategories.map(category => ({
    category,
    products: filteredProducts.filter(p => p.type === category.id)
  })).filter(group => group.products.length > 0);

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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">⚙️ Gestisci Prodotti</CardTitle>
            <CardDescription>
              Aggiungi nuovi prodotti o sposta quelli esistenti
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Aggiungi Prodotto */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Aggiungi Nuovo Prodotto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product-name">Nome Prodotto</Label>
              <Input
                id="product-name"
                placeholder="Es: Miele biologico"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProduct()}
              />
            </div>
            <div>
              <Label htmlFor="product-type">Tipo di Spesa</Label>
              <Select value={newProductType} onValueChange={(value) => setNewProductType(value as ShoppingType)}>
                <SelectTrigger id="product-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddProduct} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Prodotto
            </Button>
          </CardContent>
        </Card>

        {/* Sposta Prodotti */}
        {selectedProducts.size > 0 && (
          <Card className="mb-6 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MoveRight className="h-5 w-5" />
                Sposta Prodotti Selezionati ({selectedProducts.size})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="move-to-type">Sposta in</Label>
                <Select value={moveToType} onValueChange={(value) => setMoveToType(value as ShoppingType)}>
                  <SelectTrigger id="move-to-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleMoveProducts} className="flex-1">
                  Sposta Prodotti
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProducts(new Set())}
                  className="flex-1"
                >
                  Annulla Selezione
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista Prodotti */}
        <Card>
          <CardHeader>
            <CardTitle>📦 Tutti i Prodotti</CardTitle>
            <CardDescription>
              Seleziona prodotti per spostarli o eliminarli
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Cerca prodotto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            <div className="space-y-6">
              {groupedProducts.map(({ category, products: categoryProducts }) => (
                <div key={category.id}>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({categoryProducts.length})
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          selectedProducts.has(product.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="h-4 w-4 cursor-pointer"
                          />
                          <span className="text-foreground">{product.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Manage;
