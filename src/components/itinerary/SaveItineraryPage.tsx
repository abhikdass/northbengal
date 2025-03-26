import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Save,
  ArrowLeft,
  Share2,
  Download,
  Tag,
  DollarSign,
  Clock,
} from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false),
  tags: z.string().optional(),
});

interface SaveItineraryPageProps {
  // In a real app, this would be passed from the previous page
  // For now, we'll use mock data
  itineraryData?: any;
}

const SaveItineraryPage: React.FC<SaveItineraryPageProps> = ({
  itineraryData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // In a real app, we would get the itinerary data from the location state
  // For now, we'll use mock data if none is provided
  const itinerary = itineraryData || {
    title: "5-Day Darjeeling Adventure",
    description:
      "A journey through the beautiful landscapes of Darjeeling, covering tea gardens, mountain views, and local culture.",
    days: [
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
    totalCost: 15000,
    duration: 5,
    startDate: "2023-06-15",
    destination: "Darjeeling",
    preferences: {
      interests: ["Nature", "Cultural", "Heritage"],
      budget: 20000,
    },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: itinerary.title,
      description: itinerary.description,
      isPrivate: false,
      tags: itinerary.preferences?.interests?.join(", ") || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);

    try {
      // Prepare the data to save
      const itineraryToSave = {
        ...itinerary,
        ...values,
        savedAt: new Date().toISOString(),
        id: `itinerary-${Date.now()}`, // Generate a unique ID
        tags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      // Save to backend API
      const response = await fetch(
        "https://api.northbengaltravel.com/api/itineraries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming auth token is stored in localStorage
          },
          body: JSON.stringify(itineraryToSave),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to save itinerary: ${response.statusText}`);
      }

      const savedData = await response.json();
      console.log("Itinerary saved to backend:", savedData);

      // Also save to IndexedDB for offline access
      const { saveItinerary } = await import("@/lib/indexdb");
      await saveItinerary(itineraryToSave);

      // Also save to localStorage as a fallback
      try {
        const existingItineraries = JSON.parse(
          localStorage.getItem("savedItineraries") || "[]",
        );
        const updatedItineraries = [...existingItineraries, itineraryToSave];
        localStorage.setItem(
          "savedItineraries",
          JSON.stringify(updatedItineraries),
        );
      } catch (localStorageError) {
        console.warn("Could not save to localStorage:", localStorageError);
      }

      console.log("Itinerary saved locally:", itineraryToSave);

      // Update UI state
      setIsSaving(false);
      setSavedSuccess(true);

      // After a brief delay, navigate back to the itineraries page
      setTimeout(() => {
        navigate("/itinerary");
      }, 1500);
    } catch (error) {
      console.error("Error saving itinerary:", error);
      setIsSaving(false);
      // Fall back to local storage only if API fails
      try {
        const { saveItinerary } = await import("@/lib/indexdb");
        await saveItinerary(itineraryToSave);
        setSavedSuccess(true);
        setTimeout(() => {
          navigate("/itinerary");
        }, 1500);
      } catch (fallbackError) {
        console.error("Fallback save also failed:", fallbackError);
        alert("Failed to save itinerary. Please try again later.");
      }
    }
  };

  // Calculate total activities
  const totalActivities = itinerary.days.reduce(
    (acc: number, day: any) => acc + day.activities.length,
    0,
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Save Your Itinerary</h1>
          </div>
          {savedSuccess && (
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              Itinerary Saved Successfully!
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itinerary Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Amazing Trip" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your itinerary a memorable name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of your trip..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add some details about your itinerary.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Tags (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nature, Adventure, Family..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add comma-separated tags to categorize your itinerary.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Private Itinerary</FormLabel>
                      <FormDescription>
                        If checked, this itinerary will only be visible to you.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Itinerary
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 p-6">
          <h2 className="text-xl font-semibold mb-4">Itinerary Preview</h2>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>{itinerary.title}</CardTitle>
              <CardDescription>{itinerary.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  <Calendar className="h-4 w-4" />
                  <span>{itinerary.duration} Days</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{itinerary.totalCost} Total</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                  <MapPin className="h-4 w-4" />
                  <span>{itinerary.destination}</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
                  <Clock className="h-4 w-4" />
                  <span>{totalActivities} Activities</span>
                </div>
              </div>

              <h3 className="font-medium mb-2">Itinerary Summary</h3>
              <div className="space-y-3">
                {itinerary.days.map((day: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{day.date}</h4>
                      <p className="text-sm text-gray-500">
                        {day.activities.map((a: any) => a.title).join(" • ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t flex justify-between">
              <div className="flex gap-1">
                {itinerary.preferences?.interests?.map(
                  (interest: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {interest}
                    </Badge>
                  ),
                )}
              </div>
              <div className="text-sm text-gray-500">
                Starts: {new Date(itinerary.startDate).toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Share Itinerary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveItineraryPage;
