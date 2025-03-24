
interface DashboardHeroProps {
  welcomeMessage?: string;
  backgroundImage?: string;
}

const DashboardHero = ({
  welcomeMessage = "Welcome to North Bengal Travel Guide",
  backgroundImage = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1400&q=80",
}: DashboardHeroProps) => {
  return (
    <div className="relative w-full h-[300px] bg-slate-100 overflow-hidden rounded-lg shadow-md">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-2">{welcomeMessage}</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Discover the beauty of North Bengal with personalized itineraries,
          interactive maps, and local insights.
        </p>

        
      </div>
    </div>
  );
};

export default DashboardHero;
