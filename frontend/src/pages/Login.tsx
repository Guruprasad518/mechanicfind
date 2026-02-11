import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Wrench, User, Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState<'user' | 'mechanic'>(
    searchParams.get('type') === 'mechanic' ? 'mechanic' : 'user'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Redirect after login
  useEffect(() => {
    if (user) {
      navigate(
        user.type === 'mechanic'
          ? '/mechanic/dashboard'
          : '/user/dashboard'
      );
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const result = await login(email, password, userType);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'Login successful',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: result.error || 'Invalid credentials',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">

          <div className="bg-card rounded-3xl shadow-card p-8 animate-slide-up">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                {userType === 'mechanic' ? (
                  <Wrench className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <User className="w-8 h-8 text-primary-foreground" />
                )}
              </div>

              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                Welcome Back
              </h1>

              <p className="text-muted-foreground">
                Login to your {userType} account
              </p>
            </div>

            {/* User Type Toggle */}
            <div className="flex rounded-xl bg-muted p-1 mb-6">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium ${
                  userType === 'user'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                <User className="w-4 h-4 inline-block mr-2" />
                User
              </button>

              <button
                type="button"
                onClick={() => setUserType('mechanic')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium ${
                  userType === 'mechanic'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                <Wrench className="w-4 h-4 inline-block mr-2" />
                Mechanic
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                to={`/register${userType === 'mechanic' ? '?type=mechanic' : ''}`}
                className="text-primary font-medium hover:underline"
              >
                Register now
              </Link>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
