
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { WooCommerceProvider } from '@/utils/woocommerce/hooks'
import { ThemeProvider } from 'next-themes'
import { logEnvironmentInfo, checkRequiredEnvVars } from '@/utils/debugUtils'

// Log environment information during startup
if (import.meta.env.MODE === 'production') {
  console.log('🚀 Production mode detected');
  const envCheck = checkRequiredEnvVars();
  if (!envCheck.allPresent) {
    console.warn('⚠️ Missing required environment variables:', envCheck.missing);
  }
} else {
  logEnvironmentInfo();
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light">
          <WooCommerceProvider>
            <App />
            <Toaster />
          </WooCommerceProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
