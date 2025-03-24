import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Calendar,
  Globe,
  MapPin,
  Calendar as CalendarIcon,
  Info,
  Heart,
  Share2,
  Bookmark,
  Volume2,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  category: string;
}

interface Festival {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  category: string;
}

interface Attraction {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  category: string;
  hasAudioGuide: boolean;
}

interface LocalInsightsProps {
  events?: Event[];
  festivals?: Festival[];
  attractions?: Attraction[];
  selectedLanguage?: string;
}

const LocalInsights = ({
  events = [
    {
      id: "1",
      title: "Tea Festival",
      date: "June 15-17, 2023",
      location: "Darjeeling",
      description:
        "Annual celebration of Darjeeling's famous tea culture with tastings, workshops, and cultural performances.",
      image:
        "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=800&q=80",
      category: "Cultural",
    },
    {
      id: "2",
      title: "Himalayan Mountain Biking Challenge",
      date: "September 5-7, 2023",
      location: "Kalimpong",
      description:
        "Extreme mountain biking event through challenging Himalayan terrain with participants from around the world.",
      image:
        "https://images.unsplash.com/photo-1594279156811-e8e2e1127869?w=800&q=80",
      category: "Sports",
    },
    {
      id: "3",
      title: "North Bengal Wildlife Photography Exhibition",
      date: "October 10-15, 2023",
      location: "Siliguri",
      description:
        "Showcase of stunning wildlife photography from the region's national parks and sanctuaries.",
      image:
        "https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=800&q=80",
      category: "Art",
    },
  ],
  festivals = [
    {
      id: "1",
      title: "Losar Festival",
      date: "February 16-18, 2023",
      location: "Various Monasteries",
      description:
        "Tibetan New Year celebration with colorful ceremonies, masked dances, and traditional food.",
      image:
        "https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=800&q=80",
      category: "Religious",
    },
    {
      id: "2",
      title: "Teesta Tea & Tourism Festival",
      date: "December 10-12, 2023",
      location: "Siliguri and Darjeeling",
      description:
        "Celebration of the region's tea heritage, culture, and tourism potential with exhibitions and performances.",
      image:
        "https://images.unsplash.com/photo-1455621481073-d5bc1c40e3cb?w=800&q=80",
      category: "Cultural",
    },
    {
      id: "3",
      title: "Durga Puja",
      date: "October 20-24, 2023",
      location: "Throughout North Bengal",
      description:
        "The region's biggest festival with elaborate pandals, cultural performances, and community celebrations.",
      image:
        "https://images.unsplash.com/photo-1601182864406-52a5ff0d74ad?w=800&q=80",
      category: "Religious",
    },
  ],
  attractions = [
    {
      id: "1",
      title: "Tiger Hill",
      location: "Darjeeling",
      description:
        "Famous viewpoint offering spectacular sunrise views of the Kanchenjunga range and, on clear days, Mount Everest.",
      image:
        "https://images.unsplash.com/photo-1544461772-722f2a1a69e3?w=800&q=80",
      category: "Natural",
      hasAudioGuide: true,
    },
    {
      id: "2",
      title: "Darjeeling Himalayan Railway",
      location: "Darjeeling",
      description:
        "UNESCO World Heritage Site featuring the famous 'Toy Train' that winds through the mountains.",
      image:
        "https://images.unsplash.com/photo-1602435969462-b06c3b3d3a0c?w=800&q=80",
      category: "Historical",
      hasAudioGuide: true,
    },
    {
      id: "3",
      title: "Jaldapara National Park",
      location: "Alipurduar",
      description:
        "Home to the largest population of one-horned rhinoceros in West Bengal, along with elephants, tigers, and deer.",
      image:
        "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
      category: "Wildlife",
      hasAudioGuide: false,
    },
    {
      id: "4",
      title: "Kalimpong Arts & Crafts Center",
      location: "Kalimpong",
      description:
        "Showcasing traditional Himalayan crafts including Thangka paintings, wood carvings, and handwoven textiles.",
      image:
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80",
      category: "Cultural",
      hasAudioGuide: true,
    },
  ],
  selectedLanguage = "English",
}: LocalInsightsProps) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(selectedLanguage);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Filter functions
  const filterBySearch = (item: any) => {
    if (!searchQuery) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterByCategory = (item: any) => {
    if (categoryFilter === "All") return true;
    return item.category === categoryFilter;
  };

  // Get unique categories
  const getUniqueCategories = (items: any[]) => {
    const categories = items.map((item) => item.category);
    return ["All", ...new Set(categories)];
  };

  const eventCategories = getUniqueCategories(events);
  const festivalCategories = getUniqueCategories(festivals);
  const attractionCategories = getUniqueCategories(attractions);

  // Filtered items
  const filteredEvents = events.filter(
    (item) => filterBySearch(item) && filterByCategory(item),
  );
  const filteredFestivals = festivals.filter(
    (item) => filterBySearch(item) && filterByCategory(item),
  );
  const filteredAttractions = attractions.filter(
    (item) => filterBySearch(item) && filterByCategory(item),
  );

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Local Insights</h1>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-500" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
                <SelectItem value="Nepali">Nepali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search events, festivals, or attractions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {[
                  ...new Set([
                    ...eventCategories,
                    ...festivalCategories,
                    ...attractionCategories,
                  ]),
                ].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="festivals" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Festivals
            </TabsTrigger>
            <TabsTrigger
              value="attractions"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Attractions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      navigate={navigate}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">
                      No events found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="festivals" className="mt-6">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFestivals.length > 0 ? (
                  filteredFestivals.map((festival) => (
                    <FestivalCard
                      key={festival.id}
                      festival={festival}
                      navigate={navigate}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">
                      No festivals found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="attractions" className="mt-6">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttractions.length > 0 ? (
                  filteredAttractions.map((attraction) => (
                    <AttractionCard
                      key={attraction.id}
                      attraction={attraction}
                      navigate={navigate}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">
                      No attractions found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const EventCard = ({ event, navigate }: { event: Event; navigate: any }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 right-2">{event.category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {event.date}
        </CardDescription>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to favorites</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share event</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={() => navigate(`/insights/event/${event.id}`)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const FestivalCard = ({
  festival,
  navigate,
}: {
  festival: Festival;
  navigate: any;
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={festival.image}
          alt={festival.title}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 right-2">{festival.category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{festival.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {festival.date}
        </CardDescription>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {festival.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">
          {festival.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save to calendar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share festival</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={() => navigate(`/insights/festival/${festival.id}`)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const AttractionCard = ({
  attraction,
  navigate,
}: {
  attraction: Attraction;
  navigate: any;
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={attraction.image}
          alt={attraction.title}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 right-2">{attraction.category}</Badge>
        {attraction.hasAudioGuide && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-white">
            <Volume2 className="h-3 w-3 mr-1" /> Audio Guide
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{attraction.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {attraction.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">
          {attraction.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>More information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {attraction.hasAudioGuide && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start audio guide</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Button
          onClick={() => navigate(`/insights/attraction/${attraction.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocalInsights;
