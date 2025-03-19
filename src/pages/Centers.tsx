
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, Phone, ExternalLink, Target } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { getDonationCenters } from '@/api/locationService';
import MapComponent from '@/components/maps/MapComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

type DonationCenter = {
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
                // Calculate distance using Haversine formula
                const R = 6371; // Earth's radius in km
                const dLat = (center.latitude - userLocation.latitude) * Math.PI / 180;
                const dLon = (center.longitude - userLocation.longitude) * Math.PI / 180;
                const a = 
                  Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(center.latitude * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distance = R * c;
                
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
      setCenters(centers); // Reset to all centers
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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
            <Input 
              placeholder="Search by center name or location" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button type="submit">Search</Button>
          </form>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleGetLocation}>
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Find Nearby Centers</span>
              <span className="inline sm:hidden">Nearby</span>
            </Button>
            
            <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'list' | 'map')}>
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {viewType === 'map' ? (
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="h-[500px] w-full">
                <MapComponent 
                  markers={centers
                    .filter(center => center.latitude && center.longitude)
                    .map(center => ({
                      id: center.id.toString(),
                      latitude: center.latitude!,
                      longitude: center.longitude!,
                      title: center.name,
                      description: center.address,
                      type: 'center'
                    }))}
                  height="100%"
                  onMarkerClick={(marker) => {
                    const center = centers.find(c => c.id.toString() === marker.id);
                    if (center) {
                      toast({
                        title: center.name,
                        description: center.address,
                      });
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {centers.map(center => (
              <Card key={center.id} className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span>{center.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                    <div>
                      <p>{center.address}</p>
                      <p className="text-sm">{center.distance.toFixed(1)} km away</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0 mt-1" />
                    <p>{center.hours}</p>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0 mt-1" />
                    <p>{center.phone}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${center.appointmentRequired ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                      {center.appointmentRequired ? 'Appointment Required' : 'Walk-ins Welcome'}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="outline" className="flex-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </Button>
                  <Button className="flex-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-8 bg-muted/30 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Information for First-Time Donors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Eligibility Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Be at least 17 years old (16 with parental consent in some states)</li>
                <li>• Weigh at least 110 pounds</li>
                <li>• Be in good general health</li>
                <li>• Have not donated in the last 56 days</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">What to Bring</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Valid ID (driver's license, passport, etc.)</li>
                <li>• List of medications you're taking</li>
                <li>• Information about recent travel outside the U.S.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Learn More About Donation</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Centers;
