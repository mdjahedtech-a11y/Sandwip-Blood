import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Donor } from '@/types';
import { Card } from '@/components/ui/Card';
import { Trophy, Medal, Award } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export const Leaderboard = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const { data, error } = await supabase
          .from('donors')
          .select('*')
          .order('last_donation_date', { ascending: false }) // Show recent donors first as "Top" for now
          .limit(10);

        if (error) throw error;
        setDonors(data || []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1: return <Medal className="w-8 h-8 text-gray-400" />;
      case 2: return <Medal className="w-8 h-8 text-amber-700" />;
      default: return <Award className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-500" />
          {t('leaderboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('leaderboard.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">{t('leaderboard.loading')}</div>
      ) : (
        <div className="grid gap-4">
          {donors.map((donor, index) => (
            <Card key={donor.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex-shrink-0 w-12 flex justify-center">
                {getRankIcon(index)}
              </div>
              <div className="flex-shrink-0">
                {donor.photo_url ? (
                  <img
                    src={donor.photo_url}
                    alt={donor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-lg">
                    {donor.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{donor.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{donor.area}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-red-600 dark:text-red-400 block">
                  {donor.blood_group}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {t('leaderboard.lastDonation')}: {formatDate(donor.last_donation_date)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
