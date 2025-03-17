
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      avatar: 'https://i.pravatar.cc/150?img=1',
      name: 'Emma Wilson',
      role: 'Regular Donor',
      quote: 'BloodConnect has made it incredibly easy for me to track my donation eligibility and find nearby donation centers. The app notifications remind me when I\'m eligible to donate again.',
      rating: 5
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=2',
      name: 'Dr. James Mitchell',
      role: 'Emergency Physician',
      quote: 'As an ER doctor, I\'ve seen firsthand how this platform can save lives. The emergency request feature helps us connect with compatible donors quickly during critical situations.',
      rating: 5
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=3',
      name: 'Sarah Chen',
      role: 'Blood Recipient',
      quote: 'When I needed a rare blood type for my surgery, BloodConnect helped locate multiple donors within hours. The efficient communication system made the entire process smooth and stress-free.',
      rating: 5
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=4',
      name: 'Michael Rodriguez',
      role: 'Blood Bank Manager',
      quote: 'The inventory management system has revolutionized how we track and manage our blood supplies. The predictive analytics help us anticipate shortages before they become critical.',
      rating: 4
    }
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-background z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Read testimonials from donors, recipients, and medical professionals 
            who have experienced the impact of our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-lg shadow-sm border hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-foreground italic mb-4">"{testimonial.quote}"</p>
              
              <div className="flex items-center gap-0.5">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-muted"} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
