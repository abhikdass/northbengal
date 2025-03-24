import DashboardHero from "./dashboard/DashboardHero";
import FeatureCards from "./dashboard/FeatureCards";
import { useNavigate } from "react-router-dom";

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
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Popular Destinations</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Darjeeling - Famous for its tea gardens and mountain views
              </li>
              <li>
                Kalimpong - Known for its cultural heritage and monasteries
              </li>
              <li>Dooars - Home to diverse wildlife and lush forests</li>
              <li>Siliguri - The gateway city to North Bengal</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Best Time to Visit</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>March to May - Spring season with pleasant weather</li>
              <li>September to November - Post-monsoon with clear skies</li>
              <li>December to February - Winter with occasional snowfall</li>
              <li>Avoid June to August - Heavy monsoon season</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
