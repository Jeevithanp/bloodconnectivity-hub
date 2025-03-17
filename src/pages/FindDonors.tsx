
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Droplet, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data for donors
const MOCK_DONORS = [
  { id: 1, name: 'Emma Wilson', bloodType: 'A+', distance: 1.2, lastDonation: '2023-10-15', phone: '+1234567890' },
  { id: 2, name: 'James Mitchell', bloodType: 'O-', distance: 2.5, lastDonation: '2023-09-20', phone: '+1234567891' },
  { id: 3, name: 'Sophia Chen', bloodType: 'B+', distance: 3.1, lastDonation: '2023-11-05', phone: '+1234567892' },
  { id: 4, name: 'Michael Rodriguez', bloodType: 'AB+', distance: 4.0, lastDonation: '2023-08-30', phone: '+1234567893' },
  { id: 5, name: 'Olivia Taylor', bloodType: 'A-', distance: 5.2, lastDonation: '2023-07-12', phone: '+1234567894' },
  { id: 6, name: 'William Johnson', bloodType: 'O+', distance: 2.8, lastDonation: '2023-10-25', phone: '+1234567895' },
];

type Donor = typeof MOCK_DONORS[0];

const FindDonors = () => {
  const [bloodType, setBloodType] = useState<string>('');
  const [distance, setDistance] = useState<string>('10');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredDonors = MOCK_DONORS.filter(donor => {
        if (bloodType && donor.bloodType !== bloodType) return false;
        if (Number(distance) < donor.distance) return false;
        return true;
      });
      
      setDonors(filteredDonors);
      setIsLoading(false);
      
      toast({
        title: `${filteredDonors.length} donors found`,
        description: "You can now contact them directly.",
      });
    }, 1500);
  };

  const handleContact = (donor: Donor) => {
    toast({
      title: `Contacting ${donor.name}`,
      description: "A notification has been sent to the donor.",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Find Blood Donors</h1>
          <p className="text-muted-foreground text-lg">
            Search for compatible donors in your area based on blood type and distance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Search Filters</CardTitle>
                <CardDescription>Find donors that match your requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Type</label>
                  <Select value={bloodType} onValueChange={setBloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Distance (km)</label>
                  <Input 
                    type="number" 
                    value={distance} 
                    onChange={(e) => setDistance(e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search Donors"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need Emergency Blood?</CardTitle>
                <CardDescription>Create an emergency request to notify all eligible donors</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Emergency Request Feature",
                      description: "This feature will be available soon.",
                      variant: "destructive",
                    });
                  }}
                >
                  Create Emergency Request
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">
              {donors.length > 0 
                ? `${donors.length} Donors Found` 
                : "Search for donors using the filters"}
            </h2>
            
            {donors.length === 0 && !isLoading ? (
              <div className="bg-muted/50 rounded-lg p-12 text-center">
                <Droplet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No donors found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search criteria or create an emergency request.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {donors.map(donor => (
                  <Card key={donor.id} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{donor.name}</h3>
                          <div className="flex items-center mt-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{donor.distance} km away</span>
                          </div>
                          <div className="flex items-center mt-1 text-muted-foreground">
                            <Droplet className="h-4 w-4 mr-1 text-primary" />
                            <span>Blood Type: <strong>{donor.bloodType}</strong></span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Last donation: {new Date(donor.lastDonation).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => handleContact(donor)}>
                            <Phone className="h-4 w-4" />
                            <span>Call</span>
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => handleContact(donor)}>
                            <MessageSquare className="h-4 w-4" />
                            <span>Message</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindDonors;
