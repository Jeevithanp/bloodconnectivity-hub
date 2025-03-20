
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MapComponent from '@/components/maps/MapComponent';
import { DonationCenter } from '@/types/centers';
import { useToast } from '@/components/ui/use-toast';

interface CentersMapProps {
  centers: DonationCenter[];
}

const CentersMap = ({ centers }: CentersMapProps) => {
  const { toast } = useToast();

  return (
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
  );
};

export default CentersMap;
