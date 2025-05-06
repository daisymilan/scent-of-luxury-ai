
/**
 * Grok AI API utility for interacting with the Grok API
 */

// Grok API Configuration Types
export interface GrokApiConfig {
  apiKey: string;
  model: string;
}

// Store credentials in localStorage (temporary solution)
export const saveGrokApiConfig = (config: GrokApiConfig) => {
  localStorage.setItem('grok_api_config', JSON.stringify(config));
};

export const getGrokApiConfig = (): GrokApiConfig | null => {
  // Return hardcoded config first, if not available check localStorage
  return HARDCODED_GROK_CONFIG || localStorage.getItem('grok_api_config') ? JSON.parse(localStorage.getItem('grok_api_config')!) : null;
};

// Default configuration
export const DEFAULT_GROK_CONFIG: GrokApiConfig = {
  apiKey: '',
  model: 'grok-1',
};

// Hardcoded configuration for immediate use
export const HARDCODED_GROK_CONFIG: GrokApiConfig = {
  apiKey: 'xai-lgYF3e2MO1TvHnXhq0UCKYSwDtUOBkNmL0fnOEw4FBniTHDnC6KG',
  model: 'grok-3',
};

// Call Grok API function
export const callGrokApi = async (
  query: string,
  systemPrompt: string = 'You are a helpful assistant for MiN NEW YORK, a luxury fragrance brand. Provide concise, insightful responses about business metrics.'
): Promise<string> => {
  // Always use hardcoded config if available
  const config = HARDCODED_GROK_CONFIG || getGrokApiConfig();
  if (!config || !config.apiKey) {
    throw new Error('Grok API key not configured');
  }

  try {
    console.log('Calling Grok API with query:', query);
    
    // In a production environment, this would be an actual API call
    // For demonstration purposes, we're returning mock responses based on the query
    const lowerQuery = query.toLowerCase();
    let response = '';

    if (lowerQuery.includes('sales') || lowerQuery.includes('revenue')) {
      response = `Sales are up 12.4% compared to last month. The best performing product is Dune Fragrance with 128 units sold, generating $22,400 in revenue.`;
    } else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      response = `Current inventory status: Moon Dust: 254 units, Dune: 128 units, Dahab: 89 units. The Las Vegas warehouse is running low on Moon Dust with only 28 units remaining.`;
    } else if (lowerQuery.includes('order') || lowerQuery.includes('purchase')) {
      response = `Today we've received 37 new orders totaling $8,450. There are 5 pending shipments and 2 orders flagged for review due to potential fraud.`;
    } else if (lowerQuery.includes('marketing') || lowerQuery.includes('campaign')) {
      response = `The current Instagram campaign has reached 245,000 impressions with a 3.8% engagement rate. This is 0.7% above our benchmarks. The TikTok campaign is launching tomorrow.`;
    } else {
      response = `I understand you're asking about "${query}". As this is a demonstration, I can provide insights on sales, inventory, orders, and marketing campaigns. Please try asking about one of these areas.`;
    }

    return response;

    /* In production, the actual API call would look something like this:
    const response = await fetch('https://api.grok.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ]
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
    */
  } catch (error) {
    console.error('Error calling Grok API:', error);
    throw error;
  }
};
