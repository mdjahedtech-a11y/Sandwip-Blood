import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Users, Heart, Activity, Search } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-red-100 rounded-full opacity-50 blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Donate Blood, <span className="text-red-600">Save Life</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Your donation can be the reason for someone's heartbeat. Join the Sandwip Blood Donor community today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-red-200 shadow-lg">
                Register as Donor
              </Button>
            </Link>
            <Link to="/donors">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Find Donors
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Donors</p>
            <h3 className="text-2xl font-bold text-gray-900">1,200+</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Lives Saved</p>
            <h3 className="text-2xl font-bold text-gray-900">3,500+</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Requests Fulfilled</p>
            <h3 className="text-2xl font-bold text-gray-900">98%</h3>
          </div>
        </Card>
      </div>

      {/* Emergency CTA */}
      <section className="bg-red-600 rounded-2xl p-8 text-white shadow-xl shadow-red-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Need Blood Urgently?</h2>
          <p className="text-red-100">Post an emergency request and notify nearby donors instantly.</p>
        </div>
        <Link to="/requests">
          <Button variant="secondary" size="lg" className="whitespace-nowrap">
            Post Request
          </Button>
        </Link>
      </section>
    </div>
  );
};
