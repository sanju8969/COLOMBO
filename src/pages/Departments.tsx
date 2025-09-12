import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Atom, 
  BookOpen, 
  Calculator, 
  Leaf, 
  Microscope, 
  Monitor,
  PenTool,
  Globe,
  Coins,
  GraduationCap,
  Users,
  Clock,
  ChevronRight,
  Award,
  Mail,
  Phone
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Departments = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const departmentsRef = useRef<HTMLDivElement>(null);
  const [selectedDept, setSelectedDept] = useState("science");

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Department cards animation
    gsap.fromTo(departmentsRef.current?.children || [], 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15,
        scrollTrigger: {
          trigger: departmentsRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const departments = {
    science: {
      name: "Faculty of Science",
      description: "Advancing scientific knowledge through research and innovation",
      subjects: [
        {
          name: "Physics",
          hod: "Dr. N. P. Sinha",
          courses: ["B.Sc. Physics", "M.Sc. Physics"],
          faculty: 8,
          labs: 3,
          icon: Atom,
          contact: "physics@stcolumba.ac.in"
        },
        {
          name: "Chemistry",
          hod: "Dr. Shashi Bala",
          courses: ["B.Sc. Chemistry", "M.Sc. Chemistry"],
          faculty: 10,
          labs: 4,
          icon: Microscope,
          contact: "chemistry@stcolumba.ac.in"
        },
        {
          name: "Mathematics",
          hod: "Prof. R. Jha",
          courses: ["B.Sc. Mathematics", "M.Sc. Mathematics"],
          faculty: 12,
          labs: 2,
          icon: Calculator,
          contact: "math@stcolumba.ac.in"
        },
        {
          name: "Computer Science",
          hod: "Prof. A. K. Sharma",
          courses: ["B.Sc. Computer Science", "BCA", "MCA"],
          faculty: 15,
          labs: 5,
          icon: Monitor,
          contact: "cs@stcolumba.ac.in"
        },
        {
          name: "Botany",
          hod: "Dr. Priya Kumari",
          courses: ["B.Sc. Botany", "M.Sc. Botany"],
          faculty: 6,
          labs: 2,
          icon: Leaf,
          contact: "botany@stcolumba.ac.in"
        },
        {
          name: "Zoology",
          hod: "Prof. S. K. Mishra",
          courses: ["B.Sc. Zoology", "M.Sc. Zoology"],
          faculty: 7,
          labs: 3,
          icon: Microscope,
          contact: "zoology@stcolumba.ac.in"
        }
      ]
    },
    arts: {
      name: "Faculty of Arts",
      description: "Nurturing critical thinking and cultural understanding",
      subjects: [
        {
          name: "English",
          hod: "Dr. Rita Kumari",
          courses: ["B.A. English", "M.A. English"],
          faculty: 10,
          labs: 1,
          icon: BookOpen,
          contact: "english@stcolumba.ac.in"
        },
        {
          name: "Hindi",
          hod: "Prof. Rajesh Kumar",
          courses: ["B.A. Hindi", "M.A. Hindi"],
          faculty: 8,
          labs: 1,
          icon: PenTool,
          contact: "hindi@stcolumba.ac.in"
        },
        {
          name: "History",
          hod: "Prof. Anil Verma",
          courses: ["B.A. History", "M.A. History"],
          faculty: 6,
          labs: 0,
          icon: Globe,
          contact: "history@stcolumba.ac.in"
        },
        {
          name: "Political Science",
          hod: "Dr. Sunita Singh",
          courses: ["B.A. Political Science", "M.A. Political Science"],
          faculty: 7,
          labs: 0,
          icon: Award,
          contact: "polsci@stcolumba.ac.in"
        },
        {
          name: "Economics",
          hod: "Prof. K. P. Sinha",
          courses: ["B.A. Economics", "M.A. Economics"],
          faculty: 9,
          labs: 1,
          icon: Coins,
          contact: "economics@stcolumba.ac.in"
        }
      ]
    },
    commerce: {
      name: "Faculty of Commerce",
      description: "Building future business leaders and entrepreneurs",
      subjects: [
        {
          name: "Commerce",
          hod: "Prof. S. P. Sinha",
          courses: ["B.Com", "M.Com"],
          faculty: 12,
          labs: 2,
          icon: Coins,
          contact: "commerce@stcolumba.ac.in"
        },
        {
          name: "Business Administration",
          hod: "Dr. Neetu Sharma",
          courses: ["BBA", "MBA"],
          faculty: 8,
          labs: 1,
          icon: Award,
          contact: "bba@stcolumba.ac.in"
        },
        {
          name: "Accountancy",
          hod: "Prof. R. K. Pandey",
          courses: ["B.Com (Accountancy)", "M.Com (Accountancy)"],
          faculty: 6,
          labs: 1,
          icon: Calculator,
          contact: "accounts@stcolumba.ac.in"
        }
      ]
    },
    education: {
      name: "Faculty of Education",
      description: "Shaping the educators of tomorrow",
      subjects: [
        {
          name: "Education",
          hod: "Dr. Manoj Kumar",
          courses: ["B.Ed.", "M.Ed.", "Diploma in Education"],
          faculty: 10,
          labs: 2,
          icon: GraduationCap,
          contact: "education@stcolumba.ac.in"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary bg-white/10 border-white/20">
              Academic Excellence • Diverse Disciplines
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text">
              Our Departments
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Discover our comprehensive range of academic departments, each committed to 
              excellence in teaching, research, and student development.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">25+</div>
                <div className="text-white/80">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">200+</div>
                <div className="text-white/80">Faculty Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-white/80">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">20+</div>
                <div className="text-white/80">Research Labs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Navigation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs value={selectedDept} onValueChange={setSelectedDept} className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-primary">Academic Faculties</h2>
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="science" className="flex flex-col gap-2 p-4">
                  <Atom className="h-6 w-6" />
                  <span>Science</span>
                </TabsTrigger>
                <TabsTrigger value="arts" className="flex flex-col gap-2 p-4">
                  <BookOpen className="h-6 w-6" />
                  <span>Arts</span>
                </TabsTrigger>
                <TabsTrigger value="commerce" className="flex flex-col gap-2 p-4">
                  <Coins className="h-6 w-6" />
                  <span>Commerce</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex flex-col gap-2 p-4">
                  <GraduationCap className="h-6 w-6" />
                  <span>Education</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {Object.entries(departments).map(([key, faculty]) => (
              <TabsContent key={key} value={key}>
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold mb-4 text-primary">{faculty.name}</h3>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{faculty.description}</p>
                </div>
                
                <div ref={departmentsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {faculty.subjects.map((subject, index) => {
                    const Icon = subject.icon;
                    return (
                      <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-primary">{subject.name}</h4>
                              <p className="text-muted-foreground">Department</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-primary mb-2">Head of Department</h5>
                              <p className="text-muted-foreground">{subject.hod}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-primary mb-2">Courses Offered</h5>
                              <div className="space-y-1">
                                {subject.courses.map((course, idx) => (
                                  <Badge key={idx} variant="secondary" className="mr-2 mb-1">
                                    {course}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{subject.faculty} Faculty</span>
                              </div>
                              {subject.labs > 0 && (
                                <div className="flex items-center gap-1">
                                  <Monitor className="h-4 w-4" />
                                  <span>{subject.labs} Labs</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="pt-4 border-t">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  <span>{subject.contact}</span>
                                </div>
                                <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Explore our programs and find the perfect academic path that aligns with your goals and aspirations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 group relative overflow-hidden" onClick={() => window.location.href = '/admissions'}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <GraduationCap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Admission Info</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Phone className="mr-2 h-5 w-5" />
              Contact Admissions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Departments;