
import { WooCommerceConfig, getWooCommerceConfig, WOO_API_BASE_URL } from './config';
import { fetchWooCommerceData } from './apiClient';
import { B2BKingGroup, B2BKingUser, B2BKingRule } from './types';

// Endpoint for B2BKing REST API
const B2BKING_API_BASE = `${WOO_API_BASE_URL}/b2bking`;

// Enhanced error handling for B2BKing API calls
const handleB2BKingApiCall = async <T,>(
  endpoint: string,
  config?: WooCommerceConfig
): Promise<T> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log(`Fetching B2BKing data for endpoint: ${endpoint}`);
    return await fetchWooCommerceData<T>(endpoint, wooConfig);
  } catch (error) {
    console.error(`Error fetching B2BKing data for ${endpoint}:`, error);
    
    // Check if error is 404 (endpoint not found) - B2BKing plugin might not be installed
    if (error instanceof Error && error.message.includes('404')) {
      console.error(`B2BKing endpoint ${endpoint} not found. Please make sure B2BKing plugin is installed and activated.`);
      throw new Error(`B2BKing endpoint not available: ${endpoint}`);
    }
    
    throw error;
  }
};

// Get all B2BKing customer groups
export const getB2BKingGroups = async (
  config?: WooCommerceConfig
): Promise<B2BKingGroup[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingGroup[]>('b2bking/groups', config);
  } catch (error) {
    console.error('Error fetching B2BKing groups:', error);
    // If API call fails, return empty array
    return [];
  }
};

// Get a single B2BKing group by ID
export const getB2BKingGroupById = async (
  groupId: number,
  config?: WooCommerceConfig
): Promise<B2BKingGroup | null> => {
  try {
    return await handleB2BKingApiCall<B2BKingGroup>(`b2bking/groups/${groupId}`, config);
  } catch (error) {
    console.error(`Error fetching B2BKing group ${groupId}:`, error);
    return null;
  }
};

// Get all B2BKing users
export const getB2BKingUsers = async (
  config?: WooCommerceConfig
): Promise<B2BKingUser[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingUser[]>('b2bking/users', config);
  } catch (error) {
    console.error('Error fetching B2BKing users:', error);
    // If API call fails, return empty array
    return [];
  }
};

// Get a single B2BKing user by ID
export const getB2BKingUserById = async (
  userId: number,
  config?: WooCommerceConfig
): Promise<B2BKingUser | null> => {
  try {
    return await handleB2BKingApiCall<B2BKingUser>(`b2bking/users/${userId}`, config);
  } catch (error) {
    console.error(`Error fetching B2BKing user ${userId}:`, error);
    return null;
  }
};

// Get all B2BKing rules
export const getB2BKingRules = async (
  config?: WooCommerceConfig
): Promise<B2BKingRule[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingRule[]>('b2bking/rules', config);
  } catch (error) {
    console.error('Error fetching B2BKing rules:', error);
    // If API call fails, return empty array
    return [];
  }
};

// Get B2BKing rules by type
export const getB2BKingRulesByType = async (
  type: string,
  config?: WooCommerceConfig
): Promise<B2BKingRule[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingRule[]>(`b2bking/rules?type=${type}`, config);
  } catch (error) {
    console.error(`Error fetching B2BKing rules of type ${type}:`, error);
    // If API call fails, return empty array
    return [];
  }
};
