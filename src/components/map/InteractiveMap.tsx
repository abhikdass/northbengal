import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { MapPin, Navigation, Search, Layers, Info } from "lucide-react";
import { Input } from "../ui/input";

// Fix for default marker icons in react-leaflet
import L from "leaflet";
// Using relative URLs for marker icons to avoid import issues
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

// Create custom icons for different location types
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: `custom-marker-${color}`,
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const attractionIcon = createCustomIcon("#3b82f6"); // blue
const accommodationIcon = createCustomIcon("#22c55e"); // green
const foodIcon = createCustomIcon("#f97316"); // orange
const emergencyIcon = createCustomIcon("#ef4444"); // red

let DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41], // Position popup above the marker
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: string;
  name: string;
  type: "attraction" | "accommodation" | "food" | "emergency";
  position: [number, number];
  description: string;
}

interface InteractiveMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  locations?: Location[];
}

const LocationMarker = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <div className="p-1">
          <h3 className="font-bold">Your Location</h3>
          <p>You are here</p>
        </div>
      </Popup>
    </Marker>
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialCenter = [27.038, 88.2627], // Darjeeling coordinates
  initialZoom = 12,
  locations: propLocations = [],
}) => {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      name: "Tiger Hill",
      type: "attraction",
      position: [27.0072, 88.2631],
      description: "Famous for sunrise views of the Kanchenjunga range.",
    },
    {
      id: "2",
      name: "Mayfair Darjeeling",
      type: "accommodation",
      position: [27.0362, 88.2632],
      description: "Luxury hotel with colonial charm and mountain views.",
    },
    {
      id: "3",
      name: "Glenary's",
      type: "food",
      position: [27.0385, 88.2627],
      description: "Popular bakery and restaurant serving continental cuisine.",
    },
    {
      id: "4",
      name: "District Hospital",
      type: "emergency",
      position: [27.0423, 88.2667],
      description: "Main medical facility in Darjeeling.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://api.northbengaltravel.com/api/locations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched locations from API:", data);
          setLocations(data);
        } else {
          console.warn(
            "Failed to fetch locations from API, using default locations",
          );
          // If prop locations were provided, use those instead of the defaults
          if (propLocations.length > 0) {
            setLocations(propLocations);
          }
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        // If prop locations were provided, use those instead of the defaults
        if (propLocations.length > 0) {
          setLocations(propLocations);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [propLocations]);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [mapFilter, setMapFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getMarkerColor = (type: Location["type"]) => {
    switch (type) {
      case "attraction":
        return "blue";
      case "accommodation":
        return "green";
      case "food":
        return "orange";
      case "emergency":
        return "red";
      default:
        return "blue";
    }
  };

  const getMarkerIcon = (type: Location["type"]) => {
    switch (type) {
      case "attraction":
        return attractionIcon;
      case "accommodation":
        return accommodationIcon;
      case "food":
        return foodIcon;
      case "emergency":
        return emergencyIcon;
      default:
        return attractionIcon;
    }
  };

  const filteredLocations = locations.filter((location) => {
    const matchesFilter = mapFilter === "all" || location.type === mapFilter;
    const matchesSearch =
      searchQuery === "" ||
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-2">
          North Bengal Interactive Map
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search locations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Tabs
            defaultValue="all"
            value={mapFilter}
            onValueChange={setMapFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="attraction">Attractions</TabsTrigger>
              <TabsTrigger value="accommodation">Hotels</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[500px]">
        <div className="w-full md:w-3/4 h-full bg-gray-100">
          <MapContainer
            center={initialCenter}
            zoom={initialZoom}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.position}
                icon={getMarkerIcon(location.type)}
                eventHandlers={{
                  click: () => {
                    setActiveLocation(location);
                  },
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold">{location.name}</h3>
                    <p>{location.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="w-full md:w-1/4 p-4 overflow-y-auto border-l">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Locations</h3>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Layers className="h-4 w-4" /> Map Layers
            </Button>
          </div>

          <div className="space-y-3">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all ${activeLocation?.id === location.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setActiveLocation(location)}
                >
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin
                        className={`h-4 w-4 text-${getMarkerColor(location.type)}-500`}
                      />
                      {location.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-xs text-gray-500">
                      {location.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No locations found</p>
              </div>
            )}
          </div>

          {activeLocation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{activeLocation.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveLocation(null)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activeLocation.description}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 flex-1"
                >
                  <Navigation className="h-4 w-4" /> Directions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 flex-1"
                >
                  <Info className="h-4 w-4" /> Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
