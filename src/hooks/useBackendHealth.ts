import { useState, useEffect } from "react";
import { backendHealthService } from "../services/backendHealthService";

export const useBackendHealth = () => {
  const [isBackendHealthy, setIsBackendHealthy] = useState(
    backendHealthService.getBackendHealth()
  );

  useEffect(() => {
    // Subscribe to backend health changes
    const unsubscribe = backendHealthService.subscribe((isHealthy) => {
      setIsBackendHealthy(isHealthy);
    });

    // Check current health on mount
    backendHealthService.checkNow();

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    isBackendHealthy,
    checkBackendHealth: () => backendHealthService.checkNow(),
  };
};
