
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useLocation } from '@/contexts/LocationContext';
import { getDonationCenters } from '@/api/locationService';
import { useToast } from '@/components/ui/use-toast';
import { DonationCenter } from '@/types/centers';
import CentersList from '@/components/centers/CentersList';
import CentersMap from '@/components/centers/CentersMap';
import CentersSearchBar from '@/components/centers/CentersSearchBar';
import FirstTimeDonorsInfo from '@/components/centers/FirstTimeDonorsInfo';
import { calculateDistance } from '@/utils/mapUtils';

// Mock data for donation centers
const MOCK_CENTERS: DonationCenter[] = [
  {
    id: 1,
    name: 'City General Hospital Blood Bank',
    address: '123 Health Avenue, Downtown',
    phone: '(555) 123-4567',
    hours: 'Mon-Fri: 8am-6pm, Sat: 9am-2pm',
    appointmentRequired: true,
    distance: 1.2,
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: 2,
    name: 'Red Cross Donation Center',
    address: '456 Community Drive, Westside',
    phone: '(555) 987-6543',
    hours: 'Mon-Sun: 9am-7pm',
    appointmentRequired: false,
    distance: 2.5,
    latitude: 37.7833,
    longitude: -122.4167
  },
  {
    id: 3,
    name: 'LifeSource Blood Services',
    address: '789 Hope Street, Eastside',
    phone: '(555) 456-7890',
    hours: 'Mon-Fri: 7am-8pm, Sat-Sun: 8am-5pm',
    appointmentRequired: true,
    distance: 3.7,
    latitude: 37.7694,
    longitude: -122.4862
  },
  {
    id: 4,
    name: 'Memorial Medical Center',
    address: '321 Healthcare Blvd, Northside',
    phone: '(555) 234-5678',
    hours: 'Mon-Fri: 9am-5pm',
    appointmentRequired: true,
    distance: 4.2,
    latitude: 37.7847,
    longitude: -122.7333
  }
];

const Centers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_CENTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState<'list' | 'map'>('list');
  const { userLocation, getCurrentLocation } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const loadCenters = async () => {
      if (userLocation) {
        try {
          setIsLoading(true);
          const data = await getDonationCenters(userLocation.latitude, userLocation.longitude);
          
          if (data && data.data && data.data.length > 0) {
            setCenters(data.data);
          } else {
            // If no centers returned from API, use the mock data but update distances
            const updatedMockCenters = MOCK_CENTERS.map(center => {
              if (center.latitude && center.longitude && userLocation) {
                // Calculate distance using mapUtils
                const distance = calculateDistance(
                  userLocation.latitude, 
                  userLocation.longitude, 
                  center.latitude, 
                  center.longitude
                );
                return {...center, distance};
              }
              return center;
            });
            
            setCenters(updatedMockCenters);
          }
        } catch (error) {
          console.error('Error loading donation centers:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadCenters();
  }, [userLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setCenters(MOCK_CENTERS); // Reset to all centers
      return;
    }
    
    const filtered = centers.filter(center => 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setCenters(filtered);
  };

  const handleGetLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      toast({
        title: "Location Updated",
        description: "Finding donation centers near your location.",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blood Donation Centers</h1>
          <p className="text-muted-foreground text-lg">
            Find blood donation centers near you and schedule your next donation.
          </p>
        </div>
        
        <CentersSearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          handleGetLocation={handleGetLocation}
          viewType={viewType}
          setViewType={setViewType}
        />
        
        {viewType === 'map' ? (
          <CentersMap centers={centers} />
        ) : (
          <CentersList centers={centers} />
        )}
        
        <FirstTimeDonorsInfo />
      </div>
    </Layout>
  );
};

export default Centers;
