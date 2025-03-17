
import React from 'react';
import { 
  UserPlus, 
  Bell, 
  MapPin, 
  Droplet, 
  MessageSquare, 
  HeartPulse, 
  BookOpen, 
  Database 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: UserPlus,
      title: 'User Registration',
      description: 'Secure registration for donors, recipients, and medical institutions ensures data privacy and integrity.'
    },
    {
      icon: Droplet,
      title: 'Donor Tracking',
      description: 'Real-time monitoring of donor availability based on medical guidelines and donation history.'
    },
    {
      icon: Bell,
      title: 'Emergency Requests',
      description: 'Immediate blood request notifications to compatible donors in proximity during emergencies.'
    },
    {
      icon: MapPin,
      title: 'Geolocation Services',
      description: 'GPS-based location of nearby donors and blood banks for quick emergency responses.'
    },
    {
      icon: Database,
      title: 'Inventory Management',
      description: 'Efficient blood stock level tracking and AI-driven shortage prediction for blood banks.'
    },
    {
      icon: MessageSquare,
      title: 'Communication Platform',
      description: 'In-app messaging and notifications to streamline communication between all stakeholders.'
    },
    {
      icon: HeartPulse,
      title: 'Health Monitoring',
      description: 'Integration with health data to monitor donor eligibility and ensure safe donation practices.'
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Information on donation importance, eligibility criteria, and health tips for community engagement.'
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/5 z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform leverages modern technology to create a seamless experience 
            connecting donors, recipients, and medical institutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-lg p-6 hover-lift shadow-sm border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
