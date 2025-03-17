
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Droplet, 
  Heart, 
  Activity, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Bell, 
  MessageSquare, 
  Users, 
  Database 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnMore = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Learn More About <span className="text-primary">BloodConnect</span></h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Our innovative platform connects blood donors with recipients in real-time, 
            streamlining the donation process and helping save lives during emergencies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                BloodConnect aims to revolutionize blood donation by leveraging technology to create 
                a seamless connection between donors and recipients. Our platform addresses critical 
                inefficiencies in traditional blood donation methods, ensuring that the right blood 
                reaches the right patient at the right time.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-4">The Problem</h2>
              <p className="text-muted-foreground mb-4">
                Traditional blood donation systems face several challenges:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  <span>Slow response times during emergencies when minutes count</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Database className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  <span>Outdated databases with incomplete donor information</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  <span>Manual processes for contacting potential donors</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  <span>Lack of location-based donor identification and tracking</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Solution</h2>
              <p className="text-muted-foreground mb-4">
                BloodConnect leverages modern technology to create an efficient platform that addresses these challenges:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span>Real-time GPS tracking to identify nearby eligible donors</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span>Instant notifications for emergency blood requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span>Automated donor filtering based on blood type, location, and eligibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span>Secure in-app communication between donors, recipients, and medical staff</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Database className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span>Centralized database with comprehensive donor records and health information</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Why BloodConnect Matters</CardTitle>
                  <CardDescription>The impact of our platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Response Time</h3>
                        <p className="text-sm text-muted-foreground">Reduced from hours to minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Survival Rates</h3>
                        <p className="text-sm text-muted-foreground">Improved outcomes in trauma cases</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Donor Engagement</h3>
                        <p className="text-sm text-muted-foreground">40% increase in regular donations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Lives Saved</h3>
                        <p className="text-sm text-muted-foreground">Thousands of critical patients helped</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full">
                    <Link to="/signin" className="flex items-center justify-center gap-2 w-full">
                      <span>Join BloodConnect Today</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-6">
                <iframe 
                  className="w-full aspect-video rounded-lg shadow-md"
                  src="about:blank"
                  title="BloodConnect: How It Works"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">How BloodConnect Works</h2>
          
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-muted z-0 hidden md:block"></div>
            
            <div className="space-y-12 relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                  <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                  <p className="text-muted-foreground">
                    Register as a donor or recipient with your blood type, medical information, and location preferences.
                    Set up notification preferences and availability settings.
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-4 border-background z-20 order-1 md:order-2">
                  <span className="font-bold">1</span>
                </div>
                <div className="md:w-1/2 order-3"></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="md:w-1/2 order-2"></div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-4 border-background z-20 order-1">
                  <span className="font-bold">2</span>
                </div>
                <div className="md:w-1/2 order-3">
                  <h3 className="text-xl font-semibold mb-2">Enable Location Services</h3>
                  <p className="text-muted-foreground">
                    Allow the app to track your location so that you can be notified about nearby donation 
                    opportunities or find donors in your vicinity during emergencies.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                  <h3 className="text-xl font-semibold mb-2">Receive or Create Requests</h3>
                  <p className="text-muted-foreground">
                    As a donor, receive notifications when your blood type is needed nearby.
                    As a recipient or medical institution, create emergency requests with specific requirements.
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-4 border-background z-20 order-1 md:order-2">
                  <span className="font-bold">3</span>
                </div>
                <div className="md:w-1/2 order-3"></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="md:w-1/2 order-2"></div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-4 border-background z-20 order-1">
                  <span className="font-bold">4</span>
                </div>
                <div className="md:w-1/2 order-3">
                  <h3 className="text-xl font-semibold mb-2">Connect and Communicate</h3>
                  <p className="text-muted-foreground">
                    Use in-app messaging and calling to coordinate with donors, recipients, or medical staff.
                    Get directions to donation centers or hospitals as needed.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="md:w-1/2 md:text-right order-2 md:order-1">
                  <h3 className="text-xl font-semibold mb-2">Complete the Donation</h3>
                  <p className="text-muted-foreground">
                    Follow the guided process to complete your donation safely at a certified center.
                    Receive post-donation care instructions and track your recovery period.
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-4 border-background z-20 order-1 md:order-2">
                  <span className="font-bold">5</span>
                </div>
                <div className="md:w-1/2 order-3"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Technology Behind BloodConnect</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built using Java for Android and Swift for iOS, ensuring optimal performance 
                  across all devices with responsive design principles.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  MySQL provides a secure and scalable solution for storing donor information, 
                  blood bank inventory, and donation records with enterprise-grade security.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Location Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Google Maps API enables precise GPS tracking and efficient route planning 
                  for donors traveling to donation centers with real-time traffic data.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Real-time Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Firebase Cloud Messaging delivers instant push notifications to alert donors 
                  about emergency blood requests and eligibility updates with high reliability.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Secure Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  End-to-end encryption protocols safeguard all communications and personal 
                  health information within the platform, complying with HIPAA standards.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Artificial Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Machine learning algorithms optimize donor matching based on proximity, 
                  eligibility, and response history, improving with each successful donation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-muted/30 p-8 rounded-lg mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Droplet className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground mb-8">
              Join our community of donors and recipients today. Whether you're looking to donate 
              blood or need to find donors for emergency situations, BloodConnect is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/signin">Create an Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/resources">Learn About Donation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnMore;
