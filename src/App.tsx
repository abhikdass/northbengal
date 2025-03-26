import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import Navbar from "./components/layout/Navbar";
import InteractiveMap from "./components/map/InteractiveMap";
import ItineraryPlanner from "./components/itinerary/ItineraryPlanner";
import EmergencyHub from "./components/emergency/EmergencyHub";
import EmergencyPanel from "./components/emergency/EmergencyPanel";
import LocalInsights from "./components/insights/LocalInsights";
import LoginPage from "./components/auth/LoginPage";
import RegistrationPage from "./components/auth/RegistrationPage";
import InsightDetailsPage from "./components/insights/InsightDetailsPage";
import SaveItineraryPage from "./components/itinerary/SaveItineraryPage";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[70px] container mx-auto p-4">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <>
        <EmergencyPanel />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/map"
            element={
              <Layout>
                <InteractiveMap />
              </Layout>
            }
          />
          <Route
            path="/itinerary"
            element={
              <Layout>
                <ItineraryPlanner />
              </Layout>
            }
          />
          <Route
            path="/emergency"
            element={
              <Layout>
                <EmergencyHub />
              </Layout>
            }
          />
          <Route
            path="/insights"
            element={
              <Layout>
                <LocalInsights />
              </Layout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/insights/:type/:id"
            element={
              <Layout>
                <InsightDetailsPage />
              </Layout>
            }
          />
          <Route
            path="/itinerary/save"
            element={
              <Layout>
                <SaveItineraryPage />
              </Layout>
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
