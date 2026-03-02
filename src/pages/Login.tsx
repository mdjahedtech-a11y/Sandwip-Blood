import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LogIn, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Construct dummy email from phone
      const dummyEmail = `${data.phone}@sandwip.com`;

      const { error } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password: data.password,
      });

      if (error) throw error;

      toast.success('Logged in successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Invalid phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Login to manage your donor profile.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Phone Number
            </label>
            <Input
              placeholder="01XXXXXXXXX"
              {...register('phone', { required: 'Phone number is required' })}
              error={errors.phone?.message as string}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message as string}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
            <LogIn className="w-4 h-4 ml-2" />
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 hover:underline font-medium">
              Register as Donor
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
