
import React from 'react';
import { UserPlus, Search, Bell, Droplet, Check } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create an Account',
      description: 'Register as a donor or recipient with your blood type and medical information.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Search,
      title: 'Find Donors Near You',
      description: 'Use geolocation to find compatible donors or blood banks in your vicinity.',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Bell,
      title: 'Send/Receive Requests',
      description: 'Create blood requests during emergencies or respond to notifications as a donor.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Droplet,
      title: 'Complete Donation',
      description: 'Follow the guidance to complete the donation process at the nearest center.',
      color: 'bg-primary/10 text-primary',
    },
  ];

  return (
    <section className="py-24 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our streamlined process makes blood donation and requests simple, efficient, and life-saving.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="bg-card rounded-lg p-6 h-full border shadow-sm hover-lift flex flex-col">
                <div className={`h-12 w-12 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground flex-1">{step.description}</p>
                
                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  <span>Step {index + 1}</span>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-primary/30 transform -translate-y-1/2 z-0" style={{ width: 'calc(100% - 3rem)' }} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-card rounded-xl p-8 shadow-sm border animate-fade-in">
          <h3 className="text-2xl font-semibold mb-4">Benefits of Using BloodConnect</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Timely access to blood during emergencies',
              'Enhanced donor engagement and participation',
              'Efficient blood inventory management',
              'Improved communication between stakeholders',
              'Real-time tracking of blood availability',
              'Secure handling of personal and medical data',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
