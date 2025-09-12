import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import DepartmentsSection from '@/components/home/DepartmentsSection';
import NoticesSection from '@/components/home/NoticesSection';

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <DepartmentsSection />
      <NoticesSection />
    </main>
  );
};

export default Index;
