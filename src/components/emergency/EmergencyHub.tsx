import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import {
  Phone,
  AlertTriangle,
  Info,
  MapPin,
  Shield,
  Users,
  Heart,
} from "lucide-react";
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: string;
}

interface DisasterAlert {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  date: string;
  location: string;
}

interface EmergencyHubProps {
  contacts?: EmergencyContact[];
  alerts?: DisasterAlert[];
}

const EmergencyHub = ({
  contacts = [
    { id: "1", name: "Local Police Station", phone: "100", type: "police" },
    { id: "2", name: "Medical Emergency", phone: "108", type: "medical" },
    { id: "3", name: "Fire Department", phone: "101", type: "fire" },
    { id: "4", name: "Tourist Helpline", phone: "1363", type: "tourist" },
    { id: "5", name: "Women Helpline", phone: "1091", type: "women" },
  ],
  alerts = [
    {
      id: "1",
      title: "Heavy Rainfall Warning",
      description:
        "Heavy rainfall expected in Darjeeling and Kalimpong districts. Possibility of landslides in hilly areas.",
      severity: "high",
      date: "2023-07-15",
      location: "Darjeeling, Kalimpong",
    },
    {
      id: "2",
      title: "Road Closure Alert",
      description:
        "Temporary road closure on NH-31 between Siliguri and Sevoke due to maintenance work.",
      severity: "medium",
      date: "2023-07-14",
      location: "Siliguri-Sevoke Road",
    },
    {
      id: "3",
      title: "Wildlife Sighting",
      description:
        "Elephant herd crossing reported near Chapramari Wildlife Sanctuary. Tourists advised to avoid the area during evening hours.",
      severity: "low",
      date: "2023-07-13",
      location: "Chapramari Wildlife Sanctuary",
    },
  ],
}: EmergencyHubProps) => {
  const [location, setLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSOSClick = () => {
    // In a real app, this would trigger location sharing and emergency services connection
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        // Here would be code to send this location to emergency services
        alert(
          "SOS signal sent with your location. Emergency services have been notified.",
        );
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Could not get your location. Please call emergency services directly.",
        );
      },
    );
  };

  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "bg-red-100 border-red-500 text-red-700";
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "low":
        return "bg-blue-100 border-blue-500 text-blue-700";
      default:
        return "";
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case "police":
        return <Shield className="h-5 w-5 text-blue-600" />;
      case "medical":
        return <Heart className="h-5 w-5 text-red-600" />;
      case "fire":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "tourist":
        return <Info className="h-5 w-5 text-green-600" />;
      case "women":
        return <Users className="h-5 w-5 text-purple-600" />;
      default:
        return <Phone className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Emergency Support Hub
        </h1>
        <p className="text-gray-600">
          Quick access to emergency services and important alerts for North
          Bengal travelers
        </p>
      </div>

      {/* SOS Button Section */}
      <div className="mb-8 flex flex-col items-center justify-center">
        <Button
          onClick={handleSOSClick}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-12 rounded-full text-xl shadow-lg animate-pulse"
        >
          SOS EMERGENCY
        </Button>
        <p className="mt-4 text-gray-600 text-center max-w-md">
          Press the SOS button to share your live location with emergency
          services and get immediate assistance.
        </p>
        {location && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
            <p className="flex items-center">
              <MapPin className="mr-2" /> Location shared:{" "}
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="w-full flex justify-center mb-6">
          <TabsTrigger value="alerts" className="flex-1 max-w-xs">
            Disaster Alerts
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex-1 max-w-xs">
            Emergency Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            Current Alerts & Warnings
          </h2>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              className={`mb-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <AlertTitle className="font-bold">{alert.title}</AlertTitle>
                  <AlertDescription>
                    <p>{alert.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {alert.location}
                      </span>
                      <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                        Date: {new Date(alert.date).toLocaleDateString()}
                      </span>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </TabsContent>

        <TabsContent
          value="contacts"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              className="overflow-hidden border-l-4 border-l-blue-500"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  {getContactIcon(contact.type)}
                  <CardTitle className="ml-2 text-lg">{contact.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-2xl font-bold text-blue-600">
                  {contact.phone}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={() => window.open(`tel:${contact.phone}`, "_self")}
                >
                  <Phone className="mr-2 h-4 w-4" /> Call Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Safety Tips
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Always keep emergency contact numbers saved in your phone</li>
          <li>Share your travel itinerary with family or friends</li>
          <li>Check weather forecasts before traveling to hilly regions</li>
          <li>
            Carry basic first aid supplies during treks and outdoor activities
          </li>
          <li>Download offline maps of the areas you plan to visit</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyHub;
