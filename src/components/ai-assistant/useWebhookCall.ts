
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

export function useWebhookCall({ webhookUrl, user, onError }: WebhookCallOptions) {
  const [isThinking, setIsThinking] = useState(false);
  const [isWebhookFailed, setIsWebhookFailed] = useState(false);
  const [response, setResponse] = useState('');
  const [rawResponse, setRawResponse] = useState<any>(null);
  
  const callWebhook = async (query: string) => {
    setIsThinking(true);
    setResponse('');
    setRawResponse(null);
    setIsWebhookFailed(false);
    
    try {
      let responseText;
      let webhookSuccess = false;
      
      console.log('Calling webhook with query:', query);
      console.log('Webhook URL:', webhookUrl);
      
      const webhookPayload = {
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
      
      console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));
      
      try {
        // Important: Remove 'mode: "no-cors"' to actually receive the webhook response
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });

        if (response.ok) {
          console.log('Webhook response status:', response.status);
          // Parse response as JSON
          const data = await response.json();
          console.log('Webhook full response:', data);
          
          // Store the complete raw response
          setRawResponse(data);
          
          // For speech synthesis and display, use a string representation
          if (typeof data === 'object') {
            responseText = JSON.stringify(data, null, 2);
          } else {
            responseText = String(data);
          }
                        
          console.log('Raw response text:', responseText);
          webhookSuccess = true;
        } else {
          console.error('Webhook error response:', response.status, response.statusText);
          // Try to get error details
          const errorText = await response.text();
          console.error('Response error text:', errorText);
          throw new Error(`Webhook error: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error calling webhook:', error);
        setIsWebhookFailed(true);
        
        // Show error dialog
        onError('Could not connect to the webhook service.', `error-${Date.now()}`);
        
        // If webhook fails, try Grok or fallback
        const isGrokConfigured = !!getGrokApiConfig();
        if (isGrokConfigured) {
          console.log('Falling back to Grok API');
          const grokResponse = await callGrokApi(query);
          responseText = grokResponse;
          setRawResponse({ grok_fallback_response: grokResponse });
          webhookSuccess = true;
        } else {
          throw error;
        }
      }
      
      // If both webhook and Grok failed, use mock implementation
      if (!webhookSuccess) {
        console.log('Using mock implementation');
        const lowerCommand = query.toLowerCase();
        let mockResponse: any = {};
        
        if (lowerCommand.includes('sales') || lowerCommand.includes('revenue')) {
          mockResponse = {
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
        } else if (lowerCommand.includes('inventory') || lowerCommand.includes('stock')) {
          mockResponse = {
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
        } else {
          mockResponse = {
            type: "mock_response",
            query,
            message: `I understand you're asking about "${query}". As this is a demonstration, I can provide insights on sales, inventory, orders, KPIs, and marketing campaigns.`
          };
        }
        
        responseText = JSON.stringify(mockResponse, null, 2);
        setRawResponse(mockResponse);
      }
      
      console.log('Final AI response:', responseText);
      setResponse(responseText);
      return { success: true, response: responseText, rawResponse };
    } catch (error) {
      console.error('Error processing query:', error);
      
      // Show error in dialog
      onError("Unable to process your request right now. Please try again later.", `error-${Date.now()}`);
      
      const errorResponse = {
        error: true,
        message: "I'm sorry, I couldn't process your request at this time. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error"
      };
      setResponse(JSON.stringify(errorResponse, null, 2));
      setRawResponse(errorResponse);
      return { success: false, response: JSON.stringify(errorResponse, null, 2), error };
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
