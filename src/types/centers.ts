
export type DonationCenter = {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  appointmentRequired: boolean;
  distance: number;
  latitude?: number;
  longitude?: number;
};
