import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MechanicDashboard: React.FC = () => {

  const { user, isMechanic } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ==============================
     CHECK LOGIN + LOAD REQUESTS
  ============================== */
  useEffect(() => {

    if (!user) {
      navigate('/login?type=mechanic');
      return;
    }

    if (!isMechanic) {
      navigate('/user/dashboard');
      return;
    }

    loadRequests();

  }, [user]);

  /* ==============================
     LOAD REQUESTS
  ============================== */
  const loadRequests = async () => {
    try {

      const reqRes = await fetch(
        `http://localhost:5000/api/service-requests/mechanic/${user?._id}`
      );

      const reqData = await reqRes.json();
      setRequests(reqData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     UPDATE STATUS
  ============================== */
  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/service-requests/${requestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }
      );

      toast({
        title: "Status Updated",
        description: "Request updated successfully"
      });

      loadRequests();

    } catch {
      toast({
        title: "Error",
        description: "Unable to update status",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Layout>
        <div className="p-10 text-center">
          <h2 className="text-xl font-semibold">
            Loading mechanic dashboard...
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user.name}! 🔧
        </h1>

        {/* PROFILE */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>

          <CardContent>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Mobile:</b> {user.mobile}</p>
          </CardContent>
        </Card>

        {/* REQUESTS */}
        <Card>
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
          </CardHeader>

          <CardContent>

            {requests.length === 0 ? (
              <p>No requests yet</p>
            ) : (
              requests.map(req => (
                <div key={req._id} className="border p-4 mb-3 rounded-lg">

                  <h4 className="font-semibold">{req.problemType}</h4>
                  <p>{req.description}</p>

                  <p className="text-sm text-muted-foreground">
                    User: {req.userId}
                  </p>

                  {req.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() =>
                          handleStatusChange(req._id, 'accepted')
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(req._id, 'cancelled')
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  )}

                </div>
              ))
            )}

          </CardContent>
        </Card>

      </div>
    </Layout>
  );
};

export default MechanicDashboard;
