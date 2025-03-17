
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Video, 
  HelpCircle, 
  ChevronRight, 
  Download, 
  Heart, 
  AlertTriangle 
} from 'lucide-react';

const Resources = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Resources & Education</h1>
          <p className="text-muted-foreground text-lg">
            Learn about blood donation, eligibility requirements, and the impact of your contribution.
          </p>
        </div>
        
        <Tabs defaultValue="articles" className="mb-16">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Downloads</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>The Importance of Blood Donation</CardTitle>
                  <CardDescription>Learn why regular blood donation is critical for healthcare</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every two seconds, someone in the United States needs blood. A single donation can save up to three lives.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/article">
                    <Button variant="outline" className="w-full flex items-center justify-between">
                      <span>Read Article</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Understanding Blood Types</CardTitle>
                  <CardDescription>Learn about different blood types and compatibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    There are eight main blood types, and understanding compatibility is crucial for transfusions.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <span>Read Article</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Donation Process Explained</CardTitle>
                  <CardDescription>A step-by-step guide to what happens during donation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From registration to recovery, learn what to expect during your blood donation experience.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <span>Read Article</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Smart Blood Donation Systems</CardTitle>
                  <CardDescription>How technology is revolutionizing blood donation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Modern technology is changing how we connect donors with recipients in emergency situations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/article">
                    <Button variant="outline" className="w-full flex items-center justify-between">
                      <span>Read Article</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Post-Donation Care</CardTitle>
                  <CardDescription>Tips for recovery after giving blood</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Proper care after donation ensures your well-being and helps prepare for future donations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <span>Read Article</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Blood Donation Myths</CardTitle>
                  <CardDescription>Debunking common misconceptions about donation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Many myths prevent people from donating. Learn the truth about blood donation.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <span>Read Article</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>What Happens During Blood Donation?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>The Journey of Donated Blood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How Blood Typing Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Donor Stories: Why I Donate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Watch Video</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How often can I donate blood?</h3>
                  <p className="text-muted-foreground">
                    Most healthy donors can give whole blood every 56 days (8 weeks). Double red cell donations can be made every 112 days. Platelet donations can be made every 7 days, up to 24 times per year.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">What are the requirements to donate blood?</h3>
                  <p className="text-muted-foreground">
                    In general, donors must be at least 17 years old (16 with parental consent in some states), weigh at least 110 pounds, and be in good general health. Specific eligibility criteria may vary by donation center.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">How long does the donation process take?</h3>
                  <p className="text-muted-foreground">
                    The entire process takes about an hour, with the actual blood donation taking only about 8-10 minutes. The rest of the time includes registration, a brief health history, mini-physical, and refreshments afterward.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Does blood donation hurt?</h3>
                  <p className="text-muted-foreground">
                    Most donors report feeling only a brief pinch when the needle is inserted. The actual donation is typically painless. Our staff is trained to make your experience as comfortable as possible.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">What happens to my blood after donation?</h3>
                  <p className="text-muted-foreground">
                    After collection, your blood is processed, tested for infectious diseases, and separated into components (red cells, platelets, plasma) that can help multiple patients. It's typically transfused to patients within 42 days.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I donate if I'm taking medication?</h3>
                  <p className="text-muted-foreground">
                    Many medications do not prevent you from donating blood. Some medications may require a waiting period after your last dose. During the pre-donation screening, medical staff will evaluate your medications and determine eligibility.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">How should I prepare for blood donation?</h3>
                  <p className="text-muted-foreground">
                    Get a good night's sleep, eat a healthy meal, drink plenty of fluids (avoid alcohol), and wear comfortable clothing with sleeves that can be rolled up. Bring your ID and a list of medications you're taking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="downloads">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Donor Eligibility Guide</CardTitle>
                  <CardDescription>PDF resource on donation requirements</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Blood Type Compatibility Chart</CardTitle>
                  <CardDescription>Visual guide to blood type matching</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Post-Donation Care Instructions</CardTitle>
                  <CardDescription>Guidelines for after your donation</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Donation Center Locations</CardTitle>
                  <CardDescription>Map of all donation centers in the network</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Blood Donation Facts Sheet</CardTitle>
                  <CardDescription>Statistics and information about donation</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Blood Request Form</CardTitle>
                  <CardDescription>Printable form for emergency situations</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary" />
                <span>Impact of Your Donation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Every blood donation can save up to three lives. Here's how your contribution helps:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                    <h3 className="text-3xl font-bold text-primary">4.5M</h3>
                    <p className="text-sm text-muted-foreground">Americans need blood transfusions each year</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                    <h3 className="text-3xl font-bold text-primary">32K</h3>
                    <p className="text-sm text-muted-foreground">Pints of blood used in the U.S. daily</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                    <h3 className="text-3xl font-bold text-primary">43%</h3>
                    <p className="text-sm text-muted-foreground">Drop in blood donations during pandemic</p>
                  </div>
                </div>
                
                <p className="mt-6 text-muted-foreground">
                  Regular blood donation is essential for maintaining adequate supplies for routine 
                  treatments and emergency situations. Your contribution makes a significant difference 
                  in healthcare outcomes and patient survival rates.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <span>Common Eligibility Restrictions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                While most healthy adults can donate blood, some conditions may affect eligibility:
              </p>
              
              <ul className="space-y-2 text-muted-foreground">
                <li>• Recent illness or fever</li>
                <li>• Low hemoglobin or iron levels</li>
                <li>• Certain medications including blood thinners</li>
                <li>• Recent tattoos or piercings (typically 3-12 month wait)</li>
                <li>• Travel to certain countries with malaria risk</li>
                <li>• Pregnancy or recent childbirth</li>
                <li>• History of certain diseases or conditions</li>
              </ul>
              
              <p className="mt-4 text-sm">
                This list is not exhaustive. The final determination of eligibility is made 
                by medical professionals at the donation center. If you're unsure about your 
                eligibility, please contact your local donation center.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Check Your Eligibility</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-muted/30 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>Additional Educational Resources</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">For Donors</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Donation Process Guide</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Nutritional Advice for Donors</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Blood Donation Benefits</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">For Recipients</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Understanding Transfusions</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Patient Rights Guide</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Post-Transfusion Care</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">For Medical Professionals</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Blood Banking Protocols</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Transfusion Guidelines</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span>Emergency Request Procedures</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
