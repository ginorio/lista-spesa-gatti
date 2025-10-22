import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, ShoppingType } from '@/types/shopping';
import { ProductImportList } from './ProductImportList';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhotoImportProps {
  existingProducts: Product[];
  onProductsAdded: () => void;
}

export const PhotoImport = ({ existingProducts, onProductsAdded }: PhotoImportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedProducts, setRecognizedProducts] = useState<string[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target?.result as string;

        // Call edge function
        const { data, error } = await supabase.functions.invoke('ocr-products', {
          body: { image: base64Image }
        });

        if (error) throw error;

        setRecognizedProducts(data.products);
        toast({
          title: t('photo.recognized'),
          description: `${t('photo.foundProducts')} ${data.products.length} ${t('photo.foundProductsIn')}`,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: t('auth.error'),
        description: t('photo.error'),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRecognizedProducts([]);
  };

  const handleProductsImported = () => {
    onProductsAdded();
    handleClose();
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Camera className="mr-2 h-4 w-4" />
        {t('photo.importFromPhoto')}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('photo.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              {isProcessing && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('photo.processing')}
                </p>
              )}
            </div>

            {recognizedProducts.length > 0 && (
              <ProductImportList
                recognizedProducts={recognizedProducts}
                existingProducts={existingProducts}
                onProductsImported={handleProductsImported}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
