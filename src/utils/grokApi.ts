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
  return HARDCODED_GROK_CONFIG || 
    (localStorage.getItem('grok_api_config') ? 
      JSON.parse(localStorage.getItem('grok_api_config')!) : null);
};

// Default configuration
export const DEFAULT_GROK_CONFIG: GrokApiConfig = {
  apiKey: '',
  model: 'grok-1',
};

// Hardcoded configuration for immediate use
// In a production environment, this would be loaded from a secure environment variable
export const HARDCODED_GROK_CONFIG: GrokApiConfig = {
  apiKey: 'xai-lgYF3e2MO1TvHnXhq0UCKYSwDtUOBkNmL0fnOEw4FBniTHDnC6KG',
  model: 'grok-3',
};

// Call Grok API function
export const callGrokApi = async (
  query: string,
  systemPrompt: string = 'You are a helpful assistant for MiN NEW YORK, a luxury fragrance brand. Provide concise, insightful responses about business metrics, sales data, and marketing strategies.'
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
      response = `Sales are up 12.4% compared to last month. The best performing product is Dune Fragrance with 128 units sold, generating $22,400 in revenue. Weekly total revenue is $32,450 with most popular locations being Las Vegas and Dubai.`;
    } else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      response = `Current inventory status: Moon Dust: 254 units, Dune: 128 units, Dahab: 89 units. The Las Vegas warehouse is running low on Moon Dust with only 28 units remaining. Riyadh warehouse has excess stock of Coda (312 units) that could be redistributed.`;
    } else if (lowerQuery.includes('order') || lowerQuery.includes('purchase')) {
      response = `Today we've received 37 new orders totaling $8,450. There are 5 pending shipments and 2 orders flagged for review due to potential fraud. Overall shipping times have improved by 8% this week.`;
    } else if (lowerQuery.includes('marketing') || lowerQuery.includes('campaign')) {
      response = `The current Instagram campaign has reached 245,000 impressions with a 3.8% engagement rate. This is 0.7% above our benchmarks. The TikTok campaign is launching tomorrow with an expected reach of 180,000 users. We've identified three key influencers for potential partnerships.`;
    } else if (lowerQuery.includes('customer') || lowerQuery.includes('client')) {
      response = `We have acquired 128 new customers this month, a 15% increase from last month. Customer retention rate is at 78%, and our net promoter score has increased to 72. Luxury Retreat Spa has placed the largest B2B order this month at $4,250.`;
    } else if (lowerQuery.includes('competitor') || lowerQuery.includes('market')) {
      response = `Our market share has grown to 4.2% in the luxury fragrance segment. Main competitors Byredo and Nishane have launched new collections this quarter. Our price point remains competitive at 15% below Creed while maintaining similar quality ratings.`;
    } else if (lowerQuery.includes('social') || lowerQuery.includes('engagement')) {
      response = `Social media engagement is up across all platforms: Instagram +12%, TikTok +24%, Facebook +5%. The Dubai Mall post received the highest engagement with 5,200 likes and 430 comments. Recommended focus is on Instagram Reels and TikTok for the upcoming collection launch.`;
    } else if (lowerQuery.includes('production') || lowerQuery.includes('manufacturing')) {
      response = `Current production capacity is at 82% utilization. The new Moon Dust batch will be completed by May 15th. Production costs have decreased by 3.2% due to bulk ordering of essential oils. We need to address a potential delay with our glass bottle supplier.`;
    } else if (lowerQuery.includes('forecast') || lowerQuery.includes('predict')) {
      response = `Based on current trends, we forecast a 22% revenue increase for Q2 2025. The summer collection is projected to drive 35% of this growth. Key markets showing the strongest growth potential are UAE (+28%), US (+18%), and France (+15%).`;
    } else if (lowerQuery.includes('woocommerce') || lowerQuery.includes('store')) {
      response = `The WooCommerce store has processed 127 orders in the last 7 days with an average order value of $175. Top selling products are Dune Fragrance (38 units), Moon Dust (27 units), and Dahab (19 units). Cart abandonment rate is 32%, which is 5% lower than last month.`;
    } else if (lowerQuery.includes('b2b') || lowerQuery.includes('wholesale')) {
      response = `We currently have 24 active B2B accounts, with 3 new wholesale inquiries this week. The average B2B order value is $3,750, which is 21.5x higher than our direct consumer average. The Dubai market is showing the strongest B2B growth at 34% month-over-month.`;
    } else {
      response = `I understand you're asking about "${query}". Here's a high-level overview of our current business performance: Sales are trending up 12.4% month-over-month, with Dune Fragrance as our top seller. Inventory levels are balanced except for Moon Dust in Las Vegas (low) and Coda in Riyadh (high). Our Instagram and TikTok campaigns are performing above benchmarks. Would you like specific details on any of these areas?`;
    }

    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

