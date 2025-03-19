
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Droplet, 
  Menu, 
  X, 
  Heart, 
  User, 
  BookOpen, 
  LifeBuoy, 
  MapPin,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Navigation items - base items that everyone sees
  const baseNavItems = [
    { name: 'Find Donors', href: '/find-donors', icon: Heart },
    { name: 'Emergency Request', href: '/emergency', icon: LifeBuoy },
    { name: 'Donation Centers', href: '/centers', icon: MapPin },
    { name: 'Resources', href: '/resources', icon: BookOpen },
  ];
  
  // Get all nav items based on auth status
  const getNavItems = () => {
    if (user) {
      // User is logged in
      return [
        ...baseNavItems,
        { name: 'Profile', href: '/profile', icon: User, button: false },
      ];
    } else {
      // User is not logged in
      return [
        ...baseNavItems,
        { name: 'Sign In', href: '/signin', icon: User, button: true },
      ];
    }
  };

  const navItems = getNavItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out py-4 px-6",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Droplet className="h-8 w-8 text-primary animate-pulse-subtle" />
          <span className="font-bold text-xl tracking-tight text-foreground">BloodConnect</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            item.button ? (
              <Button key={item.name} asChild variant="default" className="animate-pulse-subtle">
                <Link to={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground/80 hover:text-primary flex items-center gap-1.5 transition-colors group"
              >
                <item.icon className="h-4 w-4" />
                <span className="relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </span>
              </Link>
            )
          ))}

          {/* Sign Out button if user is logged in */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-primary/10">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 bg-background z-40 transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-4 p-6 animate-slide-in">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 p-3 hover:bg-accent/10 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 text-primary" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          
          {/* Sign Out option in mobile menu if user is logged in */}
          {user && (
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 hover:bg-accent/10 rounded-md transition-colors text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
