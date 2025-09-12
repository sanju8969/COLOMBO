import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap,
  FileText,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Play
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Admissions = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Process animation
    gsap.fromTo(processRef.current?.children || [], 
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.2,
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 80%",
        }
      }
    );

    // Programs animation
    gsap.fromTo(programsRef.current?.children || [], 
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.1,
        scrollTrigger: {
          trigger: programsRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const admissionProcess = [
    {
      step: 1,
      title: "Apply through Chancellor Portal",
      description: "Submit application through the centralized Jharkhand Universities portal",
      icon: FileText,
      timeline: "As per university schedule"
    },
    {
      step: 2,
      title: "Merit List Publication",
      description: "Check the merit list published online for selected candidates",
      icon: Award,
      timeline: "After application deadline"
    },
    {
      step: 3,
      title: "Document Verification",
      description: "Visit college with original certificates for verification",
      icon: CheckCircle,
      timeline: "As per schedule"
    },
    {
      step: 4,
      title: "Fee Payment & Admission",
      description: "Complete fee payment at the college to confirm admission",
      icon: DollarSign,
      timeline: "After verification"
    }
  ];

  const programs = {
    undergraduate: [
      {
        name: "B.A. (Honours/General)",
        duration: "3 Years",
        eligibility: "Class 12 with at least 50% marks",
        seats: "Limited seats",
        reservation: "SC-15%, ST-7.5%, OBC-27%",
        highlights: ["Multiple specializations", "UGC Recognized", "NAAC Accredited"]
      },
      {
        name: "B.Sc. (Honours/General)",
        duration: "3 Years", 
        eligibility: "Class 12 with 50% in relevant science subjects",
        seats: "Limited seats",
        reservation: "SC-15%, ST-7.5%, OBC-27%",
        highlights: ["Science specializations", "Research opportunities", "Modern labs"]
      },
      {
        name: "BCA",
        duration: "3 Years",
        eligibility: "Class 12 with 50% (preferably PCM/Computer Science)",
        seats: "Limited seats",
        reservation: "SC-15%, ST-7.5%, OBC-27%",
        highlights: ["Computer Applications", "Industry relevant", "Placement support"]
      },
      {
        name: "Biotechnology",
        duration: "3 Years",
        eligibility: "Class 12 with 50% (preferably PCM/Computer Science)",
        seats: "Limited seats",
        reservation: "SC-15%, ST-7.5%, OBC-27%",
        highlights: ["Modern biotechnology", "Research focus", "Industry connections"]
      }
    ]
  };

  const importantDates = [
    { event: "Chancellor Portal Opens", date: "Check University Schedule" },
    { event: "Application Submission", date: "Through Chancellor Portal" },
    { event: "Merit List Publication", date: "Online at College Website" },
    { event: "Document Verification", date: "As per College Schedule" },
    { event: "Semester Admission", date: "For Continuing Students" },
    { event: "Classes Begin", date: "Check Official Notices" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary bg-white/10 border-white/20">
              Admissions through Chancellor Portal • NAAC Grade A
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text">
              Join Our Legacy
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Apply through the centralized admission system for 
              St. Columba's College, Hazaribagh - Since 1899.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90 group relative overflow-hidden" 
                onClick={() => window.open('https://www.youtube.com/watch?v=your-video-id', '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-college-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Virtual Campus Tour</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-college-crimson rounded-full animate-pulse" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary group relative overflow-hidden" 
                onClick={() => window.open('https://ranchiuniversity.ac.in/assets/iqac/State%20wise%20analysis%20Reports-Jharkhand.pdf', '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FileText className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">NAAC Report</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-college-gold rounded-full animate-ping" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-primary">Important Dates</h2>
            <p className="text-xl text-muted-foreground">Stay updated with admission timeline</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-primary flex items-center justify-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Admission Schedule 2024-25
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {importantDates.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <span className="font-medium">{item.event}</span>
                      <Badge variant="outline" className="ml-4">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.date}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Admission Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              St. Columba's College follows the centralized admission system of Jharkhand Universities
            </p>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Important Note:</span>
              </div>
              <p className="text-amber-700 mt-2">
                The college does not allow direct admission through its website. 
                All admissions are processed through the Chancellor Portal.
              </p>
            </div>
          </div>
          <div ref={processRef} className="max-w-6xl mx-auto space-y-8">
            {admissionProcess.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center gap-8 group">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <Card className="group-hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Icon className="h-8 w-8 text-primary mt-1" />
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-primary mb-2">{step.title}</h3>
                            <p className="text-gray-700 text-lg mb-3">{step.description}</p>
                            <Badge variant="secondary" className="text-accent">
                              {step.timeline}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs & Courses */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Eligibility Criteria & Programs</h2>
            <p className="text-xl text-muted-foreground">Academic programs offered at St. Columba's College</p>
          </div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Eligibility Info */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Reservation Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15%</div>
                    <div className="text-sm font-medium">SC Category</div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">7.5%</div>
                    <div className="text-sm font-medium">ST Category</div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">27%</div>
                    <div className="text-sm font-medium">OBC (Non-Creamy Layer)</div>
                  </div>
                </div>
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  5% relaxation in eligibility marks for SC/ST candidates
                </p>
              </CardContent>
            </Card>

            {/* Programs */}
            <div ref={programsRef} className="grid md:grid-cols-2 gap-8">
              {programs.undergraduate.map((program, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{program.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{program.duration}</Badge>
                      <Badge variant="secondary">{program.seats}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Eligibility</h4>
                      <p className="text-sm text-muted-foreground">{program.eligibility}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Reservation</h4>
                      <p className="text-sm text-accent font-medium">{program.reservation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Program Highlights</h4>
                      <div className="space-y-1">
                        {program.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full group-hover:bg-primary-dark" onClick={() => window.open('https://stcchzb.ac.in/notice_category/admission/', '_blank')}>
                      View Admission Notices
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Links & Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Important Links & Resources</h2>
            <p className="text-xl text-muted-foreground">Essential resources for prospective students</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => window.open('https://stcchzb.ac.in/', '_blank')}>
              <CardContent className="p-6">
                <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2 text-primary">Official Website</h3>
                <p className="text-sm text-muted-foreground">Complete college information</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => window.open('https://stcchzb.ac.in/admission-policy/', '_blank')}>
              <CardContent className="p-6">
                <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2 text-primary">Admission Policy</h3>
                <p className="text-sm text-muted-foreground">Detailed admission guidelines</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => window.open('https://stcchzb.ac.in/notice_category/admission/', '_blank')}>
              <CardContent className="p-6">
                <AlertCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2 text-primary">Admission Notices</h3>
                <p className="text-sm text-muted-foreground">Latest merit lists & updates</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden" onClick={() => window.open('https://www.youtube.com/watch?v=your-video-id', '_blank')}>
              <div className="absolute inset-0 bg-gradient-to-r from-college-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <Award className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-bold mb-2 text-primary">Virtual Campus Tour</h3>
                <p className="text-sm text-muted-foreground">YouTube campus tour video</p>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-college-crimson rounded-full animate-pulse" />
              </CardContent>
            </Card>
          </div>

          {/* NAAC Accreditation */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-primary text-center flex items-center justify-center gap-2">
                  <Award className="h-8 w-8" />
                  NAAC Accreditation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-green-600">Grade A</div>
                    <div className="text-lg font-medium text-green-700">UGC Recognized</div>
                    <div className="text-sm text-muted-foreground">Affiliated to Vinoba Bhave University</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">Grade B++</div>
                    <div className="text-lg font-medium text-blue-700">State Accreditation</div>
                    <div className="text-sm text-muted-foreground">CGPA 2.85</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join St. Columba's College?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Be part of our 125+ year legacy of academic excellence. 
            Follow the centralized admission process through Chancellor Portal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" onClick={() => window.open('https://stcchzb.ac.in/', '_blank')}>
              <GraduationCap className="mr-2 h-5 w-5" />
              Visit Official Website
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => window.open('https://stcchzb.ac.in/notice_category/admission/', '_blank')}>
              <AlertCircle className="mr-2 h-5 w-5" />
              Check Admission Notices
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;