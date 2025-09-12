import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Award, 
  Target, 
  Heart, 
  Lightbulb,
  GraduationCap,
  Building2
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const leadershipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Hero animation
    tl.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Timeline animation
    gsap.fromTo(timelineRef.current?.children || [], 
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.2,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
        }
      }
    );

    // Mission cards animation
    gsap.fromTo(missionRef.current?.children || [], 
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.15,
        scrollTrigger: {
          trigger: missionRef.current,
          start: "top 80%",
        }
      }
    );

    // Leadership animation
    gsap.fromTo(leadershipRef.current?.children || [], 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.7, 
        stagger: 0.1,
        scrollTrigger: {
          trigger: leadershipRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const timelineEvents = [
    { year: "1899", event: "Founded by the Society of Jesus (Jesuits)", icon: Building2 },
    { year: "1920", event: "First graduation ceremony held", icon: GraduationCap },
    { year: "1947", event: "Post-independence expansion", icon: Award },
    { year: "1975", event: "Affiliated with Vinoba Bhave University", icon: BookOpen },
    { year: "1990", event: "Computer Science department established", icon: Lightbulb },
    { year: "2010", event: "NAAC Accreditation received", icon: Award },
    { year: "2020", event: "Digital transformation completed", icon: Target }
  ];

  const missionValues = [
    {
      title: "Excellence in Education",
      description: "Providing world-class education that nurtures critical thinking and innovation",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Character Formation",
      description: "Developing ethical leaders who serve society with integrity and compassion",
      icon: Heart,
      gradient: "from-red-500 to-pink-500"
    },
    {
      title: "Research & Innovation",
      description: "Fostering a culture of inquiry and discovery for societal advancement",
      icon: Lightbulb,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Social Responsibility",
      description: "Empowering students to become responsible citizens and change-makers",
      icon: Users,
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const leadership = [
    {
      name: "Dr. Manoj Kumar",
      position: "Principal",
      qualification: "Ph.D. in Education",
      experience: "25+ years",
      specialization: "Educational Administration"
    },
    {
      name: "Dr. R. K. Singh",
      position: "Dean (Science)",
      qualification: "Ph.D. in Physics",
      experience: "20+ years",
      specialization: "Quantum Physics"
    },
    {
      name: "Prof. A. K. Mishra",
      position: "Dean (Arts)",
      qualification: "M.A., Ph.D. in English Literature",
      experience: "18+ years",
      specialization: "Modern Literature"
    },
    {
      name: "Prof. S. P. Sinha",
      position: "Dean (Commerce)",
      qualification: "M.Com, Ph.D. in Commerce",
      experience: "15+ years",
      specialization: "Business Management"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary bg-white/10 border-white/20">
              Est. 1899 • 125 Years of Excellence
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text">
              About St. Columba's College
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              A legacy of academic excellence, character formation, and service to society, 
              rooted in Jesuit educational traditions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <BookOpen className="mr-2 h-5 w-5" />
                College Prospectus
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Award className="mr-2 h-5 w-5" />
                NAAC Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-primary">Our Journey Through Time</h2>
            <div ref={timelineRef} className="space-y-8">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={index} className="flex items-center gap-6 group">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg p-6 shadow-md group-hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
                        <h3 className="text-2xl font-bold text-primary mb-2">{event.year}</h3>
                        <p className="text-gray-700 text-lg">{event.event}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Our Mission & Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Guided by our motto "Truth and Service", we are committed to holistic education 
              that transforms lives and builds a better society.
            </p>
          </div>
          <div ref={missionRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missionValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${value.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-primary">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our distinguished faculty leaders bring decades of experience and expertise 
              to guide the institution towards excellence.
            </p>
          </div>
          <div ref={leadershipRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-primary">{leader.name}</h3>
                  <p className="text-accent font-semibold mb-3">{leader.position}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Qualification:</strong> {leader.qualification}</p>
                    <p><strong>Experience:</strong> {leader.experience}</p>
                    <p><strong>Specialization:</strong> {leader.specialization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Legacy</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Be part of a tradition that has shaped leaders, innovators, and change-makers for over a century.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 group relative overflow-hidden" onClick={() => window.location.href = '/admissions'}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <GraduationCap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Admission Info</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-college-gold rounded-full animate-pulse" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Users className="mr-2 h-5 w-5" />
              Visit Campus
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;