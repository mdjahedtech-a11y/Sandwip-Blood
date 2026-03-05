import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { EmergencyRequest, BLOOD_GROUPS } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { AlertTriangle, Phone, MapPin, Calendar, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RequestFormInputs {
  patient_name: string;
  blood_group: string;
  hospital: string;
  contact_number: string;
  required_date: string;
}

export const Requests = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestFormInputs>();
  const { t } = useLanguage();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergency_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onSubmit = async (data: RequestFormInputs) => {
    try {
      const { error } = await supabase.from('emergency_requests').insert([
        {
          ...data,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      toast.success(t('common.success'));
      reset();
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      console.error('Error posting request:', error);
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AlertTriangle className="text-red-600 dark:text-red-500 w-8 h-8" />
            {t('requests.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t('requests.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 dark:bg-red-700 dark:text-white dark:hover:bg-red-600">
          {showForm ? t('requests.form.cancel') : t('requests.postRequest')}
          {!showForm && <Plus className="w-4 h-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 border-l-4 border-l-red-600 bg-red-50 dark:bg-red-900/10 dark:border-l-red-500">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4">{t('requests.postRequest')}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder={t('requests.form.patientName')}
                  {...register('patient_name', { required: 'Required' })}
                  error={errors.patient_name?.message}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                />
                <div className="space-y-1">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                    {...register('blood_group', { required: 'Required' })}
                  >
                    <option value="" className="dark:bg-gray-800">{t('requests.form.bloodGroup')}</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg} className="dark:bg-gray-800">{bg}</option>
                    ))}
                  </select>
                  {errors.blood_group && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <Input
                  placeholder={t('requests.form.hospital')}
                  {...register('hospital', { required: 'Required' })}
                  error={errors.hospital?.message}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                />
                <Input
                  placeholder={t('requests.form.contact')}
                  {...register('contact_number', { required: 'Required' })}
                  error={errors.contact_number?.message}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                />
                <Input
                  type="date"
                  label={t('requests.form.date')}
                  {...register('required_date', { required: 'Required' })}
                  error={errors.required_date?.message}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" variant="primary" className="dark:bg-red-700 dark:hover:bg-red-600">{t('requests.form.submit')}</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors duration-300">
            <p className="text-gray-500 dark:text-gray-400">No active emergency requests.</p>
          </div>
        ) : (
          requests.map((req) => (
            <Card key={req.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:border-l-red-500">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={req.status === 'completed' ? 'success' : 'danger'}>
                      {req.status === 'completed' ? 'Fulfilled' : t('requests.form.urgent')}
                    </Badge>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Posted: {formatDate(req.created_at)}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{req.patient_name}</h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" /> {req.hospital}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" /> {t('requests.card.needed')}: {formatDate(req.required_date)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 border-gray-100 dark:border-gray-700 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <span className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-xl">
                    {req.blood_group}
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <a href={`tel:${req.contact_number}`} className="flex-1 sm:flex-none">
                      <Button size="sm" className="gap-2 w-full dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                        <Phone className="w-4 h-4" /> {t('requests.card.call')}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
