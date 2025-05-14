// src/App.tsx - WITH ROLE DEBUG PANEL

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ui/toast-provider"; // Import ToastProvider
import Index from "./pages/Index";
import B2BPage from "./pages/B2BPage";
import MarketingPage from "./pages/MarketingPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import PreferencesPage from "./pages/PreferencesPage";
import SystemSettingsPage from "./pages/SystemSettingsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; // Import the new SignupPage
import UnauthorizedPage from "./pages/UnauthorizedPage";
import VoiceLoginPage from "./pages/VoiceLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SocialMediaAdsPage from "./pages/SocialMediaAdsPage";
import ReorderReminderPage from "./pages/ReorderReminderPage";
import AiAssistant from "./components/ai-assistant/AiAssistant";
import RoleDebugPanel from "./components/RoleDebugPanel"; // Import the RoleDebugPanel

// Import the voice authentication styles
import "./styles/VoiceAuth.css";

// Component to conditionally render AI Assistant
const ConditionalAiAssistant = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show assistant on auth pages
  const isAuthPage = ['/login', '/signup', '/voice-login', '/unauthorized'].includes(location.pathname);
  
  if (isAuthenticated && !isAuthPage) {
    return <AiAssistant />;
  }
  
  return null;
};

const App = () => (
  <AuthProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider> {/* Add ToastProvider here */}
        <TooltipProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} /> {/* Add the signup route */}
            <Route path="/voice-login" element={<VoiceLoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/b2b" element={
              <ProtectedRoute requiredRole={['CEO', 'CCO', 'Commercial Director']} requireVoiceAuth={true}>
                <B2BPage />
              </ProtectedRoute>
            } />
            
            <Route path="/marketing" element={
              <ProtectedRoute requiredRole={['CEO', 'CCO', 'Marketing Manager']} requireVoiceAuth={true}>
                <MarketingPage />
              </ProtectedRoute>
            } />
            
            <Route path="/social-media-ads" element={
              <ProtectedRoute requiredRole={['CEO', 'CCO', 'Marketing Manager', 'Social Media Manager']}>
                <SocialMediaAdsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/reorder-reminder" element={
              <ProtectedRoute requiredRole={['CEO', 'CCO', 'Marketing Manager', 'Customer Support']}>
                <ReorderReminderPage />
              </ProtectedRoute>
            } />
            
            <Route path="/inventory" element={
              <ProtectedRoute requiredRole={['CEO', 'CCO', 'Commercial Director', 'Regional Manager']} requireVoiceAuth={true}>
                <InventoryPage />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute requiredRole={['CEO', 'CCO']} requireVoiceAuth={true}>
                <ReportsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/preferences" element={
              <ProtectedRoute>
                <PreferencesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings/system" element={
              <ProtectedRoute requiredRole="CEO" requireVoiceAuth={true}>
                <SystemSettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
          <ConditionalAiAssistant />
          <RoleDebugPanel /> {/* Add the RoleDebugPanel here */}
        </TooltipProvider>
      </ToastProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;