// src/pages/VoiceLoginPage.tsx - NEW FILE (EXAMPLE)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceLogin from '../components/VoiceLogin';

const VoiceLoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Handle successful voice authentication
  const handleVoiceSuccess = () => {
    console.log('Voice authentication successful');
    
    // Wait a moment before redirecting (for better UX)
    setTimeout(() => {
      // Redirect to dashboard or protected page
      navigate('/dashboard');
    }, 1500);
  };
  
  // Handle voice authentication error
  const handleVoiceError = (error: string) => {
    console.error('Voice authentication error:', error);
    // You can add additional error handling here
  };
  
  return (
    <div className="page-container">
      <div className="auth-header">
        <h1>Welcome to Scent of Luxury</h1>
        <p>Please authenticate with your voice to continue</p>
      </div>
      
      {/* Voice Login Component */}
      <VoiceLogin 
        onSuccess={handleVoiceSuccess}
        onError={handleVoiceError}
        passphrase="scent of luxury"
      />
      
      <div className="auth-alternatives">
        <p>Having trouble with voice authentication?</p>
        <button 
          className="text-button"
          onClick={() => navigate('/login')}
        >
          Use password instead
        </button>
      </div>
    </div>
  );
};

export default VoiceLoginPage;