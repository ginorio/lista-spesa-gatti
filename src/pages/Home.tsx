import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/products';
import { ShoppingCart, Settings, LogOut } from 'lucide-react';
import { PhotoImport } from '@/components/PhotoImport';
import { useShoppingList } from '@/hooks/useShoppingList';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading } = useShoppingList();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Disconnesso",
      description: "Sei stato disconnesso con successo",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1" />
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground">
              v1.4 - 18/10/2025
            </p>
            {user && (
              <p className="text-xs text-muted-foreground mt-1">
                {user.email}
              </p>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Disconnetti"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            🛒 Lista della Spesa
          </h1>
          <p className="text-muted-foreground text-lg">
            Organizza la tua spesa in modo semplice e veloce
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
              onClick={() => navigate(`/products/${category.id}`)}
            >
              <CardHeader>
                <div className="text-4xl mb-2">{category.icon}</div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  📍 {category.store}
                </p>
                <Button className="w-full" variant="default">
                  Seleziona Prodotti
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-accent" onClick={() => navigate('/summary')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Riepilogo Spesa
              </CardTitle>
              <CardDescription>
                Visualizza tutti i prodotti selezionati
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" onClick={(e) => { e.stopPropagation(); navigate('/summary'); }}>
                Vai al Riepilogo
              </Button>
              <PhotoImport
                existingProducts={products}
                onProductsAdded={() => {
                  navigate('/summary');
                }}
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-accent" onClick={() => navigate('/manage')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Gestisci Prodotti
              </CardTitle>
              <CardDescription>
                Aggiungi o sposta prodotti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Gestisci
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
