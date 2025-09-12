import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  GraduationCap,
  Award,
  BookOpen,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import collegeLogo from '@/assets/college-logo.png';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Academics', path: '/academics' },
    { name: 'Notices & Events', path: '/notices' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const academicLinks = [
    { name: 'Science Faculty', path: '/departments/science' },
    { name: 'Arts Faculty', path: '/departments/arts' },
    { name: 'Commerce Faculty', path: '/departments/commerce' },
    { name: 'B.Ed. Program', path: '/departments/bed' },
    { name: 'Library', path: '/facilities/library' },
    { name: 'Research', path: '/academics/research' },
  ];

  const resourceLinks = [
    { name: 'Student Portal', path: '/student-portal' },
    { name: 'Faculty Portal', path: '/faculty-portal' },
    { name: 'Admin Dashboard', path: '/admin' },
    { name: 'Online Courses', path: '/academics/online' },
    { name: 'Career Guidance', path: '/services/career' },
    { name: 'Alumni Network', path: '/alumni' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="section-padding">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* College Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img 
                  src={collegeLogo} 
                  alt="St. Columba's College" 
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <h3 className="text-lg font-display font-bold">
                    St. Columba's College
                  </h3>
                  <p className="text-sm text-primary-foreground/80">
                    Hazaribagh, Jharkhand
                  </p>
                </div>
              </div>
              
              <p className="text-primary-foreground/90 leading-relaxed">
                A premier institution established in 1899 by the Jesuits, dedicated to academic excellence and character formation. NAAC accredited and affiliated with Vinoba Bhave University.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-secondary flex-shrink-0" />
                  <span>Hazaribagh, Jharkhand 825301, India</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-secondary flex-shrink-0" />
                  <span>+91-6546-272XXX</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-secondary flex-shrink-0" />
                  <span>admin@stcolumbascollege.edu.in</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe size={16} className="text-secondary flex-shrink-0" />
                  <span>www.stcolumbascollege.edu.in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-display font-semibold text-secondary">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-primary-foreground/90 hover:text-secondary smooth-transition flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 smooth-transition" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-display font-semibold text-secondary">
                Academics
              </h4>
              <ul className="space-y-3">
                {academicLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-primary-foreground/90 hover:text-secondary smooth-transition flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 smooth-transition" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Social */}
            <div className="space-y-6">
              <h4 className="text-lg font-display font-semibold text-secondary">
                Resources
              </h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-primary-foreground/90 hover:text-secondary smooth-transition flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 smooth-transition" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div className="space-y-4">
                <h5 className="font-semibold text-secondary">Follow Us</h5>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: '#' },
                    { icon: Twitter, href: '#' },
                    { icon: Instagram, href: '#' },
                    { icon: Linkedin, href: '#' }
                  ].map(({ icon: Icon, href }, index) => (
                    <a
                      key={index}
                      href={href}
                      className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-secondary hover:text-primary smooth-transition"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* College Stats Banner */}
      <div className="bg-primary-foreground/10 py-8">
        <div className="container-width">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                <Users className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold text-secondary">3000+</div>
              <div className="text-sm text-primary-foreground/80">Students</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                <GraduationCap className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold text-secondary">150+</div>
              <div className="text-sm text-primary-foreground/80">Faculty</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                <BookOpen className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold text-secondary">25+</div>
              <div className="text-sm text-primary-foreground/80">Courses</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto">
                <Award className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold text-secondary">125+</div>
              <div className="text-sm text-primary-foreground/80">Years Legacy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-primary-foreground/5 py-6">
        <div className="container-width">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-primary-foreground/80">
              © 2024 St. Columba's College, Hazaribagh. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-primary-foreground/80 hover:text-secondary smooth-transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/80 hover:text-secondary smooth-transition">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-primary-foreground/80 hover:text-secondary smooth-transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;