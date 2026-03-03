import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Award, Download, Printer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Certificate = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCertificate, setShowCertificate] = useState(false);
  const { t } = useLanguage();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCertificate(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <Award className="w-10 h-10 text-yellow-500" />
          {t('certificate.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('certificate.subtitle')}
        </p>
      </div>

      {!showCertificate ? (
        <Card className="p-6 max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700">
          <form onSubmit={handleGenerate} className="space-y-4">
            <Input
              label={t('certificate.form.name')}
              placeholder={t('certificate.form.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <Input
              type="date"
              label={t('certificate.form.date')}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button type="submit" className="w-full dark:bg-red-700 dark:hover:bg-red-600 dark:text-white">
              {t('certificate.form.submit')}
            </Button>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center gap-4 print:hidden">
            <Button onClick={handlePrint} className="gap-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              <Printer className="w-4 h-4" /> {t('certificate.preview.print')}
            </Button>
            <Button variant="outline" onClick={() => setShowCertificate(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              {t('certificate.preview.new')}
            </Button>
          </div>

          <div className="border-8 border-double border-yellow-600 p-10 bg-white text-center shadow-2xl relative overflow-hidden print:shadow-none print:border-4">
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-100 rounded-br-full opacity-50 -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-100 rounded-tl-full opacity-50 translate-x-16 translate-y-16"></div>
            
            <div className="relative z-10 space-y-6 py-12">
              <div className="flex justify-center mb-8">
                <Award className="w-24 h-24 text-red-600" />
              </div>
              
              <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-wide uppercase">{t('certificate.preview.title')}</h1>
              
              <p className="text-xl text-gray-600 italic mt-4">{t('certificate.preview.presentedTo')}</p>
              
              <h2 className="text-4xl font-bold text-red-700 border-b-2 border-gray-300 inline-block pb-2 px-8 min-w-[300px]">
                {name}
              </h2>
              
              <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
                {t('certificate.preview.body')} <span className="font-bold text-gray-800">{new Date(date).toLocaleDateString()}</span>.
                {t('certificate.preview.bodyEnd')}
              </p>
              
              <div className="mt-16 flex justify-between items-end px-12">
                <div className="text-center">
                  <div className="w-48 border-t border-gray-400 pt-2">
                    <p className="font-bold text-gray-800">{t('certificate.preview.org')}</p>
                    <p className="text-sm text-gray-500">{t('certificate.preview.orgTitle')}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 border-t border-gray-400 pt-2">
                    <p className="font-bold text-gray-800">{t('certificate.preview.sig')}</p>
                    <p className="text-sm text-gray-500">{t('certificate.preview.sigTitle')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
