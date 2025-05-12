
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
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
import UnauthorizedPage from "./pages/UnauthorizedPage";
import VoiceLoginPage from "./pages/VoiceLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import SocialMediaAdsPage from "./pages/SocialMediaAdsPage";
import ReorderReminderPage from "./pages/ReorderReminderPage";
import AiAssistant from "./components/ai-assistant/AiAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/voice-login" element={<VoiceLoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          
          <Route path="/b2b" element={
            <ProtectedRoute requiredRole={['CEO', 'CCO', 'Commercial Director']}>
              <B2BPage />
            </ProtectedRoute>
          } />
          
          <Route path="/marketing" element={
            <ProtectedRoute requiredRole={['CEO', 'CCO', 'Marketing Manager']}>
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
            <ProtectedRoute requiredRole={['CEO', 'CCO', 'Commercial Director', 'Regional Manager']}>
              <InventoryPage />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute requiredRole={['CEO', 'CCO']}>
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
            <ProtectedRoute requiredRole="CEO">
              <SystemSettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
        <AiAssistant />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
