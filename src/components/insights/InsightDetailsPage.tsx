import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Share2,
  Bookmark,
  Heart,
  Volume2,
  Info,
  Clock,
  User,
} from "lucide-react";
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
    reviews: { user: string; rating: number; comment: string; date: string }[];
  };
}

const InsightDetailsPage = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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
            "The Darjeeling Tea Festival is an annual celebration that showcases the region's world-famous tea culture. Visitors can participate in tea tastings, attend workshops on tea production, and enjoy cultural performances that highlight the rich heritage of Darjeeling. The festival brings together tea enthusiasts, experts, and producers from across the region and beyond.",
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
            { time: "7:00 PM", activity: "Evening Gala Dinner" },
          ],
          photos: [
            "https://images.unsplash.com/photo-1455621481073-d5bc1c40e3cb?w=800&q=80",
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
            "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80",
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
          ],
          reviews: [
            {
              user: "Rahul M.",
              rating: 5,
              comment:
                "An amazing experience! The tea tastings were exceptional and I learned so much about the tea-making process.",
              date: "June 20, 2022",
            },
            {
              user: "Priya S.",
              rating: 4,
              comment:
                "Great cultural performances and the food was delicious. Would definitely recommend.",
              date: "June 18, 2022",
            },
            {
              user: "Michael T.",
              rating: 5,
              comment:
                "As a tea enthusiast, this festival was a dream come true. The workshops were informative and engaging.",
              date: "June 17, 2022",
            },
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
            "Losar is the Tibetan New Year, a time of renewal and celebration in the Himalayan communities. The festival features colorful ceremonies, masked dances, and traditional food. Monasteries across North Bengal host special prayers and rituals during this time. Visitors can witness the unique cultural traditions and participate in the festivities.",
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
            { time: "2:00 PM", activity: "Cultural Procession" },
            { time: "5:00 PM", activity: "Evening Rituals" },
          ],
          photos: [
            "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?w=800&q=80",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
            "https://images.unsplash.com/photo-1535254973040-607b474d7f5a?w=800&q=80",
            "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800&q=80",
          ],
          reviews: [
            {
              user: "Tenzin D.",
              rating: 5,
              comment:
                "A beautiful celebration of our culture. The monastery was decorated beautifully and the ceremonies were very moving.",
              date: "February 20, 2022",
            },
            {
              user: "Sarah J.",
              rating: 5,
              comment:
                "As a tourist, I felt welcomed to observe and learn about this important festival. The masked dances were spectacular!",
              date: "February 19, 2022",
            },
            {
              user: "Dorje T.",
              rating: 4,
              comment:
                "Great atmosphere and wonderful food. The community spirit during Losar is something everyone should experience.",
              date: "February 18, 2022",
            },
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
            "Tiger Hill is one of Darjeeling's most popular tourist destinations, famous for its spectacular sunrise views over the Kanchenjunga range. On clear days, visitors can even catch a glimpse of Mount Everest. Located at an altitude of 2,590 meters, it offers a panoramic view of the snow-capped mountains against the changing colors of the dawn sky.",
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
            "https://images.unsplash.com/photo-1477322524744-0eece9e79640?w=800&q=80",
            "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
          ],
          reviews: [
            {
              user: "Amit K.",
              rating: 5,
              comment:
                "Waking up early was totally worth it! The sunrise view was breathtaking and I could even see Mount Everest in the distance.",
              date: "May 15, 2022",
            },
            {
              user: "Lisa M.",
              rating: 4,
              comment:
                "Beautiful views but very crowded during peak season. Go early to get a good spot.",
              date: "April 22, 2022",
            },
            {
              user: "Rajesh S.",
              rating: 5,
              comment:
                "One of the most magical experiences of my life. The changing colors of the sky as the sun rises over the mountains is unforgettable.",
              date: "March 10, 2022",
            },
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

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <img
          src={insight.image}
          alt={insight.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 bg-white/80 hover:bg-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-white/80 text-black hover:bg-white/90">
              {insight.category}
            </Badge>
            {insight.hasAudioGuide && (
              <Badge
                variant="outline"
                className="bg-white/80 text-black hover:bg-white/90"
              >
                <Volume2 className="h-3 w-3 mr-1" /> Audio Guide Available
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {insight.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white">
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-sm text-gray-500">
          {insight.type === "event" || insight.type === "festival"
            ? "Event Details"
            : "Attraction Information"}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`gap-1 ${isLiked ? "text-red-500" : ""}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className="h-4 w-4"
              fill={isLiked ? "currentColor" : "none"}
            />
            {isLiked ? "Liked" : "Like"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`gap-1 ${isSaved ? "text-blue-500" : ""}`}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark
              className="h-4 w-4"
              fill={isSaved ? "currentColor" : "none"}
            />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="p-6">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">
            {insight.type === "event" || insight.type === "festival"
              ? "Schedule"
              : "Highlights"}
          </TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">
              {insight.details.overview}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">
              {insight.type === "event" || insight.type === "festival"
                ? "Event Highlights"
                : "Attraction Highlights"}
            </h3>
            <ul className="space-y-2">
              {insight.details.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg
                      className="h-3 w-3 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {insight.type === "event" || insight.type === "festival"
                  ? "Event Information"
                  : "Visitor Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-gray-600">{insight.location}</p>
                </div>
              </div>
              {insight.date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-sm text-gray-600">{insight.date}</p>
                  </div>
                </div>
              )}
              {insight.type === "attraction" && (
                <>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Best Time to Visit</h4>
                      <p className="text-sm text-gray-600">
                        Early morning for sunrise (5:00 AM - 6:00 AM)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Entry Fee</h4>
                      <p className="text-sm text-gray-600">
                        ₹50 for Indian Nationals, ₹100 for Foreign Tourists
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {insight.type === "event" || insight.type === "festival" ? (
            insight.details.schedule ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Event Schedule</h2>
                <div className="space-y-4">
                  {insight.details.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex border-l-2 border-primary pl-4 pb-4"
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
              <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insight.details.highlights.map((highlight, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insight.details.photos.map((photo, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg h-64 bg-gray-100"
              >
                <img
                  src={photo}
                  alt={`${insight.title} - Photo ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <Button>Write a Review</Button>
          </div>

          <div className="space-y-6">
            {insight.details.reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-100 p-2">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{review.user}</h4>
                        <div className="flex items-center gap-2">
                          {renderStarRating(review.rating)}
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Insights */}
      <div className="p-6 border-t">
        <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${1544461772 + i * 1000}-722f2a1a69e3?w=400&q=80`}
                  alt="Related insight"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">
                  {insight.type === "event"
                    ? `Mountain Biking Event ${i}`
                    : insight.type === "festival"
                      ? `Cultural Festival ${i}`
                      : `Scenic Viewpoint ${i}`}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Darjeeling</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightDetailsPage;
