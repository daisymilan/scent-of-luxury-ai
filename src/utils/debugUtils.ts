
/**
 * Debug utilities to help troubleshoot environment and deployment issues
 */

/**
 * Log environment information to the console
 */
export const logEnvironmentInfo = () => {
  console.log('Environment Debug Info:');
  console.log('-----------------------');
  console.log(`NODE_ENV: ${import.meta.env.MODE || 'not set'}`);
  console.log(`VITE_BACKEND_URL: ${import.meta.env.VITE_BACKEND_URL || 'not set'}`);
  console.log(`Base URL: ${window.location.origin}`);
  console.log(`User Agent: ${navigator.userAgent}`);
};

/**
 * Check if all required environment variables are set
 * @returns Object containing information about missing variables
 */
export const checkRequiredEnvVars = () => {
  const missingVars: string[] = [];
  const requiredVars = ['VITE_BACKEND_URL'];
  
  requiredVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  return {
    allPresent: missingVars.length === 0,
    missing: missingVars
  };
};
