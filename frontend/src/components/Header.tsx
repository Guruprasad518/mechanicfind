import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Wrench, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header: React.FC = () => {
  const { user, logout, isMechanic } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              MechFind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link 
                  to={isMechanic ? '/mechanic/dashboard' : '/user/dashboard'}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {isMechanic ? 'Mechanic' : 'User'}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Login
                </Link>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {isMechanic ? 'Mechanic' : 'User'}
                  </span>
                </div>
                <Link 
                  to={isMechanic ? '/mechanic/dashboard' : '/user/dashboard'}
                  className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
