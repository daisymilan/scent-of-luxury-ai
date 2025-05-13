// src/App.tsx - UPDATED VERSION

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

// Import the voice authentication styles
import "./styles/VoiceAuth.css";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Voice Login - should be accessible after basic authentication */}
        <Route path="/voice-login" element={<VoiceLoginPage />} />
        
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected Routes - now requiring voice authentication for high-security areas */}
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
      <AiAssistant />
    </TooltipProvider>
  </AuthProvider>
);

export default App;