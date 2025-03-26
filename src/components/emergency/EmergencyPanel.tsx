import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Phone,
  AlertTriangle,
  Shield,
  Share2,
  Flame,
  HelpCircle,
  User,
} from "lucide-react";

interface EmergencyPanelProps {
  onEmergencyCall?: (serviceType: string, phoneNumber: string) => void;
  onShareLocation?: () => void;
  isExpanded?: boolean;
}

const EmergencyPanel = ({
  // onEmergencyCall = (serviceType, phoneNumber) => {() => window.open(`tel:${phoneNumber}`, "_self")},
  onShareLocation = () => console.log("Location shared"),
  isExpanded = false,
}: EmergencyPanelProps) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const contacts = [
    { id: "1", name: "Local Police Station", phone: "100", type: "police" },
    { id: "2", name: "Medical Emergency", phone: "108", type: "medical" },
    { id: "3", name: "Fire Department", phone: "101", type: "fire" },
    { id: "4", name: "Tourist Helpline", phone: "1363", type: "tourist" },
    { id: "5", name: "Women Helpline", phone: "1091", type: "women" },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "police":
        return <Shield className="h-6 w-6 text-blue-500 mb-1" />;
      case "medical":
        return <Phone className="h-6 w-6 text-red-500 mb-1" />;
      case "fire":
        return <Flame className="h-6 w-6 text-orange-500 mb-1" />;
      case "tourist":
        return <HelpCircle className="h-6 w-6 text-green-500 mb-1" />;
      case "women":
        return <User className="h-6 w-6 text-purple-500 mb-1" />;
      default:
        return <Phone className="h-6 w-6 text-gray-500 mb-1" />;
    }
  };

  const getClassesForType = (type: string) => {
    switch (type) {
      case "police":
        return "bg-blue-50 hover:bg-blue-100 border-blue-200";
      case "medical":
        return "bg-red-50 hover:bg-red-100 border-red-200";
      case "fire":
        return "bg-orange-50 hover:bg-orange-100 border-orange-200";
      case "tourist":
        return "bg-green-50 hover:bg-green-100 border-green-200";
      case "women":
        return "bg-purple-50 hover:bg-purple-100 border-purple-200";
      default:
        return "bg-gray-50 hover:bg-gray-100 border-gray-200";
    }
  };

  const togglePanel = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
      <div className="container mx-auto px-4 py-3">
        {!expanded ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Emergency Assistance</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center space-x-1"
                onClick={togglePanel}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>SOS</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Emergency Assistance
              </h3>
              <Button variant="outline" size="sm" onClick={togglePanel}>
                Minimize
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant="outline"
                  className={`flex flex-col items-center justify-center h-20 ${getClassesForType(contact.type)}`}
                  onClick={() => window.open(`tel:${contact.phone}`, "_self")}
                >
                  {getIconForType(contact.type)}
                  <span className="text-sm">{contact.name}</span>
                  <span className="text-xs font-bold">{contact.phone}</span>
                </Button>
              ))}

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 bg-green-50 hover:bg-green-100 border-green-200"
                onClick={onShareLocation}
              >
                <Share2 className="h-6 w-6 text-green-500 mb-1" />
                <span className="text-sm">Share Location</span>
              </Button>
            </div>

            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Your current location:</strong> Darjeeling Hill Road,
                Near Mall
              </p>
              <p className="text-xs text-gray-500 mt-1">
                In case of emergency, your exact coordinates will be shared with
                the service you contact.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyPanel;