// Analyze text sentiment using Grok API
export const analyzeTextSentiment = async (text: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  keywords: string[];
}> => {
  try {
    console.log('Analyzing text sentiment:', text.substring(0, 50) + '...');
    
    // Simulate API call with mock response
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple mock sentiment analysis based on keywords
    const lowerText = text.toLowerCase();
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'increase', 'up', 'growth', 'profit', 'success'];
    const negativeWords = ['bad', 'poor', 'terrible', 'hate', 'decrease', 'down', 'loss', 'fail', 'issue', 'problem'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    const totalWords = text.split(/\s+/).length;
    const score = ((positiveCount - negativeCount) / totalWords) * 5 + 5; // Normalize to 0-10 scale
    
    let sentiment: 'positive' | 'neutral' | 'negative';
    if (score > 6) sentiment = 'positive';
    else if (score < 4) sentiment = 'negative';
    else sentiment = 'neutral';
    
    // Extract possible keywords
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'to', 'of', 'for', 'in', 'on', 'by', 'at', 'with'];
    const filteredWords = words.filter(word => !stopWords.includes(word) && word.length > 3);
    
    // Count word frequency
    const wordFrequency: Record<string, number> = {};
    filteredWords.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Get top 5 most frequent words as keywords
    const keywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    return {
      sentiment,
      score: Math.round(score * 10) / 10, // Round to 1 decimal place
      keywords
    };
  } catch (error) {
    console.error('Error analyzing text sentiment:', error);
    throw error;
  }
};

