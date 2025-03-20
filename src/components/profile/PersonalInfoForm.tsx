
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface PersonalInfoFormProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  handleSave: () => Promise<void>;
  isSaving: boolean;
}

const PersonalInfoForm = ({ profile, setProfile, handleSave, isSaving }: PersonalInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>Personal Information</span>
        </CardTitle>
        <CardDescription>
          Manage your personal information and donation preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input 
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Blood Type</label>
          <Select 
            value={profile.blood_type} 
            onValueChange={(value) => setProfile({ ...profile, blood_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your blood type" />
            </SelectTrigger>
            <SelectContent>
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
          <label className="text-sm font-medium">Address</label>
          <Input 
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <Input 
            type="date" 
            value={profile.birth_date}
            onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Donor Status</label>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="is_donor" 
              checked={profile.is_donor} 
              onChange={(e) => setProfile({ ...profile, is_donor: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="is_donor">I am available as a blood donor</label>
          </div>
        </div>
        
        {profile.last_donation && (
          <div className="bg-muted p-4 rounded-md flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Last Donation</p>
              <p className="text-sm text-muted-foreground">
                {new Date(profile.last_donation).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonalInfoForm;
