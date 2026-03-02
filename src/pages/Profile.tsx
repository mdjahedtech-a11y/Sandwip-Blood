import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Donor, BLOOD_GROUPS } from '@/types/index';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { User, Phone, MapPin, Droplet, Calendar, Upload, Save, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
    fetchDonorProfile(session.user.id);
  };

  const fetchDonorProfile = async (userId: string) => {
    try {
      // Try to find donor by user_id
      let { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      // If not found by user_id, maybe try email if available?
      // For now, assume user_id is the link.
      
      if (data) {
        setDonor(data);
        // Set form values
        setValue('name', data.name);
        setValue('phone', data.phone);
        setValue('blood_group', data.blood_group);
        setValue('area', data.area);
        setValue('last_donation_date', data.last_donation_date);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      let photoUrl = donor?.photo_url;

      // Upload new photo if selected
      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        if (file.size > 110 * 1024) {
          toast.error('Image size must be less than 110KB');
          setSaving(false);
          return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('donor-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('donor-photos')
          .getPublicUrl(filePath);
        photoUrl = publicUrl;
      }

      const updates = {
        name: data.name,
        phone: data.phone,
        blood_group: data.blood_group,
        area: data.area,
        last_donation_date: data.last_donation_date || null,
        photo_url: photoUrl,
        user_id: user.id, // Ensure link
        updated_at: new Date().toISOString(),
      };

      let error;
      if (donor) {
        // Update existing
        const { error: updateError } = await supabase
          .from('donors')
          .update(updates)
          .eq('id', donor.id);
        error = updateError;
      } else {
        // Create new if somehow missing but logged in
        const { error: insertError } = await supabase
          .from('donors')
          .insert([updates]);
        error = insertError;
      }

      if (error) throw error;

      toast.success('Profile updated successfully!');
      fetchDonorProfile(user.id);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Button variant="outline" onClick={handleLogout} size="sm">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Photo Preview */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
              {donor?.photo_url ? (
                <img src={donor.photo_url} alt={donor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-16 h-16" />
                </div>
              )}
            </div>
            <div className="w-full max-w-xs">
              <label className="block text-sm font-medium text-gray-700 text-center mb-2">Change Photo</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-red-700
                  hover:file:bg-red-100"
                {...register('photo')}
              />
              <p className="text-xs text-gray-500 text-center mt-1">Max 110KB. <a href="https://compressjpeg.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Compress here</a></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <Input
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message as string}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <Input
                {...register('phone', { required: 'Phone is required' })}
                error={errors.phone?.message as string}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Droplet className="w-4 h-4" /> Blood Group
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                {...register('blood_group', { required: 'Required' })}
              >
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Area
              </label>
              <Input
                {...register('area', { required: 'Area is required' })}
                error={errors.area?.message as string}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Last Donation Date
              </label>
              <Input
                type="date"
                {...register('last_donation_date')}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={saving} size="lg">
              {saving ? 'Saving...' : 'Save Changes'}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
