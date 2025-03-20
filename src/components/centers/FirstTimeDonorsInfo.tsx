
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const FirstTimeDonorsInfo = () => {
  return (
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
  );
};

export default FirstTimeDonorsInfo;
