import { LandingNavbar , HeroSection, FeaturesSection, IconMarquee } from "../Landing";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <IconMarquee />
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-4 text-center transition-colors duration-300">
        &copy; {new Date().getFullYear()} Brainly. All Rights Reserved.
      </footer>
    </div>
  );
}
