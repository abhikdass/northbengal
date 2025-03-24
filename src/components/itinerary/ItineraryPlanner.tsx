import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { PlusCircle, Save, ArrowLeft } from "lucide-react";
import PreferenceForm from "./PreferenceForm";
import ItineraryDisplay from "./ItineraryDisplay";
import SavedItineraries from "./SavedItineraries";

type PlannerStep = "preferences" | "review" | "saved";

interface ItineraryPlannerProps {
  initialStep?: PlannerStep;
}

const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  initialStep = "preferences",
}) => {
  const [currentStep, setCurrentStep] = useState<PlannerStep>(initialStep);
  const [generatedItinerary, setGeneratedItinerary] = useState<any | null>(
    null,
  );

  // Handle form submission from PreferenceForm
  const handlePreferenceSubmit = (values: any) => {
    // In a real app, this would call an API to generate an itinerary
    console.log("Generating itinerary with preferences:", values);

    // Mock generated itinerary data
    const mockItinerary = {
      title: `${values.duration}-Day ${getDestinationName(values.destination)} Adventure`,
      description: `A personalized journey through ${getDestinationName(values.destination)}, tailored to your interests in ${values.interests.join(", ")}.`,
      days: generateMockDays(values.duration, values.destination),
      totalCost: values.budget,
    };

    setGeneratedItinerary(mockItinerary);
    setCurrentStep("review");
  };

  // Helper function to get full destination name
  const getDestinationName = (code: string): string => {
    const destinations: Record<string, string> = {
      darjeeling: "Darjeeling",
      kalimpong: "Kalimpong",
      dooars: "Dooars",
      siliguri: "Siliguri",
      kurseong: "Kurseong",
      mirik: "Mirik",
    };
    return destinations[code] || code;
  };

  // Generate mock days for the itinerary
  const generateMockDays = (duration: number, destination: string) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Start a week from now

    return Array.from({ length: duration }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      return {
        date: date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        activities: generateMockActivities(destination, i),
      };
    });
  };

  // Generate mock activities for each day
  const generateMockActivities = (destination: string, dayIndex: number) => {
    const activities = [
      {
        time: "08:00 AM",
        title: "Breakfast at Hotel",
        description:
          "Start your day with a delicious breakfast at your accommodation.",
        location: `${getDestinationName(destination)} Hotel`,
        type: "food" as const,
        cost: 500,
      },
      {
        time: "10:00 AM",
        title:
          dayIndex === 0
            ? "Arrival and Check-in"
            : `${getDestinationName(destination)} Sightseeing`,
        description:
          dayIndex === 0
            ? "Arrive at your destination and check in to your accommodation."
            : `Explore the beautiful sights of ${getDestinationName(destination)}.`,
        location:
          dayIndex === 0
            ? `${getDestinationName(destination)} Hotel`
            : `${getDestinationName(destination)} City Center`,
        type:
          dayIndex === 0 ? ("accommodation" as const) : ("attraction" as const),
        cost: dayIndex === 0 ? 3000 : 1000,
      },
      {
        time: "01:00 PM",
        title: "Lunch at Local Restaurant",
        description: "Enjoy authentic local cuisine at a popular restaurant.",
        location: `${getDestinationName(destination)} Market Area`,
        type: "food" as const,
        cost: 800,
      },
      {
        time: "03:00 PM",
        title: `${getDestinationName(destination)} Cultural Experience`,
        description: `Immerse yourself in the local culture of ${getDestinationName(destination)}.`,
        location: `${getDestinationName(destination)} Cultural Center`,
        type: "attraction" as const,
        cost: 1200,
      },
      {
        time: "07:00 PM",
        title: "Dinner and Relaxation",
        description:
          "End your day with a relaxing dinner at a recommended restaurant.",
        location: `${getDestinationName(destination)} Restaurant District`,
        type: "food" as const,
        cost: 1000,
      },
    ];

    return activities;
  };

  // Handle saving the itinerary
  const handleSaveItinerary = () => {
    // In a real app, this would save the itinerary to a database
    console.log("Saving itinerary:", generatedItinerary);
    setCurrentStep("saved");
  };

  // Handle editing a saved itinerary
  const handleEditItinerary = (id: string) => {
    console.log("Editing itinerary with ID:", id);
    // In a real app, this would load the itinerary data for editing
    setCurrentStep("preferences");
  };

  // Handle viewing a saved itinerary
  const handleViewItinerary = (id: string) => {
    console.log("Viewing itinerary with ID:", id);
    // In a real app, this would load the itinerary data for viewing
  };

  // Handle downloading a saved itinerary
  const handleDownloadItinerary = (id: string) => {
    console.log("Downloading itinerary with ID:", id);
    // In a real app, this would generate and download a PDF
  };

  // Handle deleting a saved itinerary
  const handleDeleteItinerary = (id: string) => {
    console.log("Deleting itinerary with ID:", id);
    // In a real app, this would delete the itinerary from the database
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Tabs defaultValue="create" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Itinerary Planner
          </h1>
          <TabsList>
            <TabsTrigger
              value="create"
              onClick={() => setCurrentStep("preferences")}
            >
              Create New
            </TabsTrigger>
            <TabsTrigger value="saved" onClick={() => setCurrentStep("saved")}>
              Saved Itineraries
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create" className="mt-0">
          {currentStep === "preferences" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Create Your Personalized Itinerary
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("saved")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Saved
                </Button>
              </div>
              <p className="text-gray-600">
                Tell us about your travel preferences, and we'll create a
                customized itinerary for your North Bengal adventure.
              </p>
              <PreferenceForm onSubmit={handlePreferenceSubmit} />
            </div>
          )}

          {currentStep === "review" && generatedItinerary && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Review Your Itinerary</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("preferences")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Edit Preferences
                  </Button>
                  <Button onClick={() => navigate("/itinerary/save")}>
                    <Save className="mr-2 h-4 w-4" /> Save Itinerary
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">
                Here's your personalized itinerary based on your preferences.
                Review the details and make any necessary adjustments.
              </p>
              <ItineraryDisplay
                title={generatedItinerary.title}
                description={generatedItinerary.description}
                days={generatedItinerary.days}
                totalCost={generatedItinerary.totalCost}
                onEdit={() => setCurrentStep("preferences")}
                onDownload={() => console.log("Download itinerary")}
                onShare={() => console.log("Share itinerary")}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          {currentStep === "saved" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Your Saved Itineraries
                </h2>
                <Button onClick={() => setCurrentStep("preferences")}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New
                </Button>
              </div>
              <SavedItineraries
                onEdit={handleEditItinerary}
                onDelete={handleDeleteItinerary}
                onView={handleViewItinerary}
                onDownload={handleDownloadItinerary}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItineraryPlanner;
