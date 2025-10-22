import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { categories } from '@/data/products';
import { useShoppingList } from '@/hooks/useShoppingList';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { ShoppingType } from '@/types/shopping';
import { useLanguage } from '@/contexts/LanguageContext';

const Products = () => {
  const { type } = useParams<{ type: ShoppingType }>();
  const navigate = useNavigate();
  const { products, updateQuantity, getProductsByType } = useShoppingList();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const category = categories.find(c => c.id === type);
  const categoryProducts = type ? getProductsByType(type) : [];
  
  const filteredProducts = categoryProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>{t('products.notFound')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>{t('products.back')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('products.back')}
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="text-4xl mb-2">{category.icon}</div>
            <CardTitle className="text-2xl md:text-3xl">{t(`category.${category.id}.name`)}</CardTitle>
            <CardDescription>
              {t(`category.${category.id}.description`)} • {category.store}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder={t('products.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} prodotti disponibili
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3 mb-6">
          {filteredProducts.map((product) => {
            const currentProduct = products.find(p => p.id === product.id);
            const quantity = currentProduct?.quantity || 0;

            return (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-foreground">{product.custom_name || product.name}</p>
                    {product.comment && <p className="text-sm text-muted-foreground mt-1">{product.comment}</p>}
                    {product.location && <p className="text-xs text-muted-foreground">📍 {product.location}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 text-center font-semibold text-lg">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="sticky bottom-4 flex gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => navigate('/')}
          >
            {t('products.continueShopping')}
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate('/summary')}
          >
            {t('products.goToSummary')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
