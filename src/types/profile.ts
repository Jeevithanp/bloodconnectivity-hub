
export interface ProfileData {
  full_name: string;
  blood_type: string;
  address: string;
  phone?: string; // Phone field for Twilio integration
  birth_date: string;
  is_donor: boolean;
  last_donation: string | null;
  latitude: number | null;
  longitude: number | null;
  email?: string; // Add email for notifications
}

export interface DonationFormData {
  hospitalName: string;
  donationDate: string;
  donationTime: string;
  additionalNotes?: string;
}

// New interface for emergency request notifications
export interface EmergencyNotification {
  recipientId: string;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  bloodType: string;
  hospitalName: string;
  urgency: string;
  message: string;
}
