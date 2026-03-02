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
      toast.error('Failed to load requests.');
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

      toast.success('Emergency request posted successfully!');
      reset();
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      console.error('Error posting request:', error);
      toast.error('Failed to post request.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-red-600 w-8 h-8" />
            Emergency Requests
          </h1>
          <p className="text-gray-500">Urgent blood needs in your area.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? 'Cancel Request' : 'Post New Request'}
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
            <Card className="p-6 border-l-4 border-l-red-600 bg-red-50">
              <h3 className="text-lg font-bold text-red-800 mb-4">Create Emergency Request</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Patient Name"
                  {...register('patient_name', { required: 'Required' })}
                  error={errors.patient_name?.message}
                />
                <div className="space-y-1">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    {...register('blood_group', { required: 'Required' })}
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  {errors.blood_group && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <Input
                  placeholder="Hospital Name"
                  {...register('hospital', { required: 'Required' })}
                  error={errors.hospital?.message}
                />
                <Input
                  placeholder="Contact Number"
                  {...register('contact_number', { required: 'Required' })}
                  error={errors.contact_number?.message}
                />
                <Input
                  type="date"
                  label="Required Date"
                  {...register('required_date', { required: 'Required' })}
                  error={errors.required_date?.message}
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" variant="primary">Post Request</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No active emergency requests.</p>
          </div>
        ) : (
          requests.map((req) => (
            <Card key={req.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={req.status === 'completed' ? 'success' : 'danger'}>
                      {req.status === 'completed' ? 'Fulfilled' : 'Urgent'}
                    </Badge>
                    <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Posted: {formatDate(req.created_at)}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{req.patient_name}</h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" /> {req.hospital}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-red-500 shrink-0" /> Required: {formatDate(req.required_date)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <span className="text-2xl sm:text-3xl font-black text-red-600 bg-red-50 px-3 py-1 rounded-xl">
                    {req.blood_group}
                  </span>
                  <a href={`tel:${req.contact_number}`} className="w-full sm:w-auto">
                    <Button size="sm" className="gap-2 w-full sm:w-auto">
                      <Phone className="w-4 h-4" /> <span className="sm:hidden">Call</span> <span className="hidden sm:inline">Call Contact</span>
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
