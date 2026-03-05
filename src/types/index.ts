export interface Notification {
  id: string;
  title: string;
  message: string;
  link?: string;
  type: 'info' | 'warning' | 'success' | 'error';
  created_at: string;
  is_active: boolean;
}

export interface Donor {
  id: string;
  user_id?: string; // Link to Supabase Auth User
  name: string;
  email?: string;
  blood_group: string;
  phone: string;
  area: string;
  photo_url: string | null;
  last_donation_date: string | null;
  next_eligible_date: string | null;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
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
