import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MapPin, Calendar, Shield, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import AIManager from "./AIManager";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}

const FeatureCard = ({
  icon,
  title,
  description,
  color,
  onClick = () => {},
}: FeatureCardProps) => {
  return (
    <Card
      className={cn("h-full transition-all hover:shadow-lg", color)}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
        <Button variant="outline" className="mt-4 w-full">
          Explore
        </Button>
      </CardContent>
    </Card>
  );
};

interface FeatureCardsProps {
  onFeatureClick?: (feature: string) => void;
}

const FeatureCards = ({ onFeatureClick = () => {} }: FeatureCardsProps) => {
  const features = [
    {
      id: "map",
      icon: <MapPin className="h-5 w-5 text-blue-500" />,
      title: "Interactive Map",
      description:
        "Explore North Bengal with our GPS-enabled interactive map showing attractions, accommodations, and more.",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      id: "itinerary",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      title: "Itinerary Planner",
      description:
        "Create personalized travel plans based on your preferences, budget, and interests.",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      id: "emergency",
      icon: <Shield className="h-5 w-5 text-red-500" />,
      title: "Emergency Support",
      description:
        "Access emergency services with one tap and get real-time disaster alerts for your safety.",
      color: "bg-red-50 hover:bg-red-100 border-red-200",
    },
    {
      id: "insights",
      icon: <Compass className="h-5 w-5 text-purple-500" />,
      title: "Local Insights",
      description:
        "Discover curated recommendations for events, festivals, and attractions with multilingual support.",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
  ];

  return (
    <div className="w-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Explore Features</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            onClick={() => onFeatureClick(feature.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
