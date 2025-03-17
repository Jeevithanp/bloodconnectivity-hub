
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a fake blood type
export function generateBloodType() {
  const types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  return types[Math.floor(Math.random() * types.length)];
}

// Calculate distance between two coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Format date to a human-readable format
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Check if donor is eligible (last donation must be more than 56 days ago)
export function isDonorEligible(lastDonationDate: Date | null): boolean {
  if (!lastDonationDate) return true;
  
  const today = new Date();
  const timeDiff = today.getTime() - lastDonationDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  return daysDiff >= 56; // Most people can donate whole blood every 56 days
}
