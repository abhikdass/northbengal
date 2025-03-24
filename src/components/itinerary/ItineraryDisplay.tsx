import React from "react";
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
  onEdit = () => console.log("Edit itinerary"),
  onDownload = () => console.log("Download itinerary"),
  onShare = () => console.log("Share itinerary"),
}) => {
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
          <Compass className="h-4 w-4" /> Edit Itinerary
        </Button>
        <Button onClick={onDownload} variant="outline" className="gap-2">
          <Clock className="h-4 w-4" /> Download PDF
        </Button>
        <Button onClick={onShare} variant="outline" className="gap-2">
          <Clock className="h-4 w-4" /> Share
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
    </div>
  );
};

export default ItineraryDisplay;
