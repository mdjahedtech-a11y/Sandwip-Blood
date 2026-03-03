import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Donor, BLOOD_GROUPS } from '@/types';
import { DonorCard } from '@/components/DonorCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

export const Donors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchArea, setSearchArea] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

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

  // Scroll to highlighted donor when donors are loaded
  useEffect(() => {
    if (!loading && highlightId && donors.length > 0) {
      const element = document.getElementById(`donor-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight effect
        element.classList.add('ring-4', 'ring-red-400', 'ring-opacity-50', 'bg-red-50', 'dark:bg-red-900/20');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-red-400', 'ring-opacity-50', 'bg-red-50', 'dark:bg-red-900/20');
        }, 3000);
      }
    }
  }, [loading, highlightId, donors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Find Donors</h1>
          <p className="text-gray-500 dark:text-gray-400">Search for blood donors in your area.</p>
        </div>
        <Button variant="outline" onClick={fetchDonors} disabled={loading} size="sm" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4 transition-colors duration-300">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search by Area (e.g., Harishpur)"
                className="pl-10 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            Search
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4 mr-1" />
            Filter by Group:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBloodGroup('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedBloodGroup === ''
                  ? 'bg-gray-800 text-white dark:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
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
                    ? 'bg-red-600 text-white dark:bg-red-700'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : donors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor, index) => (
            <motion.div
              key={donor.id}
              id={`donor-${donor.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-xl transition-all duration-300"
            >
              <DonorCard donor={donor} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No donors found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};
