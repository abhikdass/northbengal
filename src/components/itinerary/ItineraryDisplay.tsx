import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Utensils,
  Bed,
  Car,
  Plane,
  Train,
  Bus,
  Compass,
  DollarSign,
  Info,
  Download,
  Share2,
  Edit,
  Loader2,
  Check,
  Copy,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";

interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  type: "attraction" | "food" | "accommodation" | "transport";
  cost?: number;
  notes?: string;
}

interface DayPlan {
  date: string;
  activities: Activity[];
}

interface ItineraryDisplayProps {
  title?: string;
  description?: string;
  days?: DayPlan[];
  totalCost?: number;
  destination?: string;
  startDate?: string;
  id?: string;
  onEdit?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "attraction":
      return <Compass className="h-5 w-5 text-blue-500" />;
    case "food":
      return <Utensils className="h-5 w-5 text-orange-500" />;
    case "accommodation":
      return <Bed className="h-5 w-5 text-purple-500" />;
    case "transport":
      return <Car className="h-5 w-5 text-green-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  return (
    <Card className="mb-4 bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getActivityIcon(activity.type)}
            <CardTitle className="text-lg">{activity.title}</CardTitle>
          </div>
          <div className="text-sm font-medium text-gray-500">
            {activity.time}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{activity.location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{activity.description}</p>
        {activity.cost && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>Estimated cost: ₹{activity.cost}</span>
          </div>
        )}
        {activity.notes && (
          <div className="mt-2 rounded-md bg-blue-50 p-2 text-sm text-blue-700">
            <p className="font-medium">Note:</p>
            <p>{activity.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DayItinerary: React.FC<{ day: DayPlan; dayNumber: number }> = ({
  day,
  dayNumber,
}) => {
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          {dayNumber}
        </div>
        <h3 className="text-xl font-semibold">
          <span className="mr-2">Day {dayNumber}:</span>
          <span className="text-gray-700">{day.date}</span>
        </h3>
      </div>
      <div className="space-y-4">
        {day.activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  title = "North Bengal Adventure",
  description = "A 5-day journey through the beautiful landscapes of North Bengal, covering Darjeeling, Kalimpong, and Dooars.",
  days = [
    {
      date: "June 15, 2023",
      activities: [
        {
          time: "09:00 AM",
          title: "Arrival at Bagdogra Airport",
          description: "Arrive at Bagdogra Airport and meet your guide.",
          location: "Bagdogra Airport, Siliguri",
          type: "transport",
          notes: "Your guide will be holding a sign with your name.",
        },
        {
          time: "10:30 AM - 01:30 PM",
          title: "Drive to Darjeeling",
          description:
            "Scenic drive through winding mountain roads to Darjeeling.",
          location: "Bagdogra to Darjeeling",
          type: "transport",
          cost: 1500,
        },
        {
          time: "02:00 PM",
          title: "Check-in at Hotel",
          description: "Check-in at your hotel and freshen up.",
          location: "Mayfair Darjeeling",
          type: "accommodation",
          cost: 4500,
        },
        {
          time: "04:00 PM",
          title: "Mall Road Exploration",
          description:
            "Stroll along the famous Mall Road and explore local shops.",
          location: "Mall Road, Darjeeling",
          type: "attraction",
          cost: 0,
        },
        {
          time: "07:00 PM",
          title: "Dinner at Glenary's",
          description: "Enjoy dinner at the iconic Glenary's restaurant.",
          location: "Glenary's, Darjeeling",
          type: "food",
          cost: 1200,
        },
      ],
    },
    {
      date: "June 16, 2023",
      activities: [
        {
          time: "04:00 AM",
          title: "Tiger Hill Sunrise",
          description:
            "Witness the breathtaking sunrise over the Kanchenjunga range.",
          location: "Tiger Hill, Darjeeling",
          type: "attraction",
          cost: 500,
          notes: "Dress warmly as it can be very cold in the early morning.",
        },
        {
          time: "08:00 AM",
          title: "Breakfast at Hotel",
          description: "Return to hotel for breakfast.",
          location: "Mayfair Darjeeling",
          type: "food",
          cost: 0,
        },
        {
          time: "10:00 AM",
          title: "Darjeeling Himalayan Railway",
          description:
            "Ride the famous 'Toy Train', a UNESCO World Heritage site.",
          location: "Darjeeling Railway Station",
          type: "attraction",
          cost: 1200,
        },
      ],
    },
  ],
  totalCost = 15000,
  destination = "North Bengal",
  startDate = new Date().toISOString(),
  id = `itinerary-${Date.now()}`,
  onEdit = () => console.log("Edit itinerary"),
  onDownload = () => console.log("Download itinerary"),
  onShare = () => console.log("Share itinerary"),
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle download PDF
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // First try to download from API
      try {
        const response = await fetch(
          `https://api.northbengaltravel.com/api/itineraries/${id}/pdf`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        if (response.ok) {
          // Get the PDF blob from the response
          const pdfBlob = await response.blob();

          // Create a download link and trigger download
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${title.replace(/\s+/g, "_")}_Itinerary.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          console.log("Downloaded PDF from API");
          return;
        } else {
          console.warn(
            "API PDF download failed, falling back to client-side generation",
          );
        }
      } catch (apiError) {
        console.error("API PDF download error:", apiError);
      }

      // Fallback to client-side generation
      const { generateItineraryPDF } = await import("@/lib/pdfGenerator");

      // Create the itinerary object with all required properties
      const itinerary = {
        id,
        title,
        description,
        days,
        totalCost,
        destination,
        startDate,
        duration: days.length,
      };

      // Generate and download the PDF
      generateItineraryPDF(itinerary);
      console.log("Generated PDF client-side as fallback");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    setIsSharing(true);
    try {
      // First try to get a share link from the API
      try {
        const response = await fetch(
          `https://api.northbengaltravel.com/api/itineraries/${id}/share`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
              title,
              description,
              destination,
              duration: days.length,
              startDate,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          setShareUrl(data.shareUrl);
          setShareDialogOpen(true);
          console.log("Generated share link from API");
          setIsSharing(false);
          return;
        } else {
          console.warn(
            "API share link generation failed, falling back to client-side",
          );
        }
      } catch (apiError) {
        console.error("API share error:", apiError);
      }

      // Fallback to client-side generation
      const { generateShareableLink } = await import("@/lib/pdfGenerator");

      // Create the itinerary object with all required properties
      const itinerary = {
        id,
        title,
        description,
        days,
        totalCost,
        destination,
        startDate,
        duration: days.length,
      };

      // Generate a shareable link
      const link = await generateShareableLink(itinerary);
      setShareUrl(link);
      setShareDialogOpen(true);
      console.log("Generated share link client-side as fallback");
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Failed to generate share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  // Handle copy link
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            <Calendar className="h-4 w-4" />
            <span>{days.length} Days</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            <DollarSign className="h-4 w-4" />
            <span>₹{totalCost} Total</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={onEdit} variant="outline" className="gap-2">
          <Edit className="h-4 w-4" /> Edit Itinerary
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="gap-2"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Download PDF
            </>
          )}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="gap-2"
          disabled={isSharing}
        >
          {isSharing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sharing...
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" /> Share
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="day-by-day" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="day-by-day">Day by Day</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="day-by-day" className="space-y-6">
          {days.map((day, index) => (
            <DayItinerary key={index} day={day} dayNumber={index + 1} />
          ))}
        </TabsContent>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Itinerary Overview</CardTitle>
              <CardDescription>
                A summary of your entire journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {days.map((day, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{day.date}</h4>
                      <p className="text-sm text-gray-500">
                        {day.activities.map((a) => a.title).join(" • ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow">
            <div className="h-[400px] w-full rounded-md bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">
                Interactive map view will be displayed here
              </p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {days.map((day, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-primary/10 p-3">
                    <CardTitle className="text-sm">
                      Day {index + 1}: {day.date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <ul className="space-y-1 text-xs">
                      {day.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-center gap-1">
                          {getActivityIcon(activity.type)}
                          <span>{activity.title}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Itinerary</DialogTitle>
            <DialogDescription>
              Share this link with others to view your itinerary.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button size="sm" onClick={copyToClipboard}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </>
              )}
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryDisplay;
