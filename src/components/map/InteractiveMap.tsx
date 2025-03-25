import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { MapPin, Navigation, Search, Layers, Info } from "lucide-react";
import { Input } from "../ui/input";
import L from "leaflet";

// Fix for default marker icons
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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

// Updated LocationMarker to accept setPosition from parent
interface LocationMarkerProps {
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ setPosition }) => {
  const [localPosition, setLocalPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setLocalPosition(coords);
      setPosition(coords); // Share location with parent
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map, setPosition]);

  return localPosition === null ? null : (
    <Marker position={localPosition}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialCenter = [27.038, 88.2627],
  initialZoom = 12,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [mapFilter, setMapFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null); // Global position

  // Fetch locations based on position
  useEffect(() => {
    if (!position) return;

    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/mapDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat: position[0], lon: position[1] }),
        });
        console.log("Response:", response);
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        setLocations(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };

    fetchLocations();
  }, [position]);

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
        <h2 className="text-2xl font-bold mb-2">North Bengal Interactive Map</h2>
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
            <LocationMarker setPosition={setPosition} />
            {!loading &&
              filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.position}
                  eventHandlers={{
                    click: () => {
                      setActiveLocation(location);
                    },
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{location.name}</h3>
                      <p>{location.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        <div key={location.id} className="w-full md:w-1/4 p-4 overflow-y-auto border-l">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Locations</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Layers className="h-4 w-4" /> Map Layers
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer transition-all ${
                  activeLocation?.id === location.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveLocation(location)}
              >
                <CardHeader key={location.id} className="p-3 pb-0">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin
                      className={`h-4 w-4 text-${getMarkerColor(location.type)}-500`}
                    />
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent key={location.id} className="p-3 pt-1">
                  <p className="text-xs text-gray-500">{location.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              No locations found.
            </div>
          )}

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
              <div key={activeLocation.id} className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 flex-1"
                  onClick={() => {window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeLocation.position[0]},${activeLocation.position[1]}`, '_blank')}}
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
