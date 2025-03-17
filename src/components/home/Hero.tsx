
import React from 'react';
import { ArrowRight, Droplet, Heart, Activity, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-screen flex items-center justify-center pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-accent/5 z-0" />
      
      {/* Animated blood drops */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="blood-drop absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          >
            <Droplet 
              size={20 + Math.random() * 30} 
              className="text-primary" 
            />
          </div>
        ))}
      </div>
      
      <div className="container px-4 sm:px-6 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in">
            <div>
              <div className="inline-flex items-center rounded-full px-3 py-1 bg-muted text-sm font-medium mb-4">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Saving Lives Through Technology
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Connect <span className="text-primary">Donors</span> with <br className="hidden md:block" />
                Those in <span className="text-primary">Need</span>
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              A modern platform that connects blood donors with recipients in real-time, 
              streamlining the donation process and helping save lives during emergencies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                <span>Donate Now</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/emergency">Request Blood</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {[
                { icon: Heart, title: "10,000+", subtitle: "Registered Donors" },
                { icon: Activity, title: "24/7", subtitle: "Emergency Support" },
                { icon: Clock, title: "15 min", subtitle: "Average Response Time" },
              ].map((stat, index) => (
                <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-card shadow-sm hover-lift">
                  <stat.icon className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-xl font-bold">{stat.title}</h3>
                  <p className="text-muted-foreground text-sm">{stat.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-full flex items-center justify-center lg:justify-end animate-fade-in">
            <div className="relative w-full max-w-md aspect-square">
              {/* Main circle */}
              <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse-subtle" />
              
              {/* Inner content */}
              <div className="absolute inset-8 glass-morph rounded-full flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <Droplet className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">BloodConnect</h3>
                  <p className="text-sm text-muted-foreground mt-2">Connecting Lives</p>
                </div>
              </div>
              
              {/* Orbiting elements */}
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="absolute h-16 w-16 rounded-full glass-morph flex items-center justify-center shadow-md"
                  style={{
                    top: `${50 - 40 * Math.sin(i * Math.PI / 2)}%`,
                    left: `${50 - 40 * Math.cos(i * Math.PI / 2)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {i === 0 && <span className="text-xl font-bold text-primary">A+</span>}
                  {i === 1 && <span className="text-xl font-bold text-primary">B-</span>}
                  {i === 2 && <span className="text-xl font-bold text-primary">O+</span>}
                  {i === 3 && <span className="text-xl font-bold text-primary">AB</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
