
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, MessageSquare, Phone } from 'lucide-react';

interface DonorListProps {
  donors: any[];
  isLoading: boolean;
  userLocation: { latitude: number; longitude: number } | null;
  handleContact: (donor: any, type: 'sms' | 'call') => void;
  handleTrackDonor: (donor: any) => void;
  handleGetLocation: () => void;
}

const DonorList = ({
  donors,
  isLoading,
  userLocation,
  handleContact,
  handleTrackDonor,
  handleGetLocation
}: DonorListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Searching for donors...</span>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <p className="mb-2 text-muted-foreground">No donors found</p>
        <p className="mb-4">Try adjusting your search criteria or increasing the distance.</p>
        {!userLocation && (
          <Button onClick={handleGetLocation}>Enable Location</Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {donors.map((donor, index) => (
        <Card key={donor.id || index} className="hover-lift">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-lg">{donor.full_name}</h3>
                <p className="text-sm text-muted-foreground">Blood Type: {donor.blood_type}</p>
              </div>
              <div className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">
                {donor.distance ? `${donor.distance.toFixed(1)} km` : 'Distance N/A'}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {donor.last_donation && (
                <p className="text-sm">
                  Last Donation: {new Date(donor.last_donation).toLocaleDateString()}
                </p>
              )}
              {donor.address && (
                <p className="text-sm flex items-start gap-1">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{donor.address}</span>
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {donor.phone && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => handleContact(donor, 'sms')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Message</span>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => handleContact(donor, 'call')}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </Button>
                </>
              )}
              
              {donor.latitude && donor.longitude && (
                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={() => handleTrackDonor(donor)}
                >
                  Track Donor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DonorList;
