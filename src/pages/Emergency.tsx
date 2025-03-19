
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, MapPin, Clock, CheckCircle2, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useLocation } from '@/contexts/LocationContext';
import { sendEmergencyRequest } from '@/api/locationService';
import MapComponent from '@/components/maps/MapComponent';

const Emergency = () => {
  const [bloodType, setBloodType] = useState('');
  const [hospital, setHospital] = useState('');
  const [urgency, setUrgency] = useState('high');
  const [units, setUnits] = useState('1');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notifiedDonors, setNotifiedDonors] = useState(0);
  const [respondingDonors, setRespondingDonors] = useState(0);
  const { toast } = useToast();
  const { userLocation, getCurrentLocation } = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodType || !hospital) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!userLocation) {
      const location = await getCurrentLocation();
      if (!location) {
        toast({
          title: "Location Required",
          description: "We need your location to find nearby donors. Please enable location services.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Create a real emergency request
      const response = await sendEmergencyRequest({
        bloodType,
        hospital,
        urgency,
        units: parseInt(units),
        details,
        latitude: userLocation!.latitude,
        longitude: userLocation!.longitude
      });
      
      // Simulate the request process with progress updates for demo purposes
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 20;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsSubmitting(false);
              setIsSubmitted(true);
              
              setNotifiedDonors(response?.data?.notifiedDonors || 7);
              setRespondingDonors(response?.data?.respondingDonors || 3);
              
              toast({
                title: "Emergency request created!",
                description: "Nearby donors have been notified. Check status for updates.",
              });
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 800);
    } catch (error) {
      console.error('Error creating emergency request:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your emergency request.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

  const resetForm = () => {
    setBloodType('');
    setHospital('');
    setUrgency('high');
    setUnits('1');
    setDetails('');
    setIsSubmitted(false);
    setProgress(0);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h1 className="text-4xl font-bold">Emergency Blood Request</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Create an urgent request for blood donations. This will alert all eligible donors in your area.
          </p>
        </div>
        
        {!isSubmitted ? (
          <Card>
            <CardContent className="p-6">
              {isSubmitting ? (
                <div className="py-10 text-center">
                  <h2 className="text-xl font-semibold mb-4">Processing Your Emergency Request</h2>
                  <Progress value={progress} className="mb-4" />
                  <p className="text-muted-foreground mb-6">
                    Identifying compatible donors in your area...
                  </p>
                  
                  {userLocation && (
                    <div className="mb-6 h-48">
                      <MapComponent 
                        markers={[
                          {
                            id: "user-location",
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                            title: "Your Location",
                            type: "emergency"
                          }
                        ]}
                        initialCenter={[userLocation.longitude, userLocation.latitude]}
                        initialZoom={13}
                        interactive={false}
                        height="100%"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{Math.floor(progress / 20)}</div>
                      <div className="text-sm text-muted-foreground">Donors Notified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{Math.floor(progress / 25)}</div>
                      <div className="text-sm text-muted-foreground">Potential Matches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{progress < 50 ? '~15 min' : '~8 min'}</div>
                      <div className="text-sm text-muted-foreground">Est. Response Time</div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Blood Type Required*</label>
                      <Select value={bloodType} onValueChange={setBloodType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
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
                      <label className="text-sm font-medium">Hospital/Medical Center*</label>
                      <Select value={hospital} onValueChange={setHospital} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="city-general">City General Hospital</SelectItem>
                          <SelectItem value="mercy-medical">Mercy Medical Center</SelectItem>
                          <SelectItem value="st-andrews">St. Andrews Hospital</SelectItem>
                          <SelectItem value="metro-health">Metro Health Center</SelectItem>
                          <SelectItem value="other">Other (specify in details)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Urgency Level</label>
                      <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical - Immediate (1 hour)</SelectItem>
                          <SelectItem value="high">High - Urgent (2-3 hours)</SelectItem>
                          <SelectItem value="medium">Medium - Same day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Units Required</label>
                      <Input 
                        type="number" 
                        value={units} 
                        onChange={(e) => setUnits(e.target.value)}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Details</label>
                    <Textarea 
                      value={details} 
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Provide any relevant information about the patient or emergency situation"
                      rows={4}
                    />
                  </div>
                  
                  {userLocation ? (
                    <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Your Current Location</p>
                        <p className="text-sm text-muted-foreground">
                          We'll use this location to find nearby donors
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto"
                        type="button"
                        onClick={handleGetLocation}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        <span>Update</span>
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      type="button"
                      onClick={handleGetLocation}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      <span>Get My Location</span>
                    </Button>
                  )}
                  
                  <div className="pt-4">
                    <Button type="submit" variant="destructive" size="lg" className="w-full">
                      Submit Emergency Request
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      This will notify all eligible donors in a 10km radius
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Emergency Request Submitted</h2>
                <p className="text-muted-foreground mb-4">
                  Your request for {units} units of {bloodType} blood has been sent to nearby donors.
                </p>
                
                {userLocation && (
                  <div className="mb-6 max-w-lg mx-auto h-64">
                    <MapComponent 
                      initialCenter={[userLocation.longitude, userLocation.latitude]}
                      initialZoom={12}
                      markers={[
                        {
                          id: "emergency-location",
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude,
                          title: "Emergency Request Location",
                          type: "emergency"
                        }
                      ]}
                      height="100%"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">10km Radius</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-primary">{notifiedDonors}</div>
                    <div className="text-sm font-medium">Donors Notified</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">~15 min Response</div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  We'll update you as donors respond to your request. You can also check the status 
                  of your request in real-time.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={resetForm}>
                    Create Another Request
                  </Button>
                  <Button>
                    View Request Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-10 bg-muted/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Important Information</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>Emergency requests should only be created for genuine medical emergencies.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>Medical personnel will verify all requests before donors are dispatched.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>For non-emergency donation needs, please use our <a href="/find-donors" className="text-primary underline">regular donor search</a>.</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Emergency;
