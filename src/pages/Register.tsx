import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { BLOOD_GROUPS } from '@/types/index';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Upload, Calendar, User, Phone, MapPin, Droplet, Mail, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

interface RegisterFormInputs {
  name: string;
  password: string;
  blood_group: string;
  phone: string;
  area: string;
  last_donation_date: string;
  photo: FileList;
}

export const Register = () => {
  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<RegisterFormInputs>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkPhoneAvailability = async (phone: string) => {
    if (!phone || phone.length < 11) return;
    
    const { data, error } = await supabase
      .from('donors')
      .select('id')
      .eq('phone', phone)
      .single();

    if (data) {
      setError('phone', {
        type: 'manual',
        message: 'This phone number is already registered.',
      });
    } else {
      clearErrors('phone');
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    try {
      // 1. Sign Up User with Dummy Email
      const dummyEmail = `${data.phone}@sandwip.com`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: data.password,
      });

      if (authError) {
        toast.error(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error('Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      let photoUrl = null;

      // 2. Upload Photo if selected
      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];

        // Check file size (400KB limit)
        if (file.size > 400 * 1024) {
          toast.error('Image size must be less than 400KB');
          setLoading(false);
          return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('donor-photos')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
          toast.error('Failed to upload photo. Continuing without it.');
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('donor-photos')
            .getPublicUrl(filePath);
          photoUrl = publicUrl;
        }
      }

      // 3. Insert Donor Data
      const { error: insertError } = await supabase
        .from('donors')
        .insert([
          {
            user_id: authData.user.id, // Link to Auth User
            name: data.name,
            blood_group: data.blood_group,
            phone: data.phone,
            area: data.area,
            photo_url: photoUrl,
            last_donation_date: data.last_donation_date || null,
          },
        ]);

      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
        if (insertError.code === '23505') { // Unique violation
          toast.error('This phone number is already registered.');
        } else {
          toast.error(`Registration failed: ${insertError.message}`);
          // Optional: Delete the auth user if donor insert fails to keep clean state
        }
      } else {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Become a Donor</h1>
        <p className="text-gray-600 mt-2">Join our community and save lives.</p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <Input
                placeholder="Enter your full name"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <Input
                placeholder="01XXXXXXXXX"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^01[3-9]\d{8}$/,
                    message: 'Invalid Bangladeshi phone number',
                  },
                  onBlur: (e) => checkPhoneAvailability(e.target.value),
                })}
                error={errors.phone?.message}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <Input
                type="password"
                placeholder="Create a password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Must be at least 6 characters' }
                })}
                error={errors.password?.message}
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Droplet className="w-4 h-4" /> Blood Group
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                {...register('blood_group', { required: 'Blood group is required' })}
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              {errors.blood_group && (
                <p className="text-sm text-red-500">{errors.blood_group.message}</p>
              )}
            </div>

            {/* Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Area / Address
              </label>
              <Input
                placeholder="e.g. Harishpur, Sandwip"
                {...register('area', { required: 'Area is required' })}
                error={errors.area?.message}
              />
            </div>

            {/* Last Donation Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Last Donation Date
              </label>
              <Input
                type="date"
                {...register('last_donation_date')}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Leave empty if you haven't donated yet.</p>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Upload className="w-4 h-4" /> Profile Photo
              </label>
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
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-xs text-gray-500">Max size: 400KB.</p>
                <p className="text-xs text-gray-500">
                  Image too large?{' '}
                  <a 
                    href="https://compressjpeg.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Compress it here
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full md:w-auto md:px-8"
              disabled={loading}
              size="lg"
            >
              {loading ? 'Registering...' : 'Register Now'}
              <UserPlus className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-red-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};
