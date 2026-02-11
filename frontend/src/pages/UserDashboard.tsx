import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Phone,
  Mail,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ServiceRequest {
  _id: string;
  problemType: string;
  description: string;
  mechanicName: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
  location: {
    address: string;
  };
}

const UserDashboard: React.FC = () => {

  const { user, isMechanic } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load requests when user is ready
  useEffect(() => {

    if (!user) {
      navigate('/login');
      return;
    }

    if (isMechanic) {
      navigate('/mechanic/dashboard');
      return;
    }

    loadRequests();

  }, [user, isMechanic, navigate]);

  // ✅ Load from backend API
  const loadRequests = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/service-requests/user/${user?._id}`
      );

      const data = await res.json();

      setRequests(
        data.sort(
          (a: ServiceRequest, b: ServiceRequest) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );

    } catch (err) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
            <AlertCircle className="w-3 h-3" /> Accepted
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-IN');

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Find nearby mechanics and get help for your vehicle breakdown
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p><b>Name:</b> {user.name}</p>
              <p><b>Mobile:</b> {user.mobile}</p>
              <p><b>Email:</b> {user.email}</p>
            </CardContent>
          </Card>

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            {/* Search Button */}
            <Card>
              <CardContent className="p-6 text-center">
                <Button onClick={() => navigate('/search-mechanic')}>
                  <Search className="w-4 h-4 mr-2" />
                  Search Mechanic
                </Button>
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <p>Loading...</p>
                ) : requests.length === 0 ? (
                  <p>No service requests yet</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map(req => (
                      <div key={req._id} className="p-3 border rounded-lg">

                        <div className="flex justify-between">
                          <h4>{req.problemType}</h4>
                          {getStatusBadge(req.status)}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Mechanic: {req.mechanicName}
                        </p>

                        <p className="text-sm">{req.description}</p>

                        <div className="text-xs text-muted-foreground">
                          📍 {req.location.address}
                        </div>

                        <div className="text-xs">
                          {formatDate(req.createdAt)}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
