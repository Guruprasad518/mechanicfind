import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";

const problemTypes = [
  "Engine Problem",
  "Flat Tyre",
  "Battery Issue",
  "Fuel Problem",
  "Other"
];

const SearchMechanic: React.FC = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const [location, setLocation] =
    useState<{ lat: number; lng: number } | null>(null);

  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  /* ---------------- GET LOCATION ---------------- */
  const handleGetLocation = () => {

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation not supported",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };

        setLocation(loc);

        toast({
          title: "Location captured",
          description: "GPS location detected"
        });
      },
      () => {
        toast({
          title: "Location error",
          description: "Please allow location permission",
          variant: "destructive"
        });
      }
    );
  };

  const mapLink =
    location &&
    `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  /* ---------------- SEARCH MECHANICS ---------------- */
  const handleSearch = async () => {

    if (!location) {
      toast({
        title: "Location required",
        description: "Click Get Location first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/mechanics/nearby",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: location.lat,
            lng: location.lng,
            radius: 10
          })
        }
      );

      const data = await res.json();
      setMechanics(data);

      toast({
        title: "Search Complete",
        description: `${data.length} mechanics found`
      });

    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  /* ---------------- REQUEST SERVICE ---------------- */
  const handleRequestService = async (mechanic: any) => {

    try {
      await fetch(
        "http://localhost:5000/api/service-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?._id,
            mechanicId: mechanic._id,
            problemType,
            description,
            location: {
              ...location,
              address
            }
          })
        }
      );

      toast({
        title: "Request Sent",
        description: "Mechanic will contact you soon"
      });

      navigate("/user/dashboard");

    } catch {
      toast({
        title: "Error",
        description: "Request failed",
        variant: "destructive"
      });
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find a Mechanic</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Problem */}
            <select
              className="w-full border rounded-lg p-2"
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
            >
              <option value="">Select Problem</option>
              {problemTypes.map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>

            {/* Description */}
            <Textarea
              placeholder="Describe problem"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Address */}
            <Input
              placeholder="Address / Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Location */}
            <Button type="button" onClick={handleGetLocation}>
              <MapPin className="w-4 h-4 mr-2" />
              Get Location
            </Button>

            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                className="text-blue-500 underline text-sm"
              >
                View Location on Google Maps
              </a>
            )}

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Mechanics"}
            </Button>

          </CardContent>
        </Card>

        {/* RESULTS */}
        {mechanics.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mechanics.map((m) => (
              <Card key={m._id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{m.name}</h3>
                  <p>{m.mobile}</p>
                  <p className="text-sm text-muted-foreground">
                    {m.location?.address}
                  </p>

                  <Button
                    className="w-full mt-3"
                    onClick={() => handleRequestService(m)}
                  >
                    Request Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default SearchMechanic;
