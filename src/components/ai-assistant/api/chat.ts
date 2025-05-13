
// This is a placeholder API for the chat functionality
// In a real app, this would connect to an actual AI service

export async function submitChatRequest(message: string) {
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
  
  // Default response
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: 'I understand you\'re interested in this topic. Could you please provide more details so I can assist you better?'
  };
}
