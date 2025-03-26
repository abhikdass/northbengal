import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import DashboardHero from "./dashboard/DashboardHero";
import FeatureCards from "./dashboard/FeatureCards";
import AIManager from "./dashboard/AIManager";
import { UserProfile } from "./profile/UserProfile";
import { useEffect } from "react";
import { initAuth } from "@/lib/auth";
function Home() {
  const navigate = useNavigate();

  // Initialize authentication on component mount
  useEffect(() => {
    initAuth();
  }, []);

  const handleFeatureClick = (feature: string) => {
    navigate(`/${feature}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <DashboardHero />
        </div>
        <div className="w-[350px] ml-4 hidden md:block">
          <UserProfile />
        </div>
      </div>

      <FeatureCards onFeatureClick={handleFeatureClick} />

      <div className="md:hidden">
        <UserProfile />
      </div>
      {/* Floating AI Manager */}
      <AIManager floating={true} />
    </div>
  );
}

export default Home;
