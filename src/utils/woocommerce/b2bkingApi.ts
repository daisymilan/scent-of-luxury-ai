
/**
 * B2BKing API functions - Communicates with our backend
 */
import { B2BKingGroup, B2BKingUser, B2BKingRule } from './types';
import apiClient from '@/lib/apiClient';

// Enhanced error handling for B2BKing API calls
const handleB2BKingApiCall = async <T,>(endpoint: string): Promise<T> => {
  try {
    console.log(`Fetching B2BKing data for endpoint: ${endpoint}`);
    const response = await apiClient.get(`/woocommerce/b2bking/${endpoint}`);
    return response.data as T;
  } catch (error) {
    console.error(`Error fetching B2BKing data for ${endpoint}:`, error);
    throw error;
  }
};

// Get all B2BKing customer groups
export const getB2BKingGroups = async (): Promise<B2BKingGroup[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingGroup[]>('groups');
  } catch (error) {
    console.error('Error fetching B2BKing groups:', error);
    return [];
  }
};

// Get a single B2BKing group by ID
export const getB2BKingGroupById = async (groupId: number): Promise<B2BKingGroup | null> => {
  try {
    return await handleB2BKingApiCall<B2BKingGroup>(`groups/${groupId}`);
  } catch (error) {
    console.error(`Error fetching B2BKing group ${groupId}:`, error);
    return null;
  }
};

// Get all B2BKing users
export const getB2BKingUsers = async (): Promise<B2BKingUser[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingUser[]>('users');
  } catch (error) {
    console.error('Error fetching B2BKing users:', error);
    return [];
  }
};

// Get a single B2BKing user by ID
export const getB2BKingUserById = async (userId: number): Promise<B2BKingUser | null> => {
  try {
    return await handleB2BKingApiCall<B2BKingUser>(`users/${userId}`);
  } catch (error) {
    console.error(`Error fetching B2BKing user ${userId}:`, error);
    return null;
  }
};

// Get all B2BKing rules
export const getB2BKingRules = async (): Promise<B2BKingRule[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingRule[]>('rules');
  } catch (error) {
    console.error('Error fetching B2BKing rules:', error);
    return [];
  }
};

// Get B2BKing rules by type
export const getB2BKingRulesByType = async (type: string): Promise<B2BKingRule[]> => {
  try {
    return await handleB2BKingApiCall<B2BKingRule[]>(`rules?type=${type}`);
  } catch (error) {
    console.error(`Error fetching B2BKing rules of type ${type}:`, error);
    return [];
  }
};
