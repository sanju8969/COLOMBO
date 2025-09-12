import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, BookOpen, Users, Award, MapPin, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import FloatingGeometry from '@/components/three/FloatingGeometry';
import ParticleFieldCanvas from '@/components/three/ParticleField';
import campusHero from '@/assets/campus-hero.jpg';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Enhanced hero animation sequence with morphing effects
    tl.fromTo(
      titleRef.current,
      { 
        opacity: 0, 
        y: 100, 
        scale: 0.8,
        rotationX: 45,
        transformOrigin: "50% 100%"
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotationX: 0,
        duration: 1.5, 
        ease: 'power3.out' 
      }
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        duration: 1, 
        ease: 'power2.out' 
      },
      '-=0.8'
    )
    .fromTo(
      buttonsRef.current?.children,
      { 
        opacity: 0, 
        y: 30, 
        scale: 0.8,
        rotationY: 180
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotationY: 0,
        duration: 0.8, 
        stagger: 0.2, 
        ease: 'back.out(2)' 
      },
      '-=0.5'
    )
    .fromTo(
      statsRef.current?.children,
      { 
        opacity: 0, 
        y: 50, 
        scale: 0.5,
        rotation: 180
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotation: 0,
        duration: 1, 
        stagger: 0.15, 
        ease: 'elastic.out(1, 0.5)' 
      },
      '-=0.4'
    )
    .fromTo(
      sparklesRef.current?.children,
      { 
        opacity: 0, 
        scale: 0,
        rotation: 0
      },
      { 
        opacity: 1, 
        scale: 1,
        rotation: 360,
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'back.out(1.7)',
        repeat: -1,
        yoyo: true
      },
      '-=0.2'
    );

    // Enhanced parallax with rotation
    gsap.to(heroRef.current, {
      yPercent: -50,
      rotation: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Floating elements animation
    gsap.to(floatingElementsRef.current?.children, {
      y: "random(-20, 20)",
      x: "random(-10, 10)",
      rotation: "random(-180, 180)",
      duration: "random(2, 4)",
      ease: "sine.inOut",
      stagger: 0.2,
      repeat: -1,
      yoyo: true
    });

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (clientX - centerX) * 0.005;
      const moveY = (clientY - centerY) * 0.005;

      gsap.to(titleRef.current, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(floatingElementsRef.current?.children, {
        x: moveX * 2,
        y: moveY * 2,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.02
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const heroStats = [
    {
      icon: Users,
      number: '3000+',
      label: 'Students',
      color: 'text-secondary'
    },
    {
      icon: BookOpen,
      number: '25+',
      label: 'Courses',
      color: 'text-accent'
    },
    {
      icon: Award,
      number: '125+',
      label: 'Years Legacy',
      color: 'text-college-crimson'
    },
    {
      icon: MapPin,
      number: '28',
      label: 'Acre Campus',
      color: 'text-college-forest'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js Background */}
      <FloatingGeometry />
      
      {/* Particle Field */}
      <ParticleFieldCanvas />

      {/* Background Image with Overlay */}
      <div 
        ref={heroRef}
        className="absolute inset-0 z-1"
        style={{
          backgroundImage: `url(${campusHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-overlay opacity-90" />
      </div>

      {/* Enhanced Animated Background Elements */}
      <div 
        ref={floatingElementsRef}
        className="absolute inset-0 z-2 pointer-events-none"
      >
        {/* Floating geometric shapes with enhanced animations */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse glow-shadow" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-college-crimson/10 rounded-full blur-xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-college-gold/10 rounded-full blur-xl animate-pulse delay-1500" />
        
        {/* Sparkle effects */}
        <div ref={sparklesRef} className="absolute inset-0">
          <Sparkles className="absolute top-1/6 left-1/5 text-secondary w-4 h-4 opacity-60" />
          <Sparkles className="absolute top-2/3 right-1/6 text-accent w-6 h-6 opacity-40" />
          <Sparkles className="absolute bottom-1/3 left-2/5 text-college-gold w-3 h-3 opacity-70" />
          <Sparkles className="absolute top-1/3 right-1/2 text-college-crimson w-5 h-5 opacity-50" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-width text-center text-white backdrop-blur-sm">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Title */}
          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight"
          >
            <span className="block">St. Columba's</span>
            <span className="block text-gradient-gold">College</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-secondary mt-2">
              Hazaribagh
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-white/90 max-w-3xl mx-auto"
          >
            <span className="font-display italic">"Truth and Service"</span> • Empowering minds since 1899 • 
            A legacy of academic excellence and character formation in the heart of Jharkhand
          </p>

          {/* Action Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="gold" size="xl" asChild className="group">
              <Link to="/admissions">
                <BookOpen size={24} />
                Admission Information
                <ArrowRight size={20} className="group-hover:translate-x-1 smooth-transition" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm group relative overflow-hidden"
              onClick={() => window.open('https://www.youtube.com/watch?v=your-video-id', '_blank')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-college-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Play size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Virtual Campus Tour</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-college-gold rounded-full animate-pulse" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {heroStats.map((stat, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-md rounded-xl p-6 hover-lift border border-white/20 hover:border-secondary/50 smooth-transition hover:bg-white/20">
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center ${stat.color} group-hover:scale-110 smooth-transition group-hover:rotate-12`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-secondary group-hover:text-college-gold smooth-transition">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/80 font-medium group-hover:text-white smooth-transition">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 group cursor-pointer">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-secondary smooth-transition relative overflow-hidden">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce group-hover:bg-secondary smooth-transition" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 smooth-transition" />
        </div>
        <div className="text-xs text-white/60 mt-2 group-hover:text-white smooth-transition">Scroll</div>
      </div>
    </section>
  );
};

export default HeroSection;