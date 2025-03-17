
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Droplet, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 z-0" />
      
      {/* Animated blood drops */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
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
      
      <div className="max-w-5xl mx-auto relative z-10 rounded-2xl overflow-hidden shadow-xl border">
        <div className="bg-gradient-to-r from-primary/90 to-accent p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-in">
            Become a Donor and Help Save Lives Today
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join our community of donors and make a difference. Your donation can help save 
            up to three lives and provide hope to patients in need.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" variant="secondary" className="group">
              <span>Register as a Donor</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/learn-more">Learn More</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 flex items-center gap-2" asChild>
              <Link to="/article">
                <BookOpen className="h-4 w-4" />
                <span>Read Our Article</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
