import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

const specialtiesOptions = [
  { id: 'Engine', label: '🔧 Engine Repair' },
  { id: 'Tyre', label: '🛞 Tyre Service' },
  { id: 'Battery', label: '🔋 Battery Service' },
  { id: 'Fuel', label: '⛽ Fuel Assistance' },
  { id: 'Other', label: '🚗 Other Repairs' },
];

const Register: React.FC = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, user } = useAuth();

  const [userType, setUserType] =
    useState<'user' | 'mechanic'>('user');

  useEffect(() => {
    const type = searchParams.get('type');
    setUserType(type === 'mechanic' ? 'mechanic' : 'user');
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    specialties: [] as string[],
  });

  const [location, setLocation] =
    useState<{ lat: number; lng: number } | null>(null);

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(
        user.type === 'mechanic'
          ? '/mechanic/dashboard'
          : '/user/dashboard'
      );
    }
  }, [user, navigate]);

  const handleGetLocation = () => {

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "GPS not supported",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });

        toast({
          title: "Location detected",
          description: "GPS captured successfully"
        });

        setIsGettingLocation(false);
      },
      () => {
        toast({
          title: "Location Error",
          description: "Please allow location permission",
          variant: "destructive"
        });
        setIsGettingLocation(false);
      }
    );
  };

  const handleSpecialtyChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(id)
        ? prev.specialties.filter(s => s !== id)
        : [...prev.specialties, id]
    }));
  };

  const mapLink =
    location &&
    `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile ||
        !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (userType === 'mechanic') {
      if (!location) {
        toast({
          title: "Location required",
          variant: "destructive"
        });
        return;
      }

      if (formData.specialties.length === 0) {
        toast({
          title: "Select at least one specialty",
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);

    const result = await register({
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password,
      type: userType,

      ...(userType === 'mechanic' && {
        // ✅ ADDED FOR BACKEND STORAGE
        address: formData.address,
        latitude: location?.lat,
        longitude: location?.lng,

        // ✅ KEEPING YOUR OLD STRUCTURE SAFE
        location: {
          lat: location?.lat,
          lng: location?.lng,
          address: formData.address
        },

        specialties: formData.specialties
      })
    });

    if (!result.success) {
      toast({
        title: "Registration Failed",
        description: result.error || "Something went wrong",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <Layout showFooter={false}>
      <div className="flex justify-center py-10">
        <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Register as {userType}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input placeholder="Full Name"
              onChange={e =>
                setFormData(p => ({ ...p, name: e.target.value }))
              }
            />

            <Input placeholder="Mobile"
              onChange={e =>
                setFormData(p => ({ ...p, mobile: e.target.value }))
              }
            />

            <Input placeholder="Email"
              onChange={e =>
                setFormData(p => ({ ...p, email: e.target.value }))
              }
            />

            <Input type="password" placeholder="Password"
              onChange={e =>
                setFormData(p => ({ ...p, password: e.target.value }))
              }
            />

            <Input type="password" placeholder="Confirm Password"
              onChange={e =>
                setFormData(p => ({
                  ...p,
                  confirmPassword: e.target.value
                }))
              }
            />

            {userType === 'mechanic' && (
              <>
                <Input
                  placeholder="Workshop Address"
                  value={formData.address}
                  onChange={e =>
                    setFormData(p => ({
                      ...p,
                      address: e.target.value
                    }))
                  }
                />

                <Button type="button" onClick={handleGetLocation}>
                  <MapPin className="w-4 h-4 mr-2" />
                  {isGettingLocation
                    ? "Getting Location..."
                    : "Get Location"}
                </Button>

                {mapLink && (
                  <a
                    href={mapLink}
                    target="_blank"
                    className="text-blue-500 text-sm underline"
                  >
                    View Location on Google Maps
                  </a>
                )}

                <div>
                  <p className="font-medium mb-2">
                    Select Specialties
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {specialtiesOptions.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSpecialtyChange(s.id)}
                        className={`cursor-pointer border rounded-lg p-2 text-sm
                        ${formData.specialties.includes(s.id)
                          ? "bg-primary/10 border-primary"
                          : "border-gray-300"}`}
                      >
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
