import { Donor } from '@/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Phone, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DonorCardProps {
  donor: Donor;
}

export const DonorCard = ({ donor }: DonorCardProps) => {
  const isEligible = new Date(donor.next_eligible_date || '') <= new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {donor.photo_url ? (
              <img
                src={donor.photo_url}
                alt={donor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-red-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl border-2 border-red-50">
                {donor.name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              {isEligible ? (
                <CheckCircle className="w-5 h-5 text-green-500 fill-white" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 fill-white" />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{donor.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              {donor.area}
            </div>
            <Badge variant={isEligible ? 'success' : 'danger'}>
              {isEligible ? 'Eligible' : 'Not Eligible'}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg">
            {donor.blood_group}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">Last Donation</span>
          <span className="font-medium text-gray-700 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(donor.last_donation_date)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">Next Eligible</span>
          <span className="font-medium text-gray-700 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(donor.next_eligible_date)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <a href={`tel:${donor.phone}`} className="w-full block">
          <Button className="w-full gap-2" size="sm">
            <Phone className="w-4 h-4" />
            Call Now
          </Button>
        </a>
      </div>
    </Card>
  );
};
