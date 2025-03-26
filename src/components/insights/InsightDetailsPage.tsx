import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowLeft, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InsightData {
  id: string;
  title: string;
  type: "event" | "festival" | "attraction";
  date?: string;
  location: string;
  description: string;
  image: string;
  category: string;
  hasAudioGuide?: boolean;
  details: {
    overview: string;
    highlights: string[];
    schedule?: { time: string; activity: string }[];
    photos: string[];
  };
}

const InsightDetailsPage = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data based on the type and id
    setLoading(true);
    setTimeout(() => {
      const mockInsight = getMockInsight(type, id);
      setInsight(mockInsight);
      setLoading(false);
    }, 500);
  }, [id, type]);

  const getMockInsight = (
    insightType: string | undefined,
    insightId: string | undefined,
  ): InsightData => {
    // Mock data for different types of insights
    if (insightType === "event") {
      return {
        id: insightId || "1",
        title: "Tea Festival",
        type: "event",
        date: "June 15-17, 2023",
        location: "Darjeeling",
        description:
          "Annual celebration of Darjeeling's famous tea culture with tastings, workshops, and cultural performances.",
        image:
          "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=800&q=80",
        category: "Cultural",
        details: {
          overview:
            "The Darjeeling Tea Festival is an annual celebration that showcases the region's world-famous tea culture. Visitors can participate in tea tastings, attend workshops on tea production, and enjoy cultural performances that highlight the rich heritage of Darjeeling.",
          highlights: [
            "Tea tasting sessions with expert sommeliers",
            "Workshops on tea production and brewing techniques",
            "Cultural performances showcasing local traditions",
            "Food stalls featuring local cuisine",
            "Tea garden tours and demonstrations",
          ],
          schedule: [
            { time: "10:00 AM", activity: "Opening Ceremony" },
            { time: "11:30 AM", activity: "Tea Tasting Workshop" },
            { time: "1:00 PM", activity: "Local Cuisine Lunch" },
            { time: "3:00 PM", activity: "Cultural Performances" },
            { time: "5:00 PM", activity: "Tea Garden Tour" },
          ],
          photos: [
            "https://images.unsplash.com/photo-1455621481073-d5bc1c40e3cb?w=800&q=80",
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
          ],
        },
      };
    } else if (insightType === "festival") {
      return {
        id: insightId || "1",
        title: "Losar Festival",
        type: "festival",
        date: "February 16-18, 2023",
        location: "Various Monasteries",
        description:
          "Tibetan New Year celebration with colorful ceremonies, masked dances, and traditional food.",
        image:
          "https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=800&q=80",
        category: "Religious",
        details: {
          overview:
            "Losar is the Tibetan New Year, a time of renewal and celebration in the Himalayan communities. The festival features colorful ceremonies, masked dances, and traditional food.",
          highlights: [
            "Traditional masked dances (Cham) performed by monks",
            "Special prayer ceremonies in monasteries",
            "Colorful decorations and butter sculptures",
            "Traditional Tibetan food and drink",
            "Community gatherings and celebrations",
          ],
          schedule: [
            { time: "5:00 AM", activity: "Morning Prayers" },
            { time: "9:00 AM", activity: "Masked Dance Performances" },
            { time: "12:00 PM", activity: "Community Feast" },
          ],
          photos: [
            "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?w=800&q=80",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
          ],
        },
      };
    } else {
      // Default to attraction
      return {
        id: insightId || "1",
        title: "Tiger Hill",
        type: "attraction",
        location: "Darjeeling",
        description:
          "Famous viewpoint offering spectacular sunrise views of the Kanchenjunga range and, on clear days, Mount Everest.",
        image:
          "https://images.unsplash.com/photo-1544461772-722f2a1a69e3?w=800&q=80",
        category: "Natural",
        hasAudioGuide: true,
        details: {
          overview:
            "Tiger Hill is one of Darjeeling's most popular tourist destinations, famous for its spectacular sunrise views over the Kanchenjunga range. On clear days, visitors can even catch a glimpse of Mount Everest.",
          highlights: [
            "Sunrise view of Kanchenjunga, the world's third-highest peak",
            "Possible views of Mount Everest on clear days",
            "Panoramic vistas of the Eastern Himalayas",
            "Beautiful photography opportunities",
            "Peaceful natural environment",
          ],
          photos: [
            "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80",
            "https://images.unsplash.com/photo-1467377791767-c929b5dc9a23?w=800&q=80",
          ],
        },
      };
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Info className="h-12 w-12 text-gray-400 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Insight Not Found</h2>
          <p className="mt-2 text-gray-600">
            The requested insight could not be found.
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="mb-6">
        <div className="rounded-lg overflow-hidden h-64 mb-4">
          <img
            src={insight.image}
            alt={insight.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <Badge>{insight.category}</Badge>
          {insight.hasAudioGuide && (
            <Badge variant="outline">Audio Guide Available</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">{insight.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{insight.location}</span>
          </div>
          {insight.date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{insight.date}</span>
            </div>
          )}
        </div>

        <p className="text-gray-700">{insight.description}</p>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">
            {insight.type === "event" || insight.type === "festival"
              ? "Schedule"
              : "Highlights"}
          </TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{insight.details.overview}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {insight.type === "event" || insight.type === "festival"
                  ? "Event Highlights"
                  : "Attraction Highlights"}
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {insight.details.highlights.map((highlight, index) => (
                  <li key={index} className="text-gray-700">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          {insight.type === "event" || insight.type === "festival" ? (
            insight.details.schedule ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
                <div className="space-y-3">
                  {insight.details.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex border-l-2 border-primary pl-4 pb-3"
                    >
                      <div className="mr-4 font-medium text-primary">
                        {item.time}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.activity}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No schedule information available
                </p>
              </div>
            )
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Highlights</h2>
              <div className="space-y-3">
                {insight.details.highlights.map((highlight, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="text-gray-700">{highlight}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="mt-4">
          <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insight.details.photos.map((photo, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg h-64 bg-gray-100"
              >
                <img
                  src={photo}
                  alt={`${insight.title} - Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightDetailsPage;
