
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, User, Lock, Mail, Phone, UserPlus, HeartPulse, Shield, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const SignIn = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('signin');
  
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Sign in successful",
      description: "Welcome back to BloodConnect!",
    });
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration successful",
      description: "Your account has been created. Welcome to BloodConnect!",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <div className="inline-flex rounded-lg bg-primary/10 p-4 mb-6">
            <Droplet className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to BloodConnect</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join our community of donors and recipients to help save lives through blood donation.
          </p>
        </div>
        
        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="signin" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your BloodConnect account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Password</label>
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm font-medium leading-none">
                      Remember me
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full">Sign In</Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setActiveTab("register")}
                    className="text-primary hover:underline"
                  >
                    Register
                  </button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Join our community to help save lives through blood donation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Account Type</label>
                    <Select defaultValue="donor" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">Blood Donor</SelectItem>
                        <SelectItem value="recipient">Blood Recipient</SelectItem>
                        <SelectItem value="hospital">Medical Institution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input type="text" placeholder="Enter your first name" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input type="text" placeholder="Enter your last name" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blood Type</label>
                    <Select required>
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
                        <SelectItem value="unknown">I don't know</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Create a password" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setActiveTab("signin")}
                    className="text-primary hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartPulse className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Donor Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  Track your donations, receive reminders, and view your health metrics.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Secure Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Your personal and medical information is kept safe and private.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Location Services</h3>
                <p className="text-sm text-muted-foreground">
                  Find nearby donors or donation centers using GPS technology.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
