import React, { useState } from "react";
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
  itineraries = [
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
  ],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onDownload = () => {},
}: SavedItinerariesProps) => {
  const [viewItinerary, setViewItinerary] = useState<Itinerary | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
            {itineraries.map((itinerary) => (
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
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
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
