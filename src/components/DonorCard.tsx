import { Donor } from '@/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Phone, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface DonorCardProps {
  donor: Donor;
}

export const DonorCard = ({ donor }: DonorCardProps) => {
  // If next_eligible_date is null, it means they haven't donated recently (or ever), so they are eligible.
  const isEligible = !donor.next_eligible_date || new Date(donor.next_eligible_date) <= new Date();
  const { t } = useLanguage();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500 dark:bg-gray-800 dark:border-gray-700 dark:border-l-red-500">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {donor.photo_url ? (
              <img
                src={donor.photo_url}
                alt={donor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-red-100 dark:border-red-900"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xl border-2 border-red-50 dark:border-red-900/50">
                {donor.name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
              {isEligible ? (
                <CheckCircle className="w-5 h-5 text-green-500 fill-white dark:fill-gray-800" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 fill-white dark:fill-gray-800" />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{donor.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              {donor.area}
            </div>
            <Badge variant={isEligible ? 'success' : 'danger'}>
              {isEligible ? t('donors.available') : t('donors.unavailable')}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
            {donor.blood_group}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400 dark:text-gray-500 text-xs">{t('donors.lastDonation')}</span>
          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(donor.last_donation_date)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 dark:text-gray-500 text-xs">Next Eligible</span>
          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(donor.next_eligible_date)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <a href={`tel:${donor.phone}`} className="flex-1 block">
          <Button className="w-full gap-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" size="sm">
            <Phone className="w-4 h-4" />
            {t('donors.call')}
          </Button>
        </a>
        <a 
          href={`https://wa.me/${donor.phone.replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1 block"
        >
          <Button className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white border-none dark:bg-green-600 dark:hover:bg-green-700" size="sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {t('donors.whatsapp')}
          </Button>
        </a>
      </div>
    </Card>
  );
};
