
import React from 'react';
import CenterCard from './CenterCard';
import { DonationCenter } from '@/types/centers';

interface CentersListProps {
  centers: DonationCenter[];
}

const CentersList = ({ centers }: CentersListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {centers.map(center => (
        <CenterCard key={center.id} center={center} />
      ))}
    </div>
  );
};

export default CentersList;
