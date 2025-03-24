import DashboardHero from "./dashboard/DashboardHero";
import FeatureCards from "./dashboard/FeatureCards";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import EmergencyPanel from "./emergency/emergencyPanel";
// const [emergencyPanelExpanded, setEmergencyPanelExpanded] = useState(false);
// const handleEmergencyCall = (serviceType: string) => {
//   console.log(`Emergency call to ${serviceType}`);
//   // In a real app, this would initiate a call or show contact information
// };

// const handleShareLocation = () => {
//   console.log("Sharing location");
//   // In a real app, this would share the user's location
// };
function Home() {
  const navigate = useNavigate();

  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case "map":
        navigate("/map");
        break;
      case "itinerary":
        navigate("/itinerary");
        break;
      case "emergency":
        navigate("/emergency");
        break;
      case "insights":
        navigate("/insights");
        break;
      default:
        break;
    }
  };

  const getAboutSections = () => {
    return [
      {
        title: "Popular Destinations",
        items: [
          "Darjeeling - Famous for its tea gardens and mountain views",
          "Kalimpong - Known for its cultural heritage and monasteries",
          "Dooars - Home to diverse wildlife and lush forests",
          "Siliguri - The gateway city to North Bengal",
        ],
        bgColor: "bg-blue-50",
      },
      {
        title: "Best Time to Visit",
        items: [
          "March to May - Spring season with pleasant weather",
          "September to November - Post-monsoon with clear skies",
          "December to February - Winter with occasional snowfall",
          "Avoid June to August - Heavy monsoon season",
        ],
        bgColor: "bg-green-50",
      },
      {
        title: "Best Time to Visit",
        items: [
          "March to May - Spring season with pleasant weather",
          "September to November - Post-monsoon with clear skies",
          "December to February - Winter with occasional snowfall",
          "Avoid June to August - Heavy monsoon season",
        ],
        bgColor: "bg-red-50",
      },
    ];
  };

  return (
    <div className="space-y-8 pb-10">
      <DashboardHero
        welcomeMessage="Welcome to North Bengal Travel Guide"
        backgroundImage="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1400&q=80"
      />

      <FeatureCards onFeatureClick={handleFeatureClick} />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">
          About North Bengal Travel Guide
        </h2>
        <p className="text-gray-600 mb-4">
          Your comprehensive digital travel companion for exploring the
          beautiful region of North Bengal. Our app provides personalized
          itineraries, real-time navigation, and local insights through an
          intuitive interface with AI-powered assistance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {getAboutSections().map((section, index) => (
            <div key={index} className={`${section.bgColor} p-4 rounded-lg`}>
              <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {section.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
    
  );
}

export default Home;
