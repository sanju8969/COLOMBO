import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Award, BookOpen, Globe, ArrowRight, Calendar, MapPin, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlowingCard from '@/components/enhanced/GlowingCards';
import AnimatedCounter from '@/components/enhanced/AnimatedCounter';
import MorphingText from '@/components/enhanced/MorphingText';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    // Enhanced animations with morphing and 3D effects
    tl.fromTo(
      contentRef.current,
      { 
        opacity: 0, 
        x: -100,
        rotationY: -15,
        transformOrigin: "right center"
      },
      { 
        opacity: 1, 
        x: 0,
        rotationY: 0,
        duration: 1.2, 
        ease: 'power3.out' 
      }
    )
    .fromTo(
      imageRef.current,
      { 
        opacity: 0, 
        x: 100, 
        scale: 0.7,
        rotationY: 15,
        transformOrigin: "left center"
      },
      { 
        opacity: 1, 
        x: 0, 
        scale: 1,
        rotationY: 0,
        duration: 1.2, 
        ease: 'power3.out' 
      },
      '-=0.8'
    )
    .fromTo(
      achievementsRef.current?.children,
      { 
        opacity: 0, 
        y: 80,
        scale: 0.8,
        rotationX: 45
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1, 
        stagger: 0.15, 
        ease: 'back.out(1.7)' 
      },
      '-=0.6'
    );

    // Continuous subtle animations
    gsap.to(achievementsRef.current?.children, {
      y: "random(-5, 5)",
      duration: "random(3, 5)",
      ease: "sine.inOut",
      stagger: 0.5,
      repeat: -1,
      yoyo: true
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const achievements = [
    {
      icon: Calendar,
      title: 'Established 1899',
      description: 'Over 125 years of academic excellence',
      gradient: 'from-college-navy to-college-crimson'
    },
    {
      icon: Star,
      title: 'NAAC Accredited',
      description: 'Recognized for quality education',
      gradient: 'from-college-gold to-secondary'
    },
    {
      icon: Globe,
      title: 'VBU Affiliated',
      description: 'Vinoba Bhave University partnership',
      gradient: 'from-college-forest to-accent'
    },
    {
      icon: Users,
      title: 'Jesuit Legacy',
      description: 'Founded by the Society of Jesus',
      gradient: 'from-college-crimson to-destructive'
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-1 gold-gradient rounded-full" />
                <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                  About Our Institution
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary leading-tight">
                A Legacy of 
                <MorphingText 
                  texts={['Excellence', 'Innovation', 'Tradition', 'Service']}
                  className="text-gradient-gold"
                  duration={3}
                />
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                St. Columba's College, Hazaribagh stands as a beacon of academic excellence and moral 
                formation in the heart of Jharkhand. Established in 1899 by the Jesuits, our institution 
                has been nurturing minds and shaping characters for over 125 years.
              </p>
              <p>
                As a constituent unit of Vinoba Bhave University, we offer comprehensive education 
                across Science, Arts, Commerce, and B.Ed. programs. Our 28-acre campus provides a 
                conducive environment for holistic development, combining traditional values with 
                modern educational methodologies.
              </p>
              <p>
                With our motto <span className="font-display italic text-primary">"Truth and Service"</span>, 
                we continue to inspire students to become responsible citizens and leaders who contribute 
                meaningfully to society.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/admissions">
                  <BookOpen size={20} />
                  Admissions Info
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Content */}
          <div ref={imageRef} className="space-y-8">
            {/* Main Image Placeholder */}
            <div className="relative group">
              <div className="w-full h-96 rounded-2xl hero-gradient flex items-center justify-center text-white text-center elegant-shadow hover:glow-shadow smooth-transition">
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                    <Award size={40} />
                  </div>
                  <h3 className="text-2xl font-display font-bold">
                    125+ Years of Excellence
                  </h3>
                  <p className="text-white/90 max-w-sm mx-auto">
                    Continuing the Jesuit tradition of academic rigor and character formation
                  </p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 gold-gradient rounded-full blur-xl opacity-60" />
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <GlowingCard glowColor="#FFD700" className="text-center p-6">
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter target={3000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground font-medium">Active Students</div>
              </GlowingCard>
              <GlowingCard glowColor="#42A5F5" className="text-center p-6">
                <div className="text-3xl font-bold text-secondary">
                  <AnimatedCounter target={150} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground font-medium">Expert Faculty</div>
              </GlowingCard>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div ref={achievementsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {achievements.map((achievement, index) => (
            <GlowingCard 
              key={index}
              index={index}
              glowColor={
                index === 0 ? '#0F172A' : 
                index === 1 ? '#FFD700' : 
                index === 2 ? '#22C55E' : '#DC2626'
              }
              className="p-6 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 smooth-transition`}>
                <achievement.icon size={24} className="text-white" />
              </div>
              <h4 className="text-xl font-display font-bold text-primary mb-2 group-hover:text-secondary smooth-transition">
                {achievement.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed group-hover:text-foreground smooth-transition">
                {achievement.description}
              </p>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;