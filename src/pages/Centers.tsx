
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, Phone, ExternalLink } from 'lucide-react';

// Mock data for donation centers
const MOCK_CENTERS = [
  {
    id: 1,
    name: 'City General Hospital Blood Bank',
    address: '123 Health Avenue, Downtown',
    phone: '(555) 123-4567',
    hours: 'Mon-Fri: 8am-6pm, Sat: 9am-2pm',
    appointmentRequired: true,
    distance: 1.2
  },
  {
    id: 2,
    name: 'Red Cross Donation Center',
    address: '456 Community Drive, Westside',
    phone: '(555) 987-6543',
    hours: 'Mon-Sun: 9am-7pm',
    appointmentRequired: false,
    distance: 2.5
  },
  {
    id: 3,
    name: 'LifeSource Blood Services',
    address: '789 Hope Street, Eastside',
    phone: '(555) 456-7890',
    hours: 'Mon-Fri: 7am-8pm, Sat-Sun: 8am-5pm',
    appointmentRequired: true,
    distance: 3.7
  },
  {
    id: 4,
    name: 'Memorial Medical Center',
    address: '321 Healthcare Blvd, Northside',
    phone: '(555) 234-5678',
    hours: 'Mon-Fri: 9am-5pm',
    appointmentRequired: true,
    distance: 4.2
  }
];

const Centers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [centers, setCenters] = useState(MOCK_CENTERS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = MOCK_CENTERS.filter(center => 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCenters(filtered);
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
        
        <div className="mb-10">
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
            <Input 
              placeholder="Search by center name or location" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <p className="text-sm">{center.distance} km away</p>
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
        
        <div className="mt-16 bg-muted/30 p-8 rounded-lg">
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
