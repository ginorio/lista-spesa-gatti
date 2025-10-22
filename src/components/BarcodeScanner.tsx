import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Barcode, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
}

export const BarcodeScanner = ({ onBarcodeDetected }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { t } = useLanguage();

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
      setIsScanning(false);
    }
  };

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("barcode-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          console.log('Barcode detected:', decodedText);
          toast.success(`${t('manage.barcodeDetected')}: ${decodedText}`);
          onBarcodeDetected(decodedText);
          stopScanning();
          setIsOpen(false);
        },
        (errorMessage) => {
          // Errors are normal during scanning, we can ignore them
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      toast.error(t('manage.scanError'));
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      stopScanning();
    } else {
      setTimeout(() => startScanning(), 100);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Barcode className="mr-2 h-4 w-4" />
        {t('manage.scanBarcode')}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {t('manage.barcodeScanner')}
            </DialogTitle>
            <DialogDescription>
              {t('manage.scanBarcodeDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div id="barcode-reader" className="w-full rounded-lg overflow-hidden border" />
            
            <div className="flex gap-2">
              {isScanning ? (
                <Button onClick={stopScanning} variant="destructive" className="flex-1">
                  {t('manage.stopScanning')}
                </Button>
              ) : (
                <Button onClick={startScanning} className="flex-1">
                  {t('manage.startScanning')}
                </Button>
              )}
              <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
