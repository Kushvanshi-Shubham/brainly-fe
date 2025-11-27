import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Login } from "./pages/Auth/Login";
import { SignUp } from "./pages/Auth/SignUp";
import { LandingPage } from "./pages/Landingpage";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { useTheme } from "./hooks/useThemes";
import Dashboard from "./pages/dashboard";
import SocialFeed from "./pages/SocialFeed";
import Explore from "./pages/Explore";
import { MainLayout } from "./Layouts/MainLayout";
import Profile from "./pages/Auth/Profile";
import { ErrorBoundary } from "./components/ErrorBoundary";



function App() {
  useTheme();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
       
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes with MainLayout (includes Navbar with Add Content button) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/feed" element={<SocialFeed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
