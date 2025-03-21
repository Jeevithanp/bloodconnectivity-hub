
export interface ProfileData {
  full_name: string;
  blood_type: string;
  address: string;
  phone?: string; // Added phone field
  birth_date: string;
  is_donor: boolean;
  last_donation: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface DonationFormData {
  hospitalName: string;
  donationDate: string;
  donationTime: string;
  additionalNotes?: string;
}