// Generate marketing suggestions using Grok
export const generateMarketingSuggestions = async (
  product: string,
  target: string,
  channel: string
): Promise<string[]> => {
  try {
    console.log(`Generating marketing suggestions for ${product} targeting ${target} on ${channel}`);
    
    // Simulate API call with mock response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock suggestions based on inputs
    const suggestions: string[] = [];
    
    if (channel.toLowerCase().includes('instagram')) {
      suggestions.push(`Create carousel posts featuring ${product} in lifestyle settings appealing to ${target}.`);
      suggestions.push(`Partner with ${target}-focused influencers for sponsored posts about ${product}.`);
      suggestions.push(`Run an Instagram Story poll asking followers what they love most about ${product}.`);
      suggestions.push(`Host an Instagram Live featuring a master perfumer discussing the creation process of ${product}.`);
      suggestions.push(`Create Reels showing the unboxing experience of ${product} with luxury packaging.`);
    } else if (channel.toLowerCase().includes('tiktok')) {
      suggestions.push(`Create short-form videos showing the unique scent notes of ${product} with visual representations.`);
      suggestions.push(`Start a TikTok challenge where ${target} can showcase how and where they wear ${product}.`);
      suggestions.push(`Partner with TikTok creators who appeal to ${target} for authentic reviews of ${product}.`);
      suggestions.push(`Use trending sounds to create engaging content featuring ${product} in aspirational settings.`);
      suggestions.push(`Create behind-the-scenes content showing how ${product} is crafted for the luxury market.`);
    } else if (channel.toLowerCase().includes('facebook')) {
      suggestions.push(`Run targeted ads for ${product} specifically designed for ${target} demographics.`);
      suggestions.push(`Create a Facebook Group for enthusiasts of luxury fragrances like ${product}.`);
      suggestions.push(`Host Facebook Live events featuring Q&A sessions about ${product} with perfume experts.`);
      suggestions.push(`Share customer testimonials and reviews of ${product} from ${target} customers.`);
      suggestions.push(`Run a limited-time offer promotion for ${product} exclusive to Facebook followers.`);
    } else if (channel.toLowerCase().includes('email')) {
      suggestions.push(`Create a segmented email campaign highlighting ${product} benefits specifically for ${target}.`);
      suggestions.push(`Design a visually stunning email showcasing ${product} with exclusive early access for subscribers.`);
      suggestions.push(`Send personalized product recommendations featuring ${product} based on past purchases.`);
      suggestions.push(`Create an email series telling the story behind the creation of ${product}.`);
      suggestions.push(`Offer a sample with purchase promotion for ${product} via email to ${target} customers.`);
    } else {
      suggestions.push(`Create high-quality content featuring ${product} that resonates with ${target}.`);
      suggestions.push(`Develop a multi-channel campaign highlighting the unique selling points of ${product}.`);
      suggestions.push(`Partner with retailers that cater to ${target} to feature ${product} prominently.`);
      suggestions.push(`Create limited edition packaging for ${product} that appeals specifically to ${target}.`);
      suggestions.push(`Organize exclusive events to showcase ${product} to key ${target} customers and influencers.`);
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error generating marketing suggestions:', error);
    throw error;
  }
};

// Forecast sales using Grok and historical data
export const forecastSales = async (
  productId: number,
  months: number = 3
): Promise<{
  predictions: number[];
  growthRate: number;
  confidence: number;
}> => {
  try {
    console.log(`Forecasting sales for product ID ${productId} for next ${months} months`);
    
    // Simulate API call with mock response
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock sales data based on product ID
    const mockHistoricalData = {
      1: [120, 132, 128, 145, 158, 172], // Dahab Eau de Parfum
      2: [98, 105, 112, 108, 115, 125],  // Moon Dust Eau de Parfum
      3: [128, 142, 156, 168, 175, 192], // Dune Eau de Parfum
      4: [67, 72, 78, 85, 92, 98],       // Coda Eau de Parfum
      5: [215, 206, 228, 235, 250, 268]  // Moon Dust Sample Set
    };
    
    // Get historical data for this product
    const productData = mockHistoricalData[productId] || 
      [100, 105, 110, 115, 120, 125]; // Default if product not found
    
    // Simple forecasting logic (in reality would use more advanced algorithms)
    const lastMonthSales = productData[productData.length - 1];
    const predictions: number[] = [];
    
    // Calculate average growth rate from historical data
    let totalGrowth = 0;
    for (let i = 1; i < productData.length; i++) {
      totalGrowth += (productData[i] - productData[i - 1]) / productData[i - 1];
    }
    const avgGrowthRate = totalGrowth / (productData.length - 1);
    
    // Generate predictions with some randomness
    let previousMonth = lastMonthSales;
    for (let i = 0; i < months; i++) {
      const randomFactor = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
      const nextMonth = Math.round(previousMonth * (1 + avgGrowthRate * randomFactor));
      predictions.push(nextMonth);
      previousMonth = nextMonth;
    }
    
    // Calculate overall growth rate for forecast period
    const growthRate = (predictions[predictions.length - 1] - lastMonthSales) / lastMonthSales;
    
    // Assign confidence score based on past data consistency
    let variability = 0;
    for (let i = 1; i < productData.length; i++) {
      const monthGrowth = (productData[i] - productData[i - 1]) / productData[i - 1];
      variability += Math.abs(monthGrowth - avgGrowthRate);
    }
    const avgVariability = variability / (productData.length - 1);
    
    // Convert variability to confidence (lower variability = higher confidence)
    const confidence = Math.min(0.95, Math.max(0.5, 1 - avgVariability * 5));
    
    return {
      predictions,
      growthRate: parseFloat((growthRate * 100).toFixed(1)),
      confidence: parseFloat((confidence * 100).toFixed(1))
    };
  } catch (error) {
    console.error('Error forecasting sales:', error);
    throw error;
  }
};

// Get product recommendations using Grok
export const getProductRecommendations = async (
  productId: number,
  customerType: 'new' | 'returning' = 'new'
): Promise<number[]> => {
  try {
    console.log(`Getting product recommendations for product ID ${productId}, customer type: ${customerType}`);
    
    // Simulate API call with mock response
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Mock product recommendation data
    const recommendationMap = {
      1: { new: [3, 5, 4], returning: [2, 4, 3] },   // Dahab Eau de Parfum
      2: { new: [1, 3, 5], returning: [4, 1, 3] },   // Moon Dust Eau de Parfum
      3: { new: [1, 2, 4], returning: [1, 5, 2] },   // Dune Eau de Parfum
      4: { new: [3, 1, 2], returning: [1, 3, 5] },   // Coda Eau de Parfum
      5: { new: [2, 3, 1], returning: [2, 1, 3] }    // Moon Dust Sample Set
    };
    
    // Return recommendations for this product and customer type
    if (recommendationMap[productId]) {
      return recommendationMap[productId][customerType];
    }
    
    // Default recommendations if product not found
    return customerType === 'new' ? [1, 2, 3] : [3, 4, 5];
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    throw error;
  }
};

// New function for performing WooCommerce-specific analysis
export const analyzeWooCommerceData = async (
  dataType: 'sales' | 'inventory' | 'customers' | 'orders',
  timeRange: 'day' | 'week' | 'month' | 'quarter' = 'week',
  productId?: number
): Promise<string> => {
  try {
    console.log(`Analyzing WooCommerce ${dataType} data for ${timeRange} timeframe`);
    
    // Simulate API call with mock response
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate response based on data type requested
    switch (dataType) {
      case 'sales':
        return `Sales Analysis (${timeRange}): 
          - Total Revenue: $32,450 (${timeRange === 'day' ? '+5.2%' : timeRange === 'week' ? '+12.4%' : '+18.7%'} vs previous ${timeRange})
          - Units Sold: ${timeRange === 'day' ? '42' : timeRange === 'week' ? '187' : '745'}
          - Average Order Value: $${timeRange === 'day' ? '172' : timeRange === 'week' ? '175' : '182'}
          - Top Product: ${productId ? `Product #${productId}` : 'Dune Fragrance'} (${timeRange === 'day' ? '12' : timeRange === 'week' ? '38' : '145'} units)
          - Best Performing Location: ${timeRange === 'day' ? 'Dubai' : 'Las Vegas'}
          - Most Effective Channel: ${timeRange === 'day' ? 'Direct Website' : timeRange === 'week' ? 'Instagram Shop' : 'Wholesale B2B'}`;
        
      case 'inventory':
        return `Inventory Analysis (current):
          - Total SKUs: 27
          - Total Units: 2,345
          - Low Stock Alerts: Moon Dust (Las Vegas - 28 units)
          - Excess Stock: Coda (Riyadh - 312 units)
          - Recommended Restock: Moon Dust (Las Vegas) - order 100 units
          - Recommended Redistribution: Move 100 units of Coda from Riyadh to Dubai
          ${productId ? `- Product #${productId} Status: 175 units across all locations` : ''}`;
          
      case 'customers':
        return `Customer Analysis (${timeRange}):
          - New Customers: ${timeRange === 'day' ? '8' : timeRange === 'week' ? '34' : '128'}
          - Repeat Customers: ${timeRange === 'day' ? '12' : timeRange === 'week' ? '53' : '196'}
          - Average LTV: $${timeRange === 'day' ? '450' : timeRange === 'week' ? '475' : '520'}
          - Customer Growth: ${timeRange === 'day' ? '+4.2%' : timeRange === 'week' ? '+8.7%' : '+15.3%'} vs previous ${timeRange}
          - Top Customer Segment: ${timeRange === 'day' ? 'Urban Professionals' : 'Luxury Enthusiasts'}
          - Retention Rate: ${timeRange === 'day' ? '71%' : timeRange === 'week' ? '75%' : '78%'}`;
          
      case 'orders':
        return `Order Analysis (${timeRange}):
          - Total Orders: ${timeRange === 'day' ? '24' : timeRange === 'week' ? '127' : '485'}
          - Pending Shipments: ${timeRange === 'day' ? '5' : timeRange === 'week' ? '12' : '24'}
          - Average Processing Time: ${timeRange === 'day' ? '1.2' : timeRange === 'week' ? '1.4' : '1.5'} days
          - Order Growth: ${timeRange === 'day' ? '+3.8%' : timeRange === 'week' ? '+7.2%' : '+12.5%'} vs previous ${timeRange}
          - Rush Orders: ${timeRange === 'day' ? '3' : timeRange === 'week' ? '15' : '48'}
          ${productId ? `- Orders with Product #${productId}: ${timeRange === 'day' ? '7' : timeRange === 'week' ? '22' : '78'} orders` : ''}`;
          
      default:
        return `No analysis available for the requested data type: ${dataType}`;
    }
  } catch (error) {
    console.error(`Error analyzing WooCommerce ${dataType} data:`, error);
    throw error;
  }
};
