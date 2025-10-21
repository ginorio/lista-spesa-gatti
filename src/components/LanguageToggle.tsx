import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'it' ? 'IT' : 'EN'}
    </Button>
  );
};
