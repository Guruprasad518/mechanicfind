import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, User as UserIcon } from 'lucide-react'; // Useful icons

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
        `https://mechanicfind.onrender.com/api/service-requests/mechanic/${user?._id}`
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
        title: status === 'accepted' ? "Request Accepted" : "Request Declined",
        description: status === 'accepted' 
          ? "The user has been notified that you are coming!" 
          : "Request updated successfully"
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
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-muted-foreground text-center py-4">No requests yet</p>
            ) : (
              requests.map(req => (
                <div key={req._id} className={`border p-5 mb-4 rounded-xl shadow-sm ${req.status === 'accepted' ? 'border-green-500 bg-green-50/30' : ''}`}>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-primary">{req.problemType}</h4>
                      <p className="text-gray-600 mt-1">{req.description}</p>
                    </div>
                    <div className="text-right">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                         req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                         req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {req.status}
                       </span>
                       {req.distanceKm && <p className="text-sm font-semibold mt-2 text-blue-600">{req.distanceKm} km away</p>}
                    </div>
                  </div>

                  <hr className="my-3" />

                  {/* USER DETAILS SECTION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <UserIcon size={18} className="text-gray-400" />
                      <span className="font-medium">{req.userName || "Customer"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-gray-400" />
                      <span>{req.userMobile || "No Mobile Provided"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* LOCATION LINK */}
                    {req.locationLink && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="flex gap-2"
                        onClick={() => window.open(req.locationLink, '_blank')}
                      >
                        <MapPin size={16} />
                        View Location on Maps
                      </Button>
                    )}

                    {/* ACTION BUTTONS */}
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(req._id, 'accepted')}
                        >
                          Accept Request
                        </Button>

                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleStatusChange(req._id, 'cancelled')}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                    
                    {req.status === 'accepted' && (
                      <p className="text-green-700 font-semibold flex items-center gap-2">
                         ✅ You have accepted this job.
                      </p>
                    )}
                  </div>

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