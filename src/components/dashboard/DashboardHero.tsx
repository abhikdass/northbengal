import React from "react";
import { Button } from "../ui/button";
import { MapPin, Calendar, Shield, Info } from "lucide-react";

interface DashboardHeroProps {
  welcomeMessage?: string;
  backgroundImage?: string;
}

const DashboardHero = ({
  welcomeMessage = "Welcome to North Bengal Travel Guide",
  backgroundImage = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1400&q=80",
}: DashboardHeroProps) => {
  return (
    <div className="relative w-full h-[300px] bg-slate-100 overflow-hidden rounded-lg shadow-md">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-2">{welcomeMessage}</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Discover the beauty of North Bengal with personalized itineraries,
          interactive maps, and local insights.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Create Itinerary
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            View Map
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Emergency Support
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Local Insights
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
