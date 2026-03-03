import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Donor, EmergencyRequest, Notification } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trash2, CheckCircle, LogOut, Shield, Eye, Bell, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Notification Form State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifLink, setNotifLink] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'warning' | 'success' | 'error'>('info');
  const [sendingNotif, setSendingNotif] = useState(false);

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
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      setDonors(donorsData || []);
      setRequests(requestsData || []);
      setNotifications(notificationsData || []);
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

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingNotif(true);

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            title: notifTitle,
            message: notifMessage,
            link: notifLink || null,
            type: notifType,
            is_active: true
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        setNotifications([data[0], ...notifications]);
        setNotifTitle('');
        setNotifMessage('');
        setNotifLink('');
        setNotifType('info');
        toast.success('Notification sent successfully');
      }
    } catch (error: any) {
      console.error('Error creating notification:', error);
      toast.error(error.message || 'Failed to send notification');
    } finally {
      setSendingNotif(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) throw error;
      setNotifications(notifications.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Login</h2>
            <p className="text-gray-500 dark:text-gray-400">Secure access for administrators only.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Email or Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <Button type="submit" className="w-full dark:bg-red-700 dark:hover:bg-red-600 dark:text-white" disabled={loading}>
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
        <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <Button onClick={handleLogout} variant="outline" className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300">Total Donors</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{donors.length}</p>
        </Card>
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
          <h3 className="text-lg font-medium text-red-900 dark:text-red-300">Active Requests</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {requests.filter((r) => r.status === 'pending').length}
          </p>
        </Card>
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
          <h3 className="text-lg font-medium text-green-900 dark:text-green-300">Completed Requests</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {requests.filter((r) => r.status === 'completed').length}
          </p>
        </Card>
      </div>

      {/* Notification Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Manage Notifications
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Notification */}
          <Card className="p-6 lg:col-span-1 h-fit dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Send New Notification</h3>
            <form onSubmit={handleCreateNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <Input
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="Notification Title"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Notification Message"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link (Optional)</label>
                <Input
                  value={notifLink}
                  onChange={(e) => setNotifLink(e.target.value)}
                  placeholder="https://example.com"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as any)}
                >
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning (Yellow)</option>
                  <option value="success">Success (Green)</option>
                  <option value="error">Error (Red)</option>
                </select>
              </div>
              <Button type="submit" className="w-full gap-2 dark:bg-red-700 dark:hover:bg-red-600 dark:text-white" disabled={sendingNotif}>
                <Send className="w-4 h-4" />
                {sendingNotif ? 'Sending...' : 'Send Notification'}
              </Button>
            </form>
          </Card>

          {/* List Notifications */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Active Notifications</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={notif.type === 'error' ? 'danger' : notif.type === 'success' ? 'success' : notif.type === 'warning' ? 'warning' : 'neutral'}>
                            {notif.type.toUpperCase()}
                          </Badge>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{notif.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
                        {notif.link && (
                          <a href={notif.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block truncate max-w-xs">
                            {notif.link}
                          </a>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donors Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Manage Donors</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{donor.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{donor.blood_group}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{donor.phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Link
                        to={`/donors?highlight=${donor.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                        title="View Public Profile"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteDonor(donor.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2"
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Manage Requests</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{req.patient_name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{req.blood_group}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant={req.status === 'completed' ? 'success' : 'warning'}>
                        {req.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex gap-2">
                      {req.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteRequest(req.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-2"
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
