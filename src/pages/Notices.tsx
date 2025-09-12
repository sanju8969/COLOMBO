import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell,
  Calendar,
  Search,
  Filter,
  Download,
  ExternalLink,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  AlertCircle,
  Info,
  CheckCircle,
  Star,
  ChevronRight
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Notices = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const noticesRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // Notices animation
    gsap.fromTo(noticesRef.current?.children || [], 
      { opacity: 0, x: -30 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.1,
        scrollTrigger: {
          trigger: noticesRef.current,
          start: "top 80%",
        }
      }
    );

    // Events animation
    gsap.fromTo(eventsRef.current?.children || [], 
      { opacity: 0, x: 30 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.1,
        scrollTrigger: {
          trigger: eventsRef.current,
          start: "top 80%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const sampleNotices = [
    {
      id: 1,
      title: "Important Update: Semester Examination Schedule",
      date: "2024-03-15",
      time: "10:00 AM",
      type: "exam",
      priority: "high",
      description: "The semester examination schedule has been updated. Please check the revised dates and venues for your respective courses.",
      link: "/downloads/exam-schedule.pdf",
      department: "Academic Office"
    }
  ];

  const transformedNotices = notices.map(notice => ({
    id: notice.id,
    title: notice.title,
    date: new Date(notice.created_at).toLocaleDateString(),
    time: new Date(notice.created_at).toLocaleTimeString(),
    type: notice.type,
    priority: notice.priority === 3 ? 'high' : notice.priority === 2 ? 'medium' : 'low',
    description: notice.content,
    link: "#",
    department: notice.target_audience || "General"
  }));

  const events = [
    {
      id: 1,
      title: "Annual Cultural Festival - Columba Fest 2024",
      date: "2024-04-15",
      endDate: "2024-04-17",
      time: "9:00 AM",
      venue: "Main Auditorium & Campus Grounds",
      type: "cultural",
      description: "Three-day cultural extravaganza featuring music, dance, drama, and literary competitions. Open to all students.",
      image: "/api/placeholder/400/200",
      registrationLink: "/events/columba-fest-2024",
      organizer: "Cultural Committee"
    },
    {
      id: 2,
      title: "National Science Day Celebration",
      date: "2024-02-28",
      time: "10:00 AM",
      venue: "Science Block Auditorium",
      type: "academic",
      description: "Commemorating the discovery of the Raman Effect with science exhibitions, lectures, and competitions.",
      image: "/api/placeholder/400/200",
      registrationLink: "/events/science-day-2024",
      organizer: "Science Faculty"
    },
    {
      id: 3,
      title: "Career Counseling Workshop",
      date: "2024-03-25",
      time: "2:00 PM",
      venue: "Conference Hall",
      type: "workshop",
      description: "Expert guidance on career planning, interview skills, and industry trends for final year students.",
      image: "/api/placeholder/400/200",
      registrationLink: "/events/career-workshop",
      organizer: "Placement Cell"
    },
    {
      id: 4,
      title: "Inter-College Sports Meet",
      date: "2024-03-30",
      endDate: "2024-04-01",
      time: "8:00 AM",
      venue: "Sports Complex",
      type: "sports",
      description: "Annual inter-college sports competition featuring athletics, cricket, football, and indoor games.",
      image: "/api/placeholder/400/200",
      registrationLink: "/events/sports-meet-2024",
      organizer: "Sports Committee"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exam": return <BookOpen className="h-4 w-4" />;
      case "announcement": return <Bell className="h-4 w-4" />;
      case "scholarship": return <Award className="h-4 w-4" />;
      case "maintenance": return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "cultural": return "from-purple-500 to-pink-500";
      case "academic": return "from-blue-500 to-cyan-500";
      case "workshop": return "from-green-500 to-emerald-500";
      case "sports": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const filteredNotices = transformedNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || notice.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-primary bg-white/10 border-white/20">
              Stay Updated • Stay Connected
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text">
              Notices & Events
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Stay informed about the latest announcements, important notices, 
              and exciting events happening at St. Columba's College.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{transformedNotices.length}</div>
                <div className="text-white/80">Active Notices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{events.length}</div>
                <div className="text-white/80">Upcoming Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">5</div>
                <div className="text-white/80">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">24/7</div>
                <div className="text-white/80">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notices and events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterType === "exam" ? "default" : "outline"}
                onClick={() => setFilterType("exam")}
                size="sm"
              >
                Exams
              </Button>
              <Button
                variant={filterType === "announcement" ? "default" : "outline"}
                onClick={() => setFilterType("announcement")}
                size="sm"
              >
                Announcements
              </Button>
              <Button
                variant={filterType === "scholarship" ? "default" : "outline"}
                onClick={() => setFilterType("scholarship")}
                size="sm"
              >
                Scholarships
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="notices" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="notices" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notices
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>

            {/* Notices Tab */}
            <TabsContent value="notices">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-primary">Recent Notices</h2>
                <p className="text-xl text-muted-foreground">Important announcements and updates</p>
              </div>
              
              <div ref={noticesRef} className="space-y-6 max-w-4xl mx-auto">
                {filteredNotices.map((notice) => (
                  <Card key={notice.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {getTypeIcon(notice.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-primary group-hover:text-primary-dark transition-colors">
                                {notice.title}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(notice.priority)}`}
                              >
                                {notice.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{notice.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{notice.time}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {notice.department}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {notice.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {notice.link !== "#" && (
                            <Button variant="outline" size="sm" onClick={() => window.open(notice.link, '_blank')}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-primary" onClick={() => window.location.href = `/notices/${notice.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-primary">Upcoming Events</h2>
                <p className="text-xl text-muted-foreground">Join us for exciting college activities</p>
              </div>
              
              <div ref={eventsRef} className="grid md:grid-cols-2 gap-8">
                {events.map((event) => (
                  <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className={`h-48 bg-gradient-to-r ${getEventTypeColor(event.type)} relative`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {event.type}
                        </Badge>
                        <div className="text-right text-white">
                          <div className="text-2xl font-bold">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-sm">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-dark transition-colors">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {event.date}
                            {event.endDate && ` - ${event.endDate}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{event.organizer}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="flex gap-3">
                        <Button className="flex-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          Add to Calendar
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Stay in the Loop</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss important updates, 
            events, or announcements from St. Columba's College.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email address" 
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Bell className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notices;