import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Donor, EmergencyRequest } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trash2, CheckCircle, LogOut, Shield, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: donorsData } = await supabase.from('donors').select('*');
      const { data: requestsData } = await supabase.from('emergency_requests').select('*');
      setDonors(donorsData || []);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const input = phone.trim();
    const isEmail = input.includes('@');
    const email = isEmail ? input : `${input}@sandwip.com`;
    
    // Check if it's the specific admin phone number
    const ADMIN_PHONE = '01580824066';
    const ADMIN_PASS = '309106';

    // Special handling for the main admin account via phone number
    if (!isEmail && input === ADMIN_PHONE && password === ADMIN_PASS) {
      // Try login first
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        if (loginError.message === 'Invalid login credentials') {
          // If login fails, try to create the admin account automatically
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: 'Admin',
              }
            }
          });

          if (signUpError) {
            console.error('Admin auto-signup error:', signUpError);
            toast.error(signUpError.message);
          } else {
            toast.success('Admin account initialized and logged in');
          }
        } else {
          toast.error(loginError.message);
        }
      } else {
        toast.success('Logged in successfully');
      }
    } else {
      // Standard login for email or other phone numbers
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          toast.error('Invalid credentials. Please check your input.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Logged in successfully');
      }
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
  };

  const handleDeleteDonor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this donor?')) return;
    try {
      const { error } = await supabase.from('donors').delete().eq('id', id);
      if (error) throw error;
      setDonors(donors.filter((d) => d.id !== id));
      toast.success('Donor deleted');
    } catch (error) {
      toast.error('Failed to delete donor');
    }
  };

  const handleCompleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_requests')
        .update({ status: 'completed' })
        .eq('id', id);
      if (error) throw error;
      setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'completed' } : r)));
      toast.success('Request marked as completed');
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500">Secure access for administrators only.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Email or Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Check if the logged-in user is the admin (either by specific email or the phone-based email)
  const isAdmin = session.user.email === 'mdjahedtech@gmail.com' || session.user.email === '01580824066@sandwip.com';

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <Card className="p-8">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-blue-50 border-blue-100">
          <h3 className="text-lg font-medium text-blue-900">Total Donors</h3>
          <p className="text-3xl font-bold text-blue-600">{donors.length}</p>
        </Card>
        <Card className="p-6 bg-red-50 border-red-100">
          <h3 className="text-lg font-medium text-red-900">Active Requests</h3>
          <p className="text-3xl font-bold text-red-600">
            {requests.filter((r) => r.status === 'pending').length}
          </p>
        </Card>
        <Card className="p-6 bg-green-50 border-green-100">
          <h3 className="text-lg font-medium text-green-900">Completed Requests</h3>
          <p className="text-3xl font-bold text-green-600">
            {requests.filter((r) => r.status === 'completed').length}
          </p>
        </Card>
      </div>

      {/* Donors Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Manage Donors</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donor.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{donor.blood_group}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{donor.phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                      <Link
                        to={`/donors?highlight=${donor.id}`}
                        className="text-blue-600 hover:text-blue-900 p-2"
                        title="View Public Profile"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteDonor(donor.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                        title="Delete Donor"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Requests Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Manage Requests</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.patient_name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{req.blood_group}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={req.status === 'completed' ? 'success' : 'warning'}>
                        {req.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                      {req.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteRequest(req.id)}
                          className="text-green-600 hover:text-green-900 p-2"
                          title="Mark as Completed"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
