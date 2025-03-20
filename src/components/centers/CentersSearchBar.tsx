
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target } from 'lucide-react';

interface CentersSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleGetLocation: () => void;
  viewType: 'list' | 'map';
  setViewType: (value: 'list' | 'map') => void;
}

const CentersSearchBar = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleGetLocation,
  viewType,
  setViewType
}: CentersSearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
        <Input 
          placeholder="Search by center name or location" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Button type="submit">Search</Button>
      </form>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={handleGetLocation}>
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Find Nearby Centers</span>
          <span className="inline sm:hidden">Nearby</span>
        </Button>
        
        <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'list' | 'map')}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default CentersSearchBar;
