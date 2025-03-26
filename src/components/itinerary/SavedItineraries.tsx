import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Download, Edit, Eye, Trash2 } from "lucide-react";

interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: number;
  startDate: string;
  budget: string;
  interests: string[];
  thumbnail: string;
  createdAt: string;
}

interface SavedItinerariesProps {
  itineraries?: Itinerary[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const SavedItineraries = ({
  itineraries: propItineraries,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onDownload = () => {},
}: SavedItinerariesProps) => {
  const [viewItinerary, setViewItinerary] = useState<Itinerary | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved itineraries from backend API with fallback to IndexedDB on component mount
  useEffect(() => {
    const loadSavedItineraries = async () => {
      try {
        // First try to fetch from API
        try {
          const response = await fetch(
            "https://api.northbengaltravel.com/api/itineraries",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            },
          );

          if (response.ok) {
            const apiItineraries = await response.json();
            console.log("Fetched itineraries from API:", apiItineraries);

            // Format the API itineraries
            const formattedApiItineraries = apiItineraries.map((item: any) => ({
              id: item.id,
              title: item.title,
              destination: item.destination,
              duration: item.duration,
              startDate: item.startDate,
              budget:
                typeof item.totalCost === "number"
                  ? `₹${item.totalCost}`
                  : item.budget || "₹0",
              interests: Array.isArray(item.tags) ? item.tags : [],
              thumbnail:
                item.thumbnail ||
                `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000)}?w=800&q=80`,
              createdAt:
                item.savedAt || item.createdAt || new Date().toISOString(),
            }));

            setItineraries(formattedApiItineraries);
            setIsLoading(false);

            // Sync with IndexedDB for offline access
            const { saveItinerary } = await import("@/lib/indexdb");
            for (const itinerary of apiItineraries) {
              await saveItinerary(itinerary);
            }

            return;
          } else {
            console.warn("API request failed, falling back to IndexedDB");
          }
        } catch (apiError) {
          console.error("API error, using IndexedDB fallback:", apiError);
        }

        // Import the IndexedDB utility dynamically
        const { getAllItineraries, migrateFromLocalStorage } = await import(
          "@/lib/indexdb"
        );

        // First attempt to migrate any data from localStorage to IndexedDB
        await migrateFromLocalStorage();

        // Then fetch all itineraries from IndexedDB
        const dbItineraries = await getAllItineraries();

        if (dbItineraries && dbItineraries.length > 0) {
          // Format the itineraries to match the Itinerary interface
          const formattedItineraries = dbItineraries.map((item: any) => ({
            id:
              item.id ||
              `itinerary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title,
            destination: item.destination,
            duration: item.duration,
            startDate: item.startDate,
            budget:
              typeof item.totalCost === "number"
                ? `₹${item.totalCost}`
                : item.budget || "₹0",
            interests: Array.isArray(item.tags)
              ? item.tags
              : Array.isArray(item.preferences?.interests)
                ? item.preferences.interests
                : [],
            thumbnail:
              item.thumbnail ||
              `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000)}?w=800&q=80`,
            createdAt:
              item.savedAt || item.createdAt || new Date().toISOString(),
          }));
          setItineraries(formattedItineraries);
        } else if (propItineraries && propItineraries.length > 0) {
          // Use prop itineraries if available
          setItineraries(propItineraries);
        } else {
          // Fallback to localStorage if IndexedDB is empty
          const storedItineraries = localStorage.getItem("savedItineraries");
          if (storedItineraries) {
            const parsedItineraries = JSON.parse(storedItineraries).map(
              (item: any) => ({
                id:
                  item.id ||
                  `itinerary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: item.title,
                destination: item.destination,
                duration: item.duration,
                startDate: item.startDate,
                budget:
                  typeof item.totalCost === "number"
                    ? `₹${item.totalCost}`
                    : item.budget || "₹0",
                interests: Array.isArray(item.tags)
                  ? item.tags
                  : Array.isArray(item.preferences?.interests)
                    ? item.preferences.interests
                    : [],
                thumbnail:
                  item.thumbnail ||
                  `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000)}?w=800&q=80`,
                createdAt:
                  item.savedAt || item.createdAt || new Date().toISOString(),
              }),
            );
            setItineraries(parsedItineraries);
          } else {
            // Use default mock data if no stored or prop itineraries
            setItineraries([
              {
                id: "1",
                title: "Darjeeling Tea Gardens Tour",
                destination: "Darjeeling",
                duration: 3,
                startDate: "2023-06-15",
                budget: "₹15,000",
                interests: ["Tea Gardens", "Mountain Views", "Cultural"],
                thumbnail:
                  "https://images.unsplash.com/photo-1544233726-9f1d0a91fd31?w=800&q=80",
                createdAt: "2023-05-10",
              },
              {
                id: "2",
                title: "Kalimpong Heritage Trail",
                destination: "Kalimpong",
                duration: 4,
                startDate: "2023-07-22",
                budget: "₹18,000",
                interests: ["Heritage", "Hiking", "Local Cuisine"],
                thumbnail:
                  "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&q=80",
                createdAt: "2023-06-05",
              },
              {
                id: "3",
                title: "Dooars Wildlife Adventure",
                destination: "Dooars",
                duration: 5,
                startDate: "2023-09-10",
                budget: "₹25,000",
                interests: ["Wildlife", "Safari", "Nature"],
                thumbnail:
                  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80",
                createdAt: "2023-08-01",
              },
              {
                id: "4",
                title: "Siliguri City Exploration",
                destination: "Siliguri",
                duration: 2,
                startDate: "2023-10-05",
                budget: "₹8,000",
                interests: ["Urban", "Shopping", "Food"],
                thumbnail:
                  "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80",
                createdAt: "2023-09-15",
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error loading saved itineraries:", error);
        // Fallback to default itineraries on error
        setItineraries(propItineraries || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedItineraries();
  }, [propItineraries]);

  // Handle delete itinerary
  const handleDeleteItinerary = async (id: string) => {
    try {
      // Update local state
      const updatedItineraries = itineraries.filter(
        (itinerary) => itinerary.id !== id,
      );
      setItineraries(updatedItineraries);
      setDeleteConfirmId(null);

      // Delete from IndexedDB
      try {
        const { deleteItinerary } = await import("@/lib/indexdb");
        await deleteItinerary(id);
      } catch (dbError) {
        console.error("Error deleting from IndexedDB:", dbError);

        // Fallback to localStorage if IndexedDB fails
        const storedItineraries = localStorage.getItem("savedItineraries");
        if (storedItineraries) {
          const parsedStored = JSON.parse(storedItineraries);
          const updatedStored = parsedStored.filter(
            (item: any) => item.id !== id,
          );
          localStorage.setItem(
            "savedItineraries",
            JSON.stringify(updatedStored),
          );
        }
      }

      // Call the provided onDelete callback
      onDelete(id);
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  // Mock itinerary display data when viewing an itinerary
  const renderItineraryDetails = (itinerary: Itinerary) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Trip Overview</h3>
          <p className="text-gray-600">
            A {itinerary.duration}-day journey through {itinerary.destination},
            exploring the best this region has to offer.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Daily Schedule</h3>
          {Array.from({ length: itinerary.duration }).map((_, index) => (
            <div
              key={index}
              className="mt-4 border-l-2 border-primary pl-4 pb-4"
            >
              <h4 className="font-medium">Day {index + 1}</h4>
              <p className="text-gray-600">
                Explore local attractions and experience the culture of{" "}
                {itinerary.destination}.
              </p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium">Morning</h5>
                  <p className="text-xs text-gray-600">
                    Visit local attractions
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium">Afternoon</h5>
                  <p className="text-xs text-gray-600">
                    Lunch at local restaurant
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium">Evening</h5>
                  <p className="text-xs text-gray-600">Cultural experience</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium">Accommodation</h5>
                  <p className="text-xs text-gray-600">Stay at local hotel</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-medium">Budget Breakdown</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-gray-50 p-3 rounded-md">
              <h5 className="text-sm font-medium">Accommodation</h5>
              <p className="text-xs text-gray-600">
                ₹{parseInt(itinerary.budget.replace(/[^\d]/g, "")) * 0.4}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h5 className="text-sm font-medium">Food</h5>
              <p className="text-xs text-gray-600">
                ₹{parseInt(itinerary.budget.replace(/[^\d]/g, "")) * 0.2}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h5 className="text-sm font-medium">Transportation</h5>
              <p className="text-xs text-gray-600">
                ₹{parseInt(itinerary.budget.replace(/[^\d]/g, "")) * 0.3}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h5 className="text-sm font-medium">Activities</h5>
              <p className="text-xs text-gray-600">
                ₹{parseInt(itinerary.budget.replace(/[^\d]/g, "")) * 0.1}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-sm flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Saved Itineraries
          </h2>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itineraries.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  You haven't saved any itineraries yet.
                </p>
                <p className="text-gray-500 mt-1">
                  Create a new itinerary to get started!
                </p>
              </div>
            ) : (
              itineraries.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onEdit={onEdit}
                  onDelete={() => setDeleteConfirmId(itinerary.id)}
                  onView={() => setViewItinerary(itinerary)}
                  onDownload={onDownload}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itineraries
              .filter((itinerary) => new Date(itinerary.startDate) > new Date())
              .map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onEdit={onEdit}
                  onDelete={() => setDeleteConfirmId(itinerary.id)}
                  onView={() => setViewItinerary(itinerary)}
                  onDownload={onDownload}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itineraries
              .filter(
                (itinerary) => new Date(itinerary.startDate) <= new Date(),
              )
              .map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onEdit={onEdit}
                  onDelete={() => setDeleteConfirmId(itinerary.id)}
                  onView={() => setViewItinerary(itinerary)}
                  onDownload={onDownload}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Itinerary Dialog */}
      {viewItinerary && (
        <Dialog
          open={!!viewItinerary}
          onOpenChange={() => setViewItinerary(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{viewItinerary.title}</DialogTitle>
              <DialogDescription>
                {viewItinerary.destination} · {viewItinerary.duration} days ·
                Starting{" "}
                {new Date(viewItinerary.startDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {renderItineraryDetails(viewItinerary)}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewItinerary(null)}>
                Close
              </Button>
              <Button onClick={() => onDownload(viewItinerary.id)}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this itinerary? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId) {
                  handleDeleteItinerary(deleteConfirmId);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ItineraryCardProps {
  itinerary: Itinerary;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

const ItineraryCard = ({
  itinerary,
  onEdit,
  onDelete,
  onView,
  onDownload,
}: ItineraryCardProps) => {
  const isUpcoming = new Date(itinerary.startDate) > new Date();

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={itinerary.thumbnail}
          alt={itinerary.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={isUpcoming ? "default" : "secondary"}>
            {isUpcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{itinerary.title}</CardTitle>
        <CardDescription className="flex justify-between">
          <span>{itinerary.destination}</span>
          <span>{itinerary.duration} days</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="text-sm text-gray-500 mb-2">
          <p>Starting: {new Date(itinerary.startDate).toLocaleDateString()}</p>
          <p>Budget: {itinerary.budget}</p>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {itinerary.interests.map((interest, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between border-t">
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(itinerary.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(itinerary.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(itinerary.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownload(itinerary.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SavedItineraries;
