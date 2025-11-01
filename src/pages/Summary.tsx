import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useShoppingList } from '@/hooks/useShoppingList';
import { categories } from '@/data/products';
import { ArrowLeft, Trash2, Share2, FileDown } from 'lucide-react';
import { ShoppingType } from '@/types/shopping';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import { PhotoImport } from '@/components/PhotoImport';

const Summary = () => {
  const navigate = useNavigate();
  const { getSelectedProducts, resetQuantities, toggleChecked, products } = useShoppingList();
  const selectedProducts = getSelectedProducts();
  const { toast } = useToast();

  const productsByType = categories.reduce((acc, category) => {
    const categoryProducts = selectedProducts.filter(p => p.types.includes(category.id));
    if (categoryProducts.length > 0) {
      acc[category.id] = categoryProducts;
    }
    return acc;
  }, {} as Record<ShoppingType, typeof selectedProducts>);

  // Prodotti trasversali
  const trasversaliProducts = selectedProducts.filter(p => p.types.includes('trasversale'));

  const handleReset = () => {
    if (confirm('Sei sicuro di voler cancellare tutte le quantità?')) {
      resetQuantities();
    }
  };

  const handleShareWhatsApp = () => {
    let message = '🛒 *Lista della Spesa*\n\n';
    
    categories.forEach((category) => {
      const categoryProducts = productsByType[category.id];
      if (categoryProducts) {
        message += `*${category.icon} ${category.name}* (${category.store})\n`;
        categoryProducts.forEach((product) => {
          message += `• ${product.name} x${product.quantity}\n`;
        });
        message += '\n';
      }
    });

    if (trasversaliProducts.length > 0) {
      message += '*🌾 Prodotti Trasversali*\n';
      trasversaliProducts.forEach((product) => {
        message += `• ${product.name} x${product.quantity}\n`;
      });
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(18);
    doc.text('Lista della Spesa', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 20, yPosition);
    yPosition += 15;

    categories.forEach((category) => {
      const categoryProducts = productsByType[category.id];
      if (categoryProducts) {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.text(`${category.icon} ${category.name} (${category.store})`, 20, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        categoryProducts.forEach((product) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${product.name} x${product.quantity}`, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }
    });

    if (trasversaliProducts.length > 0) {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('🌾 Prodotti Trasversali', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      trasversaliProducts.forEach((product) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${product.name} x${product.quantity}`, 25, yPosition);
        yPosition += 6;
      });
    }

    const fileName = `lista_spesa_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF Generato",
      description: "La lista della spesa è stata salvata",
    });
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
                Inizia a selezionare i prodotti per la tua spesa o importali da una foto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <PhotoImport 
                onProductsAdded={() => window.location.reload()} 
              />
              <Button onClick={() => navigate('/')} className="w-full">
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
                        <div className="flex items-center gap-3 py-2">
                          <Checkbox
                            checked={product.checked || false}
                            onCheckedChange={() => toggleChecked(product.id)}
                          />
                          <span className={`flex-1 text-foreground ${product.checked ? 'line-through opacity-60' : ''}`}>
                            {product.name}
                          </span>
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
                      <div className="flex items-center gap-3 py-2">
                        <Checkbox
                          checked={product.checked || false}
                          onCheckedChange={() => toggleChecked(product.id)}
                        />
                        <span className={`flex-1 text-foreground ${product.checked ? 'line-through opacity-60' : ''}`}>
                          {product.name}
                        </span>
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

        <div className="mt-8 space-y-3">
          <PhotoImport 
            onProductsAdded={() => window.location.reload()} 
          />
          
          <div className="flex gap-3">
            <Button
              className="flex-1"
              variant="default"
              onClick={handleShareWhatsApp}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Condividi su WhatsApp
            </Button>
            <Button
              className="flex-1"
              variant="default"
              onClick={handleGeneratePDF}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Scarica PDF
            </Button>
          </div>
          <Button
            className="w-full"
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
