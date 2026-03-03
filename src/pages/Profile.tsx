import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Donor, BLOOD_GROUPS } from '@/types/index';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { User, Phone, MapPin, Droplet, Calendar, Upload, Save, LogOut, Edit2, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatDate, calculateNextEligibleDate } from '@/lib/utils';

export const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    checkUser();
    
    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
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
      // 1. Try to find donor by user_id
      let { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows gracefully

      if (error) {
        throw error;
      }

      if (data) {
        // Calculate next eligible date if last donation date exists
        const donorData = {
          ...data,
          next_eligible_date: data.last_donation_date 
            ? calculateNextEligibleDate(data.last_donation_date) 
            : null
        };
        
        setDonor(donorData);
        // Set form values
        setValue('name', data.name);
        setValue('phone', data.phone);
        setValue('blood_group', data.blood_group);
        setValue('area', data.area);
        setValue('last_donation_date', data.last_donation_date);
        setIsEditing(false); // Default to view mode if profile exists
      } else {
        setIsEditing(true); // Default to edit mode (create) if no profile
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // If error is not "Row not found", show toast
      if (error.code !== 'PGRST116') {
         // toast.error('Could not load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      let photoUrl = donor?.photo_url || null;

      // Upload new photo if selected
      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        if (file.size > 400 * 1024) {
          toast.error('Image size must be less than 400KB');
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

      const baseUpdates = {
        name: data.name,
        phone: data.phone,
        blood_group: data.blood_group,
        area: data.area,
        last_donation_date: data.last_donation_date || null,
        photo_url: photoUrl,
      };

      let error;
      if (donor) {
        // Update existing - DO NOT include user_id
        const { error: updateError } = await supabase
          .from('donors')
          .update(baseUpdates)
          .eq('id', donor.id);
        error = updateError;
      } else {
        // Create new - INCLUDE user_id
        const { error: insertError } = await supabase
          .from('donors')
          .insert([{ ...baseUpdates, user_id: user.id }]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(donor ? 'Profile updated successfully!' : 'Profile created successfully!');
      await fetchDonorProfile(user.id);
      setIsEditing(false); // Switch back to view mode
    } catch (error: any) {
      console.error('Error updating profile:', error);
      // Handle specific schema cache errors by reloading
      if (error.message?.includes('schema cache')) {
        toast.error('System updated. Please refresh the page and try again.');
        window.location.reload();
        return;
      }
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading profile...</div>;

  const isAdmin = user?.email === 'mdjahedtech@gmail.com' || user?.email === '01580824066@sandwip.com';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
        <div className="flex gap-2 w-full md:w-auto">
          {isAdmin && (
            <Button 
              variant="default" 
              className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => navigate('/admin')}
            >
              <Shield className="w-4 h-4 mr-2" /> Admin Panel
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout} size="sm" className="flex-1 md:flex-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <Card className="p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        {!isEditing && donor ? (
          // View Mode
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg mb-4">
                {donor.photo_url ? (
                  <img src={donor.photo_url} alt={donor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{donor.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {donor.area}
              </p>
              <div className="mt-3">
                <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-sm">
                  Blood Group: {donor.blood_group}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-700 pt-8">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {donor.phone}
                </p>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Donation</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" /> 
                  {donor.last_donation_date ? formatDate(donor.last_donation_date) : 'Never'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Next Eligible Date</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" /> 
                  {donor.next_eligible_date ? formatDate(donor.next_eligible_date) : 'Available Now'}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => setIsEditing(true)} className="w-full md:w-auto md:px-8 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" size="lg">
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {donor ? 'Edit Profile Details' : 'Create Your Profile'}
              </h3>
              {donor && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              )}
            </div>

            {/* Profile Photo Preview */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg mb-4">
                {donor?.photo_url ? (
                  <img src={donor.photo_url} alt={donor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>
              <div className="w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-2">Change Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-50 file:text-red-700
                    dark:file:bg-red-900/30 dark:file:text-red-400
                    hover:file:bg-red-100 dark:hover:file:bg-red-900/50"
                  {...register('photo')}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Max 400KB. <a href="https://compressjpeg.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">Compress here</a></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <Input
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message as string}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <Input
                  {...register('phone', { required: 'Phone is required' })}
                  error={errors.phone?.message as string}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Droplet className="w-4 h-4" /> Blood Group
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white"
                  {...register('blood_group', { required: 'Required' })}
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg} className="dark:bg-gray-800">{bg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Area
                </label>
                <Input
                  {...register('area', { required: 'Area is required' })}
                  error={errors.area?.message as string}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Last Donation Date
                </label>
                <Input
                  type="date"
                  {...register('last_donation_date')}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              {donor && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={saving} size="lg" className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                {saving ? 'Saving...' : (donor ? 'Save Changes' : 'Create Profile')}
                <Save className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
