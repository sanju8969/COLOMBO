import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Users,
  Building,
  Car,
  Bus,
  Train,
  Plane
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Contact cards animation
    gsap.fromTo(contactRef.current?.children || [], 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15,
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 80%",
        }
      }
    );

    // Map animation
    gsap.fromTo(mapRef.current, 
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1,
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const contactInfo = [
    {
      title: "Main Office",
      icon: Building,
      details: [
        "St. Columba's College",
        "Hazaribagh, Jharkhand 825301",
        "India"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Phone Numbers",
      icon: Phone,
      details: [
        "Principal: +91-6546-222-333",
        "Admissions: +91-6546-222-334",
        "Academic Office: +91-6546-222-335"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Email Addresses",
      icon: Mail,
      details: [
        "info@stcolumba.ac.in",
        "admissions@stcolumba.ac.in",
        "principal@stcolumba.ac.in"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Office Hours",
      icon: Clock,
      details: [
        "Monday - Friday: 9:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 2:00 PM",
        "Sunday: Closed"
      ],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const departments = [
    { name: "Admissions Office", email: "admissions@stcolumba.ac.in", phone: "+91-6546-222-334" },
    { name: "Academic Office", email: "academic@stcolumba.ac.in", phone: "+91-6546-222-335" },
    { name: "Student Affairs", email: "students@stcolumba.ac.in", phone: "+91-6546-222-336" },
    { name: "Library", email: "library@stcolumba.ac.in", phone: "+91-6546-222-337" },
    { name: "Accounts Office", email: "accounts@stcolumba.ac.in", phone: "+91-6546-222-338" },
    { name: "Hostel Office", email: "hostel@stcolumba.ac.in", phone: "+91-6546-222-339" }
  ];

  const transportInfo = [
    {
      mode: "By Road",
      icon: Car,
      description: "Hazaribagh is well connected by road. Regular bus services available from major cities.",
      distance: "From Ranchi: 89 km (2 hours)"
    },
    {
      mode: "By Rail",
      icon: Train,
      description: "Nearest railway station is Koderma (32 km) on Delhi-Howrah main line.",
      distance: "From Koderma: 32 km (45 minutes)"
    },
    {
      mode: "By Air",
      icon: Plane,
      description: "Nearest airport is Birsa Munda Airport, Ranchi.",
      distance: "From Ranchi Airport: 95 km (2.5 hours)"
    },
    {
      mode: "Local Transport",
      icon: Bus,
      description: "Auto-rickshaws, taxis, and local buses available within the city.",
      distance: "City buses every 10-15 minutes"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary bg-white/10 border-white/20">
              Get in Touch • We're Here to Help
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Have questions about admissions, academics, or campus life? 
              We're here to help you every step of the way.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-white/80">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">6</div>
                <div className="text-white/80">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">125+</div>
                <div className="text-white/80">Years Legacy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">28</div>
                <div className="text-white/80">Acre Campus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Get in Touch</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple ways to reach us. Choose the most convenient option for you.
            </p>
          </div>
          
          <div ref={contactRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${info.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-primary">{info.title}</h3>
                    <div className="space-y-2 text-muted-foreground">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm leading-relaxed">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-primary flex items-center gap-3">
                <MessageCircle className="h-8 w-8" />
                Send us a Message
              </h2>
              <Card className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Full Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Phone Number
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Subject *
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Subject of your inquiry"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe your inquiry in detail..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Location */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-primary flex items-center gap-3">
                <MapPin className="h-8 w-8" />
                Find Us
              </h2>
              <div ref={mapRef} className="space-y-6">
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-6">
                      <div className="text-center text-primary">
                        <MapPin className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-lg font-semibold">Interactive Map</p>
                        <p className="text-sm text-muted-foreground">St. Columba's College, Hazaribagh</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-primary mb-2">St. Columba's College</h3>
                      <p className="text-muted-foreground mb-4">
                        Hazaribagh, Jharkhand 825301, India
                      </p>
                      <Button variant="outline" className="w-full">
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">Department Contacts</h2>
            <p className="text-xl text-muted-foreground">Direct contact information for specific departments</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">{dept.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{dept.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{dept.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Reach */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary">How to Reach Us</h2>
            <p className="text-xl text-muted-foreground">Multiple transportation options to reach our campus</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transportInfo.map((transport, index) => {
              const Icon = transport.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-3">{transport.mode}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {transport.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transport.distance}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Visit Our Campus</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experience the beauty and academic atmosphere of St. Columba's College firsthand. 
            Schedule a campus tour today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Users className="mr-2 h-5 w-5" />
              Schedule Campus Tour
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Phone className="mr-2 h-5 w-5" />
              Call Admissions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;