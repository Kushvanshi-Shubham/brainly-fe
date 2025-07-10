import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Login } from "./pages/Auth/Login";
import { SignUp } from "./pages/Auth/SignUp";
import { LandingPage } from "./pages/Landingpage";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { useTheme } from "./hooks/useThemes";
import Dashboard from "./pages/dashboard";
import { MainLayout } from "./Layouts/MainLayout";
import Profile from "./pages/Auth/Profile";



function App() {
  useTheme();

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
       
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element= { <Profile/>}/>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
