
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface SearchFormProps {
  bloodType: string;
  setBloodType: (value: string) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

const SearchForm = ({
  bloodType,
  setBloodType,
  maxDistance,
  setMaxDistance,
  handleSearch,
  isLoading
}: SearchFormProps) => {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Blood Type</label>
            <Select value={bloodType} onValueChange={setBloodType}>
              <SelectTrigger>
                <SelectValue placeholder="All Blood Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
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
          
          <div>
            <label className="text-sm font-medium mb-2 block">Max Distance (km)</label>
            <Input 
              type="number" 
              value={maxDistance} 
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              min="1" 
              max="100"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              className="w-full" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
