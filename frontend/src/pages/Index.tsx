import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  MapPin,
  Wrench,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Zap,
  Users,
  Search
} from 'lucide-react';

const Index: React.FC = () => {

  const { user, isMechanic } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Find mechanics within 2-5km radius instantly.',
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Get connected with available mechanics within minutes.',
    },
    {
      icon: Shield,
      title: 'Verified Mechanics',
      description: 'All mechanics are verified professionals.',
    },
    {
      icon: Star,
      title: 'Rated Services',
      description: 'Choose mechanics based on ratings and reviews.',
    },
  ];

  const problemTypes = [
    { name: 'Engine Issues', icon: '🔧' },
    { name: 'Flat Tyre', icon: '🛞' },
    { name: 'Battery Dead', icon: '🔋' },
    { name: 'Out of Fuel', icon: '⛽' },
    { name: 'Other Problems', icon: '🚗' },
  ];

  const stats = [
    { value: '500+', label: 'Mechanics' },
    { value: '10,000+', label: 'Users Helped' },
    { value: '50+', label: 'Cities' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  return (
    <Layout>

      {/* HERO */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Stranded on the Road?
            <br />
            <span className="text-primary">Find Help Fast!</span>
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with nearby verified mechanics instantly.
            Help is just a tap away.
          </p>

          {user ? (
            <Button asChild size="lg">
              <Link to={isMechanic ? '/mechanic/dashboard' : '/user/dashboard'}>
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          ) : (
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/register">Get Started</Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link to="/register?type=mechanic">
                  <Wrench className="mr-2 w-5 h-5" />
                  Join as Mechanic
                </Link>
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(feature => (
            <div key={feature.title} className="p-6 bg-card rounded-xl shadow">
              <feature.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>

            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/register">
                  <Users className="mr-2 w-5 h-5" />
                  Register as User
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/register?type=mechanic">
                  <Wrench className="mr-2 w-5 h-5" />
                  Register as Mechanic
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

    </Layout>
  );
};

export default Index;
