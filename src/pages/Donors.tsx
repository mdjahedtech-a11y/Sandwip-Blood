import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Donor, BLOOD_GROUPS } from '@/types';
import { DonorCard } from '@/components/DonorCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export const Donors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchArea, setSearchArea] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');

  const fetchDonors = async () => {
    setLoading(true);
    try {
      let query = supabase.from('donors').select('*').order('created_at', { ascending: false });

      if (selectedBloodGroup) {
        query = query.eq('blood_group', selectedBloodGroup);
      }

      if (searchArea) {
        query = query.ilike('area', `%${searchArea}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to load donors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup]); // Re-fetch when blood group changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Donors</h1>
          <p className="text-gray-500">Search for blood donors in your area.</p>
        </div>
        <Button variant="outline" onClick={fetchDonors} disabled={loading} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by Area (e.g., Harishpur)"
                className="pl-10"
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <span className="flex items-center text-sm font-medium text-gray-700 mr-2">
            <Filter className="w-4 h-4 mr-1" />
            Filter:
          </span>
          <button
            onClick={() => setSelectedBloodGroup('')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedBloodGroup === ''
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedBloodGroup === bg
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : donors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor, index) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <DonorCard donor={donor} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No donors found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};
