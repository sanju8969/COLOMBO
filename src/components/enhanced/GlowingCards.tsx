import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  index?: number;
}

const GlowingCard: React.FC<GlowingCardProps> = ({ 
  children, 
  className = '', 
  glowColor = '#FFD700',
  index = 0 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Hover glow effect
    const handleMouseEnter = () => {
      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cardRef.current, {
        y: -10,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(glowRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Scroll trigger animation
    gsap.fromTo(cardRef.current, 
      { 
        opacity: 0, 
        y: 100, 
        scale: 0.8,
        rotationY: 45 
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    const card = cardRef.current;
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index, glowColor]);

  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-lg opacity-0"
        style={{
          background: `radial-gradient(circle, ${glowColor}33 0%, transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'scale(1)'
        }}
      />
      
      {/* Card */}
      <Card 
        ref={cardRef}
        className={`relative z-10 backdrop-blur-sm bg-white/5 border-white/20 ${className}`}
      >
        {children}
      </Card>
    </div>
  );
};

export default GlowingCard;