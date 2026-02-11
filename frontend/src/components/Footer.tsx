import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">MechFind</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Your trusted platform for emergency vehicle breakdown assistance. Find nearby mechanics instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-background/70 hover:text-background transition-colors text-sm">
                  User Login
                </Link>
              </li>
              <li>
                <Link to="/login?type=mechanic" className="text-background/70 hover:text-background transition-colors text-sm">
                  Mechanic Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/70 hover:text-background transition-colors text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Engine Repair</li>
              <li>Tyre Replacement</li>
              <li>Battery Service</li>
              <li>Fuel Assistance</li>
              <li>General Repairs</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="w-4 h-4" />
                <span>1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="w-4 h-4" />
                <span>support@mechfind.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Available across all major cities in India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} MechFind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
