export interface GrokApiConfig {
  apiKey: string;
  model: string;
}

export const DEFAULT_GROK_CONFIG: GrokApiConfig = {
  apiKey: '',
  model: 'grok-1',
};

const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY || '';
const GROK_API_URL = import.meta.env.VITE_GROK_API_URL || 'https://api.grok.com/v1/chat';

export const HARDCODED_GROK_CONFIG: GrokApiConfig | null = GROK_API_KEY
  ? { apiKey: GROK_API_KEY, model: 'grok-1' }
  : null;

export const saveGrokApiConfig = (config: GrokApiConfig): void => {
  localStorage.setItem('grok_api_config', JSON.stringify(config));
};

export const getGrokApiConfig = (): GrokApiConfig | null => {
  if (HARDCODED_GROK_CONFIG) return HARDCODED_GROK_CONFIG;

  const saved = localStorage.getItem('grok_api_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved Grok config:', e);
    }
  }
  return null;
};

export const callGrokApi = async (prompt: string): Promise<string> => {
  const config = getGrokApiConfig();
  if (!config?.apiKey) throw new Error('Grok API configuration not found');

  try {
    const res = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a business intelligence assistant that helps analyze data and provide insights for a WooCommerce store. Be concise and focused. Provide specific, actionable recommendations when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Grok API Error:', res.status, text);
      throw new Error(`Grok API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response content';
  } catch (err) {
    console.error('Error calling Grok API:', err);
    throw err;
  }
};

export const analyzeProductWithGrok = async (product: any) => {
  try {
    const res = await fetch('/api/grok-analyze', {
      method: 'POST',
      body: JSON.stringify({ product }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error('Grok request failed');
    return await res.json();
  } catch (err) {
    console.error('Grok error:', err);
    return { error: err.message || 'Unknown Grok error' };
  }
};
