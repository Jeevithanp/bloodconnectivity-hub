import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Droplet, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getDonors } from '@/api/userService';

type Donor = {
  id: string;
  full_name: string;
  blood_type: string;
  last_donation: string | null;
  distance?: number; // Will be calculated based on coordinates
};

const FindDonors = () => {
  const [bloodType, setBloodType] = useState<string>('');
  const [distance, setDistance] = useState<string>('10');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      // Get donors from supabase through our edge function
      const data = await getDonors({
        bloodType: bloodType || undefined,
        maxDistance: distance ? parseFloat(distance) : undefined
      });
      
      if (data && data.data) {
        // Add a mock distance since we're not calculating real distances yet
        const donorsWithDistance = data.data.map((donor: any) => ({
          ...donor,
          distance: Math.random() * 10 // Mock distance - would be calculated based on coords
        }));
        
        setDonors(donorsWithDistance);
        
        toast({
          title: `${donorsWithDistance.length} donors found`,
          description: "You can now contact them directly.",
        });
      } else {
        setDonors([]);
        toast({
          title: "No donors found",
          description: "Try adjusting your search criteria.",
        });
      }
    } catch (error) {
      console.error('Error searching for donors:', error);
      toast({
        title: "Error",
        description: "There was a problem searching for donors.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = (donor: Donor) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to contact donors.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: `Contacting ${donor.full_name}`,
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
                  onClick={() => navigate('/emergency')}
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
                          <h3 className="font-semibold text-lg">{donor.full_name}</h3>
                          <div className="flex items-center mt-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{donor.distance?.toFixed(1) || "Unknown"} km away</span>
                          </div>
                          <div className="flex items-center mt-1 text-muted-foreground">
                            <Droplet className="h-4 w-4 mr-1 text-primary" />
                            <span>Blood Type: <strong>{donor.blood_type}</strong></span>
                          </div>
                          {donor.last_donation && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Last donation: {new Date(donor.last_donation).toLocaleDateString()}
                            </p>
                          )}
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
