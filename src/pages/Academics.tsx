import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen,
  Calendar,
  Download,
  Search,
  Clock,
  Award,
  Users,
  FileText,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  Microscope,
  Calculator
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Academics = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Courses animation
    gsap.fromTo(coursesRef.current?.children || [], 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1,
        scrollTrigger: {
          trigger: coursesRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const academicPrograms = [
    {
      id: 1,
      name: "B.Sc. Physics",
      category: "science",
      duration: "3 Years",
      credits: 180,
      level: "Undergraduate",
      description: "Comprehensive study of fundamental physics principles and their applications",
      subjects: ["Mechanics", "Thermodynamics", "Electromagnetism", "Quantum Physics", "Optics"],
      career: ["Research Scientist", "Lab Technician", "Physics Teacher", "Data Analyst"],
      icon: Microscope,
      rating: 4.8,
      students: 120
    },
    {
      id: 2,
      name: "B.A. English Literature",
      category: "arts",
      duration: "3 Years",
      credits: 180,
      level: "Undergraduate",
      description: "Explore the rich world of English literature and develop critical thinking skills",
      subjects: ["Poetry", "Drama", "Fiction", "Literary Criticism", "Linguistics"],
      career: ["Writer", "Journalist", "Teacher", "Content Creator", "Translator"],
      icon: BookOpen,
      rating: 4.7,
      students: 150
    },
    {
      id: 3,
      name: "B.Com",
      category: "commerce",
      duration: "3 Years",
      credits: 180,
      level: "Undergraduate",
      description: "Master business fundamentals and accounting principles for commercial success",
      subjects: ["Accounting", "Business Law", "Economics", "Statistics", "Management"],
      career: ["Accountant", "Business Analyst", "Bank Manager", "Entrepreneur"],
      icon: Calculator,
      rating: 4.6,
      students: 200
    },
    {
      id: 4,
      name: "M.Sc. Chemistry",
      category: "science",
      duration: "2 Years",
      credits: 120,
      level: "Postgraduate",
      description: "Advanced study of chemical principles and research methodologies",
      subjects: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"],
      career: ["Research Scientist", "Quality Analyst", "Chemical Engineer", "Professor"],
      icon: Microscope,
      rating: 4.9,
      students: 45
    },
    {
      id: 5,
      name: "B.Ed.",
      category: "education",
      duration: "2 Years",
      credits: 120,
      level: "Professional",
      description: "Prepare to become an effective educator with modern teaching methodologies",
      subjects: ["Educational Psychology", "Curriculum Development", "Teaching Methods", "Assessment"],
      career: ["School Teacher", "Education Coordinator", "Principal", "Curriculum Designer"],
      icon: Users,
      rating: 4.5,
      students: 100
    }
  ];

  const academicCalendar = [
    { event: "Semester I Begins", date: "July 20, 2024", type: "semester" },
    { event: "Mid-term Examinations", date: "September 15-25, 2024", type: "exam" },
    { event: "Semester I Ends", date: "December 15, 2024", type: "semester" },
    { event: "Winter Break", date: "December 16-31, 2024", type: "break" },
    { event: "Semester II Begins", date: "January 2, 2025", type: "semester" },
    { event: "Annual Examinations", date: "April 1-30, 2025", type: "exam" },
    { event: "Results Declaration", date: "May 15, 2025", type: "result" },
    { event: "Summer Break", date: "May 16 - July 15, 2025", type: "break" }
  ];

  const resources = [
    {
      title: "Digital Library",
      description: "Access to 50,000+ e-books and research papers",
      icon: BookOpen,
      link: "#"
    },
    {
      title: "Online Learning Portal",
      description: "Interactive courses and virtual classrooms",
      icon: Globe,
      link: "#"
    },
    {
      title: "Research Repository",
      description: "Student and faculty research publications",
      icon: FileText,
      link: "#"
    },
    {
      title: "Academic Calendar",
      description: "Important dates and academic schedule",
      icon: Calendar,
      link: "#"
    }
  ];

  const filteredPrograms = selectedCategory === "all" 
    ? academicPrograms 
    : academicPrograms.filter(program => program.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary bg-white/10 border-white/20">
              Academic Excellence • Research Focus
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text">
              Academics
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Discover our comprehensive academic programs designed to foster innovation, 
              critical thinking, and lifelong learning.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-white/80">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">95%</div>
                <div className="text-white/80">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">200+</div>
                <div className="text-white/80">Faculty</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">80%</div>
                <div className="text-white/80">Placement Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Academic Programs</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our diverse range of programs across multiple disciplines
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              All Programs
            </Button>
            <Button 
              variant={selectedCategory === "science" ? "default" : "outline"}
              onClick={() => setSelectedCategory("science")}
              className="rounded-full"
            >
              Science
            </Button>
            <Button 
              variant={selectedCategory === "arts" ? "default" : "outline"}
              onClick={() => setSelectedCategory("arts")}
              className="rounded-full"
            >
              Arts
            </Button>
            <Button 
              variant={selectedCategory === "commerce" ? "default" : "outline"}
              onClick={() => setSelectedCategory("commerce")}
              className="rounded-full"
            >
              Commerce
            </Button>
            <Button 
              variant={selectedCategory === "education" ? "default" : "outline"}
              onClick={() => setSelectedCategory("education")}
              className="rounded-full"
            >
              Education
            </Button>
          </div>

          <div ref={coursesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <Card key={program.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-12 w-12 text-primary" />
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{program.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-primary">{program.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{program.level}</Badge>
                      <Badge variant="secondary">{program.duration}</Badge>
                      <Badge variant="outline">{program.credits} Credits</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{program.description}</p>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Core Subjects</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.subjects.slice(0, 3).map((subject, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {program.subjects.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{program.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Career Opportunities</h4>
                      <div className="text-sm text-muted-foreground">
                        {program.career.slice(0, 2).join(", ")}
                        {program.career.length > 2 && "..."}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{program.students} Students</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Calendar & Resources */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Academic Calendar */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-primary flex items-center gap-3">
                <Calendar className="h-8 w-8" />
                Academic Calendar 2024-25
              </h2>
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {academicCalendar.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                        <div>
                          <h4 className="font-semibold text-primary">{event.event}</h4>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                        <Badge variant={
                          event.type === "exam" ? "destructive" :
                          event.type === "break" ? "secondary" :
                          event.type === "result" ? "default" : "outline"
                        }>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6">
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Academic Resources */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-primary flex items-center gap-3">
                <BookOpen className="h-8 w-8" />
                Academic Resources
              </h2>
              <div className="space-y-6">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary mb-2">{resource.title}</h3>
                            <p className="text-muted-foreground mb-4">{resource.description}</p>
                            <Button variant="outline" size="sm">
                              Access Resource
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Student Success</h2>
            <p className="text-xl text-muted-foreground">Our academic excellence translates to real-world success</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-primary mb-2">95%</h3>
                <p className="text-muted-foreground">Pass Rate</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-primary mb-2">80%</h3>
                <p className="text-muted-foreground">Placement Rate</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-primary mb-2">500+</h3>
                <p className="text-muted-foreground">Alumni Network</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-primary mb-2">4.7/5</h3>
                <p className="text-muted-foreground">Student Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Academic Journey</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of students who have built successful careers through our 
            rigorous academic programs and supportive learning environment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Search className="mr-2 h-5 w-5" />
              Explore Programs
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <FileText className="mr-2 h-5 w-5" />
              Download Syllabus
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;