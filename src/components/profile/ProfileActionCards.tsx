
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Map, Calendar, MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProfileActionCardsProps {
  isDonor: boolean;
  isUpdatingLocation: boolean;
  handleUpdateLocation: () => Promise<void>;
  onDonateNowClick: () => void;
}

const ProfileActionCards = ({ 
  isDonor, 
  isUpdatingLocation, 
  handleUpdateLocation,
  onDonateNowClick
}: ProfileActionCardsProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover-lift">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Donation History</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View your donation history and upcoming appointments
            </p>
            <Button variant="outline" className="w-full" disabled={!isDonor}>
              View Donation History
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-lift">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Donate Now</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Register for a blood donation at your preferred hospital
            </p>
            <Button 
              variant="default" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onDonateNowClick}
              disabled={!isDonor}
            >
              Donate Now
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-lift">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Location Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Update your location to help nearby recipients find you quickly
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={handleUpdateLocation}
                    disabled={isUpdatingLocation}
                  >
                    {isUpdatingLocation ? 'Updating...' : 'Update Location'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to share your current location for emergency donors</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileActionCards;
