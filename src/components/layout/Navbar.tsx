import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  GraduationCap, 
  Phone, 
  Mail, 
  LogOut, 
  LayoutDashboard,
  MapPin,
  Award,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import collegeLogo from '@/assets/college-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showNoticeBadge, setShowNoticeBadge] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user has already seen notices
    const hasSeenNotices = localStorage.getItem('hasSeenNotices');
    if (hasSeenNotices) {
      setShowNoticeBadge(false);
    }
  }, []);

  useEffect(() => {
    // Check current auth state
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "✨ Signed out successfully",
        description: "Come back soon!"
      });
    } catch (error) {
      toast({
        title: "❌ Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleNoticeClick = () => {
    // Mark notices as seen
    localStorage.setItem('hasSeenNotices', 'true');
    setShowNoticeBadge(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: null },
    { name: 'About', path: '/about', icon: null },
    { name: 'Departments', path: '/departments', icon: null },
    { name: 'Admissions', path: '/admissions', icon: null },
    // Only show Gallery if user is not logged in
    ...(user ? [] : [{ name: 'Gallery', path: '/gallery', icon: null }]),
    { name: 'Alumni', path: '/alumni', icon: null },
    { name: 'Academics', path: '/academics', icon: null },
    { name: 'Notices', path: '/notices', icon: null, badge: showNoticeBadge ? 'NEW' : null, onClick: handleNoticeClick },
    { name: 'Contact', path: '/contact', icon: null },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Enhanced Top Info Bar */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-3 text-sm hidden md:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-slide"></div>
        <div className="container-width flex justify-between items-center relative z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
              <div className="p-1 bg-white/10 rounded-full">
                <Phone size={12} className="text-white" />
              </div>
              <span className="font-medium tracking-wide font-inter">+91-6546-272XXX</span>
            </div>
            <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
              <div className="p-1 bg-white/10 rounded-full">
                <Mail size={12} className="text-white" />
              </div>
              <span className="font-medium tracking-wide font-inter">admin@stcolumbascollege.edu.in</span>
            </div>
            <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
              <div className="p-1 bg-white/10 rounded-full">
                <MapPin size={12} className="text-white" />
              </div>
              <span className="font-medium tracking-wide font-inter">Hazaribagh, Jharkhand</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              <Award size={14} className="text-yellow-300" />
              <span className="text-secondary font-semibold font-inter">Est. 1899</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
              <Sparkles size={14} className="text-green-300" />
              <span className="font-semibold text-green-100 font-inter">NAAC Accredited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl shadow-2xl border-b border-border/50' 
          : 'bg-background/100'
      }`} >
        <div className="container-width">
          <div className="flex items-center justify-between h-24">
            {/* Enhanced Logo */}
            <Link to="/" className="group flex items-center gap-4 hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-sm group-hover:blur-none transition-all duration-300"></div>
                <img 
                  src={collegeLogo} 
                  alt="St. Columba's College Logo" 
                  className="h-14 w-14 object-contain relative z-10 drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-primary bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text" >
                  St. Columba's College
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground font-semibold tracking-wide" >
                    Hazaribagh • Since 1899
                  </p>
                  <div className="h-1 w-1 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    onClick={item.onClick || (() => {})}
                    className={`relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-primary to-primary/80 shadow-lg scale-105'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105'
                    }`}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce" >
                        {item.badge}
                      </span>
                    )}
                    {isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg blur-xl"></div>
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary hover:shadow-lg"
                  >
                    <Link to="/dashboard">
                      <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary hover:shadow-lg"
                  >
                    <Link to="/gallery">
                      <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                      Gallery
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary hover:shadow-xl"
                  >
                    <Link to="/auth">
                      <GraduationCap size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                      Login
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:scale-110 transition-all duration-300 hover:bg-primary/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="relative">
                {isOpen ? (
                  <X size={24} className="rotate-180 transition-transform duration-300" />
                ) : (
                  <Menu size={24} className="group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl animate-in slide-in-from-top-2 duration-300">
            <div className="container-width py-6">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsOpen(false);
                    }}
                    className={`group font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-primary to-primary/80 shadow-lg scale-105'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5 hover:scale-105 hover:translate-x-2'
                    }`}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span className="flex items-center gap-3">
                      {item.name}
                      {item.badge && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce" >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
                
                <div className="flex flex-col gap-3 pt-6 border-t border-border/30 mt-4">
                  {user ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary hover:shadow-lg"
                      >
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary hover:shadow-lg"
                      >
                        <Link to="/gallery" onClick={() => setIsOpen(false)}>
                          <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                          Gallery
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary hover:shadow-xl"
                    >
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <GraduationCap size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
