import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Bell, 
  FileText, 
  Users, 
  Award,
  ExternalLink,
  Download
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NoticesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const noticesRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

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
      noticesRef.current?.children,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    )
    .fromTo(
      eventsRef.current?.children,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
      '-=0.5'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const notices = [
    {
      title: 'Admission 2024-25 - Last Date Extended',
      date: '2024-03-15',
      time: '10:00 AM',
      type: 'Important',
      description: 'Last date for submission of admission forms has been extended to March 25, 2024.',
      priority: 'high',
      link: '/notices/admission-2024-extended'
    },
    {
      title: 'Annual Examination Time Table',
      date: '2024-03-12',
      time: '2:30 PM', 
      type: 'Academic',
      description: 'Final examination schedule for all courses has been published on the student portal.',
      priority: 'medium',
      link: '/notices/exam-timetable-2024'
    },
    {
      title: 'Library New Timing - Summer Schedule',
      date: '2024-03-10',
      time: '9:00 AM',
      type: 'Information',
      description: 'Library will operate with extended hours from April 1st onwards.',
      priority: 'low',
      link: '/notices/library-timing-summer'
    },
    {
      title: 'Scholarship Applications Open',
      date: '2024-03-08',
      time: '11:30 AM',
      type: 'Opportunity',
      description: 'Merit-based scholarship applications are now open for eligible students.',
      priority: 'high',
      link: '/notices/scholarship-2024'
    }
  ];

  const events = [
    {
      title: 'Annual Cultural Fest - Columba Carnival 2024',
      date: '2024-03-25',
      time: '9:00 AM',
      venue: 'Main Auditorium & Campus Grounds',
      type: 'Cultural',
      description: 'Three-day cultural extravaganza featuring competitions, performances, and exhibitions.',
      image: 'cultural-fest',
      link: '/events/columba-carnival-2024'
    },
    {
      title: 'National Science Day Celebration',
      date: '2024-02-28',
      time: '10:00 AM',
      venue: 'Science Block Auditorium',
      type: 'Academic',
      description: 'Special lectures, science exhibitions, and project presentations by students.',
      image: 'science-day',
      link: '/events/national-science-day-2024'
    },
    {
      title: 'Career Guidance Workshop',
      date: '2024-04-05',
      time: '2:00 PM',
      venue: 'Conference Hall',
      type: 'Workshop',
      description: 'Industry experts sharing insights on career opportunities and skill development.',
      image: 'career-workshop',
      link: '/events/career-guidance-workshop'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Important': return Bell;
      case 'Academic': return FileText;
      case 'Information': return Users;
      case 'Opportunity': return Award;
      default: return Bell;
    }
  };

  return (
    <section ref={sectionRef} className="section-padding bg-muted/20">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-1 gold-gradient rounded-full" />
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">
              Stay Updated
            </span>
            <div className="w-12 h-1 gold-gradient rounded-full" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary leading-tight">
            Latest 
            <span className="text-gradient-gold"> Updates</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stay informed about important notices, upcoming events, and campus activities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Recent Notices */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
                <Bell className="text-secondary" size={28} />
                Recent Notices
              </h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/notices">
                  View All
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>

            <div ref={noticesRef} className="space-y-4">
              {notices.map((notice, index) => {
                const TypeIcon = getTypeIcon(notice.type);
                return (
                  <div 
                    key={index}
                    className="bg-background rounded-xl p-6 card-shadow hover:shadow-elegant smooth-transition hover-lift group border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 smooth-transition">
                        <TypeIcon size={20} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-primary group-hover:text-secondary smooth-transition leading-tight">
                            {notice.title}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                            {notice.type}
                          </span>
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {notice.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{new Date(notice.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{notice.time}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => window.open(notice.link, '_blank')}>
                            <ExternalLink size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
                <Calendar className="text-secondary" size={28} />
                Upcoming Events
              </h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/events">
                  View All
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>

            <div ref={eventsRef} className="space-y-6">
              {events.map((event, index) => (
                <div 
                  key={index}
                  className="bg-background rounded-xl overflow-hidden card-shadow hover:shadow-elegant smooth-transition hover-lift group border"
                >
                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-primary to-college-crimson p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="text-3xl font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-sm opacity-90">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6 space-y-4">
                    <h4 className="font-bold text-primary group-hover:text-secondary smooth-transition">
                      {event.title}
                    </h4>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{event.time} • {event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="ghost" size="sm" onClick={() => {
                        // Create calendar event URL
                        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.date.replace(/-/g, '')}T${event.time.replace(/:/g, '')}00/${event.date.replace(/-/g, '')}T${event.time.replace(/:/g, '')}00&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.venue)}`;
                        window.open(calendarUrl, '_blank');
                      }}>
                        <Download size={14} />
                        Add to Calendar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.location.href = event.link}>
                        Learn More
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticesSection;