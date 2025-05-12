
// This file defines the interfaces and functions for interacting with the Grok API

export interface GrokApiConfig {
  apiKey: string;
  model: string;
}

export const DEFAULT_GROK_CONFIG: GrokApiConfig = {
  apiKey: '',
  model: 'grok-1',
};

// Try to load hardcoded API credentials from environment variables
const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = process.env.GROK_API_URL;

// Create a hardcoded config object if environment variables are available
export const HARDCODED_GROK_CONFIG: GrokApiConfig | null = GROK_API_KEY ? {
  apiKey: GROK_API_KEY,
  model: 'grok-1',
} : null;

// Save config to localStorage
export const saveGrokApiConfig = (config: GrokApiConfig): void => {
  localStorage.setItem('grok_api_config', JSON.stringify(config));
};

// Get config from localStorage or return null if not found
export const getGrokApiConfig = (): GrokApiConfig | null => {
  // First check for hardcoded credentials
  if (HARDCODED_GROK_CONFIG) {
    return HARDCODED_GROK_CONFIG;
  }
  
  // Then try to load from localStorage
  const savedConfig = localStorage.getItem('grok_api_config');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('Error parsing saved Grok API config:', error);
      return null;
    }
  }
  return null;
};

// Call Grok API with a prompt
export const callGrokApi = async (prompt: string): Promise<string> => {
  const config = getGrokApiConfig();
  if (!config || !config.apiKey) {
    throw new Error('Grok API configuration not found');
  }

  try {
    const apiUrl = GROK_API_URL || 'https://api.grok.com/v1/chat';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a business intelligence assistant that helps analyze data and provide insights for a WooCommerce store. Be concise and focused. Provide specific, actionable recommendations when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error response:', response.status, errorText);
      throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Grok API:', error);
    throw error;
  }
};
