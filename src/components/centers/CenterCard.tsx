
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Phone, Calendar } from 'lucide-react';
import { DonationCenter } from '@/types/centers';

interface CenterCardProps {
  center: DonationCenter;
}

const CenterCard = ({ center }: CenterCardProps) => {
  return (
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
  );
};

export default CenterCard;
