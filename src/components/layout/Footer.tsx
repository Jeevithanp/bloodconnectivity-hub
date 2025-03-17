
import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Mail, Phone, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t w-full py-12 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Droplet className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">BloodConnect</span>
          </div>
          <p className="text-muted-foreground max-w-xs">
            Connecting donors and recipients to save lives through efficient blood donation management.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a 
              href="#" 
              className="bg-secondary h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5 text-foreground" />
            </a>
            <a 
              href="#" 
              className="bg-secondary h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-foreground" />
            </a>
            <a 
              href="#" 
              className="bg-secondary h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-foreground" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {['Home', 'Find Donors', 'Emergency Request', 'Donation Centers', 'Resources'].map((item) => (
              <li key={item}>
                <Link 
                  to={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Protection'].map((item) => (
              <li key={item}>
                <Link 
                  to={`/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:contact@bloodconnect.com" className="text-muted-foreground hover:text-primary transition-colors">
                contact@bloodconnect.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                +1 (234) 567-890
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Available 24/7 for emergencies</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} BloodConnect. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground mt-2 md:mt-0">
          Made with <Heart className="h-3 w-3 text-primary inline" /> for saving lives
        </p>
      </div>
    </footer>
  );
};

export default Footer;
