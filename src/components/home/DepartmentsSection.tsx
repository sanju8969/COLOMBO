import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Microscope, 
  BookOpen, 
  Calculator, 
  Globe, 
  GraduationCap, 
  Users,
  ArrowRight,
  Beaker,
  PenTool,
  DollarSign
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DepartmentsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo(
      cardsRef.current?.children,
      { opacity: 0, y: 100, scale: 0.8 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: 'back.out(1.7)' 
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  const departments = [
    {
      name: 'Science Faculty',
      description: 'Physics, Chemistry, Mathematics, Botany, Zoology, Computer Science',
      icon: Microscope,
      courses: ['B.Sc. Physics', 'B.Sc. Chemistry', 'B.Sc. Mathematics', 'B.Sc. Computer Science'],
      students: '1200+',
      faculty: '45',
      gradient: 'from-blue-600 to-purple-600',
      bgColor: 'bg-blue-50',
      link: '/departments/science'
    },
    {
      name: 'Arts Faculty',
      description: 'English, Hindi, Sanskrit, History, Political Science, Economics, Philosophy',
      icon: BookOpen,
      courses: ['B.A. English', 'B.A. History', 'B.A. Political Science', 'B.A. Economics'],
      students: '1000+',
      faculty: '38',
      gradient: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      link: '/departments/arts'
    },
    {
      name: 'Commerce Faculty',
      description: 'B.Com, Accountancy, Business Administration, Financial Management',
      icon: DollarSign,
      courses: ['B.Com General', 'B.Com Honours', 'BBA', 'Business Studies'],
      students: '800+',
      faculty: '32',
      gradient: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-50',
      link: '/departments/commerce'
    },
    {
      name: 'B.Ed. Program',
      description: 'Teacher Training and Educational Leadership Development',
      icon: GraduationCap,
      courses: ['B.Ed. Science', 'B.Ed. Arts', 'B.Ed. Commerce', 'Educational Psychology'],
      students: '200+',
      faculty: '15',
      gradient: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      link: '/departments/bed'
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-1 gold-gradient rounded-full" />
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">
              Academic Excellence
            </span>
            <div className="w-12 h-1 gold-gradient rounded-full" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary leading-tight">
            Our 
            <span className="text-gradient-gold"> Departments</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Comprehensive education across diverse disciplines, fostering intellectual growth 
            and professional development through innovative teaching methodologies.
          </p>
        </div>

        {/* Departments Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8">
          {departments.map((dept, index) => (
            <div 
              key={index}
              className="group bg-card rounded-2xl p-8 card-shadow hover:shadow-elegant smooth-transition hover-lift border"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${dept.gradient} flex items-center justify-center group-hover:scale-110 smooth-transition`}>
                  <dept.icon size={32} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{dept.students}</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold text-primary group-hover:text-gradient-gold smooth-transition">
                  {dept.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {dept.description}
                </p>

                {/* Courses */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary text-sm uppercase tracking-wider">
                    Popular Courses
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {dept.courses.map((course, idx) => (
                      <div 
                        key={idx}
                        className="text-sm bg-muted/50 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted smooth-transition"
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    <span>{dept.faculty} Faculty Members</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group/btn" onClick={() => window.location.href = '/departments'}>
                    Learn More
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 smooth-transition" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-college-crimson rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Start Your Academic Journey?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Explore our comprehensive range of courses and find the perfect program 
              to shape your future. Join thousands of successful alumni who started their journey here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={() => window.location.href = '/admissions'} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <GraduationCap size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Admission Info</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary" onClick={() => window.open('/prospectus.pdf', '_blank')}>
                <BookOpen size={20} />
                Download Prospectus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;