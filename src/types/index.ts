export interface Donor {
  id: string;
  user_id?: string; // Link to Supabase Auth User
  name: string;
  // email removed as it's not in the DB schema
  blood_group: string;
  phone: string;
  area: string;
  photo_url: string | null;
  last_donation_date: string | null;
  next_eligible_date: string | null;
  created_at: string;
}

export interface EmergencyRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  hospital: string;
  contact_number: string;
  required_date: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
