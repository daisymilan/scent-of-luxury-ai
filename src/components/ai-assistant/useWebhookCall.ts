
import { useState } from 'react';
import { callGrokApi, getGrokApiConfig } from '@/utils/grokApi';

interface WebhookCallOptions {
  webhookUrl: string;
  user?: {
    role: string;
    id: string;
    name: string;
  };
  onError: (message: string, id: string) => void;
}

// Helper function to create a mock response based on the query
const createMockResponse = (query: string) => {
  const lowerCommand = query.toLowerCase();
  
  if (lowerCommand.includes('sales') || lowerCommand.includes('revenue')) {
    return {
      type: "mock_response",
      data: {
        sales: {
          total: 22400,
          increase: "12.4%",
          bestProduct: "Dune Fragrance",
          unitsSold: 128
        }
      },
      message: `Sales are up 12.4% compared to last month. The best performing product is Dune Fragrance with 128 units sold, generating $22,400 in revenue. Would you like a detailed breakdown by product category or sales channel?`
    };
  }
  
  if (lowerCommand.includes('inventory') || lowerCommand.includes('stock')) {
    return {
      type: "mock_response",
      data: {
        inventory: {
          "Moon Dust": 254,
          "Dune": 128,
          "Dahab": 89
        },
        alerts: [
          {
            product: "Moon Dust",
            location: "Las Vegas",
            quantity: 28,
            status: "low"
          }
        ]
      },
      message: `Current inventory status: Moon Dust: 254 units, Dune: 128 units, Dahab: 89 units. The Las Vegas warehouse is running low on Moon Dust with only 28 units remaining. Should I prepare a reorder report?`
    };
  }
  
  return {
    type: "mock_response",
    query,
    message: `I understand you're asking about "${query}". As this is a demonstration, I can provide insights on sales, inventory, orders, KPIs, and marketing campaigns.`
  };
};

// Helper function to call the webhook API
const callWebhookApi = async (webhookUrl: string, webhookPayload: any) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      console.error('Webhook error response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`Webhook error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling webhook:', error);
    throw error;
  }
};

// Helper function to format the response
const formatResponse = (data: any): string => {
  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2);
  }
  return String(data);
};

export function useWebhookCall({ webhookUrl, user, onError }: WebhookCallOptions) {
  const [isThinking, setIsThinking] = useState(false);
  const [isWebhookFailed, setIsWebhookFailed] = useState(false);
  const [response, setResponse] = useState('');
  const [rawResponse, setRawResponse] = useState<any>(null);
  
  const prepareWebhookPayload = (query: string) => {
    return {
      query,
      user: user ? {
        role: user.role,
        id: user.id,
        name: user.name
      } : {
        role: 'Guest',
        id: 'guest',
        name: 'Guest User'
      },
      timestamp: new Date().toISOString()
    };
  };

  const handleWebhookSuccess = (data: any) => {
    setRawResponse(data);
    const responseText = formatResponse(data);
    console.log('Raw response text:', responseText);
    setResponse(responseText);
    return { success: true, response: responseText, rawResponse: data };
  };

  const handleWebhookFailure = async (error: any, query: string) => {
    setIsWebhookFailed(true);
    onError('Could not connect to the webhook service.', `error-${Date.now()}`);
    
    // Try Grok API fallback
    const isGrokConfigured = !!getGrokApiConfig();
    if (isGrokConfigured) {
      console.log('Falling back to Grok API');
      const grokResponse = await callGrokApi(query);
      setRawResponse({ grok_fallback_response: grokResponse });
      setResponse(grokResponse);
      return { success: true, response: grokResponse, rawResponse: { grok_fallback_response: grokResponse } };
    }
    
    // If both webhook and Grok failed, use mock implementation
    console.log('Using mock implementation');
    const mockResponse = createMockResponse(query);
    const mockResponseText = JSON.stringify(mockResponse, null, 2);
    setRawResponse(mockResponse);
    setResponse(mockResponseText);
    return { success: true, response: mockResponseText, rawResponse: mockResponse };
  };

  const handleError = (error: any) => {
    console.error('Error processing query:', error);
    onError("Unable to process your request right now. Please try again later.", `error-${Date.now()}`);
    
    const errorResponse = {
      error: true,
      message: "I'm sorry, I couldn't process your request at this time. Please try again later.",
      details: error instanceof Error ? error.message : "Unknown error"
    };
    
    setResponse(JSON.stringify(errorResponse, null, 2));
    setRawResponse(errorResponse);
    return { success: false, response: JSON.stringify(errorResponse, null, 2), error };
  };
  
  const callWebhook = async (query: string) => {
    setIsThinking(true);
    setResponse('');
    setRawResponse(null);
    setIsWebhookFailed(false);
    
    try {
      console.log('Calling webhook with query:', query);
      console.log('Webhook URL:', webhookUrl);
      
      const webhookPayload = prepareWebhookPayload(query);
      console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));
      
      try {
        const data = await callWebhookApi(webhookUrl, webhookPayload);
        return handleWebhookSuccess(data);
      } catch (error) {
        return await handleWebhookFailure(error, query);
      }
    } catch (error) {
      return handleError(error);
    } finally {
      setIsThinking(false);
    }
  };
  
  return {
    callWebhook,
    isThinking,
    isWebhookFailed,
    response,
    rawResponse,
  };
}
