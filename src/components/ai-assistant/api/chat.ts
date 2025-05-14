
// This is a placeholder API for the chat functionality
// In a real app, this would connect to an actual AI service

export async function submitChatRequest(message: string) {
  console.log("Processing chat request:", message);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple responses based on keywords in the message
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    };
  }
  
  if (message.toLowerCase().includes('help')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I can help you with information about products, inventory, sales, and more. What would you like to know?'
    };
  }
  
  if (message.toLowerCase().includes('sales') || message.toLowerCase().includes('revenue')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Sales are up 12.4% compared to last month. The best performing product is Dune Fragrance with 128 units sold, generating $22,400 in revenue. Would you like a detailed breakdown by product category or sales channel?'
    };
  }
  
  if (message.toLowerCase().includes('inventory') || message.toLowerCase().includes('stock')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Current inventory status: Moon Dust: 254 units, Dune: 128 units, Dahab: 89 units. The Las Vegas warehouse is running low on Moon Dust with only 28 units remaining. Should I prepare a reorder report?'
    };
  }
  
  // Default response
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: `I understand you're asking about "${message}". As this is a demonstration, I can provide insights on sales, inventory, orders, KPIs, and marketing campaigns. Could you please provide more details about what you'd like to know?`
  };
}
