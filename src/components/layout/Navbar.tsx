import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, Calendar, AlertCircle, Info, Menu, X, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Don't show navbar on login and register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm",
        className,
      )}
    >
      <div className="container mx-auto px-4 h-[70px] flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="North Bengal Travel Guide"
              className="h-8 w-auto mr-2"
            />
            <span className="font-bold text-lg hidden md:block">
              North Bengal Travel
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          <NavLink
            to="/map"
            icon={<Map className="h-4 w-4 mr-1" />}
            label="Map"
          />
          <NavLink
            to="/itinerary"
            icon={<Calendar className="h-4 w-4 mr-1" />}
            label="Itinerary"
          />
          <NavLink
            to="/emergency"
            icon={<AlertCircle className="h-4 w-4 mr-1" />}
            label="Emergency"
          />
          <NavLink
            to="/insights"
            icon={<Info className="h-4 w-4 mr-1" />}
            label="Insights"
          />
          <NavLink
            to="/login"
            icon={<LogIn className="h-4 w-4 mr-1" />}
            label="Login"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-4 px-4">
          <div className="flex flex-col space-y-2">
            <MobileNavLink
              to="/map"
              icon={<Map className="h-5 w-5 mr-3" />}
              label="Interactive Map"
            />
            <MobileNavLink
              to="/itinerary"
              icon={<Calendar className="h-5 w-5 mr-3" />}
              label="Itinerary Planner"
            />
            <MobileNavLink
              to="/emergency"
              icon={<AlertCircle className="h-5 w-5 mr-3" />}
              label="Emergency Support"
            />
            <MobileNavLink
              to="/insights"
              icon={<Info className="h-5 w-5 mr-3" />}
              label="Local Insights"
            />
            <MobileNavLink
              to="/login"
              icon={<LogIn className="h-5 w-5 mr-3" />}
              label="Login / Register"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink = ({ to, icon, label }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md flex items-center transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, icon, label }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="py-3 px-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md flex items-center transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
