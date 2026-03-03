import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
      className="font-bold text-sm"
    >
      {language === 'en' ? 'EN' : 'BN'}
    </Button>
  );
};
