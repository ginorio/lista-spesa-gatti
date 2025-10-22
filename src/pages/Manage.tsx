import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShoppingList } from '@/hooks/useShoppingList';
import { categories } from '@/data/products';
import { ArrowLeft, Plus, Trash2, MoveRight, Edit } from 'lucide-react';
import { ShoppingType, Product } from '@/types/shopping';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Textarea } from '@/components/ui/textarea';

const Manage = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, moveProduct, deleteProduct } = useShoppingList();
  const { t } = useLanguage();
  const [newProductName, setNewProductName] = useState('');
  const [newProductTypes, setNewProductTypes] = useState<ShoppingType[]>(['mensile']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [moveToType, setMoveToType] = useState<ShoppingType>('mensile');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editTypes, setEditTypes] = useState<ShoppingType[]>([]);
  const [editCustomName, setEditCustomName] = useState('');
  const [editComment, setEditComment] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const handleBarcodeDetected = async (barcode: string) => {
    toast.info(t('manage.fetchingProduct'));
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,brands`
      );
      const data = await response.json();
      
      if (data.status === 1 && data.product?.product_name) {
        const productName = data.product.brands 
          ? `${data.product.brands} - ${data.product.product_name}`
          : data.product.product_name;
        setNewProductName(productName);
        toast.success(`${t('manage.productAdded')}: ${productName}`);
      } else {
        toast.error(t('manage.productNotFound'));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(t('manage.scanError'));
    }
  };

  const handleAddProduct = () => {
    if (!newProductName.trim()) {
      toast.error(t('manage.insertProductName'));
      return;
    }

    if (newProductTypes.length === 0) {
      toast.error(t('manage.selectAtLeastOneList'));
      return;
    }

    addProduct(newProductName, newProductTypes);
    const listNames = newProductTypes.map(t => 
      allCategories.find(c => c.id === t)?.name
    ).join(', ');
    toast.success(`${t('manage.productAdded')} "${newProductName}" ${t('manage.addedToLists')} ${listNames}`);
    setNewProductName('');
    setNewProductTypes(['mensile']);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditTypes([...product.types]);
    setEditCustomName(product.custom_name || '');
    setEditComment(product.comment || '');
    setEditLocation(product.location || '');
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    if (!editName.trim()) {
      toast.error(t('manage.insertProductName'));
      return;
    }

    if (editTypes.length === 0) {
      toast.error(t('manage.selectAtLeastOneList'));
      return;
    }

    updateProduct(editingProduct.id, editName, editTypes, editCustomName, editComment, editLocation);
    const listNames = editTypes.map(t => 
      allCategories.find(c => c.id === t)?.name
    ).join(', ');
    toast.success(`${t('manage.productUpdated')} "${editName}" (${listNames})`);
    setEditingProduct(null);
  };

  const toggleEditType = (type: ShoppingType) => {
    setEditTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleNewProductType = (type: ShoppingType) => {
    setNewProductTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`${t('manage.confirmDelete')} "${productName}"?`)) {
      deleteProduct(productId);
      toast.success(t('manage.productDeleted'));
      setSelectedProducts(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleMoveProducts = () => {
    if (selectedProducts.size === 0) {
      toast.error(t('manage.selectAtLeastOneProduct'));
      return;
    }

    selectedProducts.forEach(productId => {
      moveProduct(productId, moveToType);
    });

    toast.success(`${selectedProducts.size} ${t('manage.productsMoved')} ${categories.find(c => c.id === moveToType)?.name}`);
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
    { id: 'trasversale' as ShoppingType, name: t('category.trasversale.name'), description: '', store: '', icon: '🌾' }
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProducts = allCategories.map(category => ({
    category,
    products: filteredProducts.filter(p => p.types.includes(category.id))
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
          {t('manage.backToHome')}
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">⚙️ {t('manage.title')}</CardTitle>
            <CardDescription>
              {t('manage.description')}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Aggiungi Prodotto */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('manage.addNewProduct')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product-name">{t('manage.productName')}</Label>
              <Input
                id="product-name"
                placeholder={t('manage.productNamePlaceholder')}
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProduct()}
              />
            </div>
            <BarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
            <div>
              <Label>{t('manage.shoppingLists')}</Label>
              <div className="space-y-2 mt-2">
                {allCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`new-${cat.id}`}
                      checked={newProductTypes.includes(cat.id)}
                      onCheckedChange={() => toggleNewProductType(cat.id)}
                    />
                    <Label htmlFor={`new-${cat.id}`} className="font-normal cursor-pointer">
                      {cat.icon} {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleAddProduct} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t('manage.addProduct')}
            </Button>
          </CardContent>
        </Card>

        {/* Sposta Prodotti */}
        {selectedProducts.size > 0 && (
          <Card className="mb-6 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MoveRight className="h-5 w-5" />
                {t('manage.moveProductsCount')} ({selectedProducts.size})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="move-to-type">{t('manage.moveTo')}</Label>
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
                  {t('manage.moveProducts')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProducts(new Set())}
                  className="flex-1"
                >
                  {t('manage.cancelSelection')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista Prodotti */}
        <Card>
          <CardHeader>
            <CardTitle>📦 {t('manage.allProducts')}</CardTitle>
            <CardDescription>
              {t('manage.selectToMove')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder={t('manage.search')}
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
                          <div>
                            <span className="text-foreground">{product.name}</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {product.types.map(t => allCategories.find(c => c.id === t)?.icon).join(' ')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                            className="text-primary hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('manage.editProduct')}</DialogTitle>
              <DialogDescription>
                {t('manage.editNameAndLists')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">{t('manage.productName')}</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-custom-name">{t('manage.customName')}</Label>
                <Input
                  id="edit-custom-name"
                  value={editCustomName}
                  onChange={(e) => setEditCustomName(e.target.value)}
                  placeholder={t('manage.customName')}
                />
              </div>
              <div>
                <Label htmlFor="edit-comment">{t('manage.comment')}</Label>
                <Textarea
                  id="edit-comment"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder={t('manage.comment')}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">{t('manage.location')}</Label>
                <Input
                  id="edit-location"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder={t('manage.location')}
                />
              </div>
              <div>
                <Label>{t('manage.shoppingLists')}</Label>
                <div className="space-y-2 mt-2">
                  {allCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${cat.id}`}
                        checked={editTypes.includes(cat.id)}
                        onCheckedChange={() => toggleEditType(cat.id)}
                      />
                      <Label htmlFor={`edit-${cat.id}`} className="font-normal cursor-pointer">
                        {cat.icon} {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">
                  {t('manage.saveChanges')}
                </Button>
                <Button variant="outline" onClick={() => setEditingProduct(null)} className="flex-1">
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Manage;
