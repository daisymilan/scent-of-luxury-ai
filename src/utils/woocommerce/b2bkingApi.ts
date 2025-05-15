
import { WooCommerceConfig, getWooCommerceConfig, WOO_API_BASE_URL } from './config';
import { fetchWooCommerceData } from './apiClient';
import { B2BKingGroup, B2BKingUser, B2BKingRule } from './types';

// Endpoint for B2BKing REST API
const B2BKING_API_BASE = `${WOO_API_BASE_URL}/b2bking`;

// Get all B2BKing customer groups
export const getB2BKingGroups = async (
  config?: WooCommerceConfig
): Promise<B2BKingGroup[]> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log('Fetching B2BKing groups...');
    return await fetchWooCommerceData<B2BKingGroup[]>('b2bking/groups', wooConfig);
  } catch (error) {
    console.error('Error fetching B2BKing groups:', error);
    throw error;
  }
};

// Get a single B2BKing group by ID
export const getB2BKingGroupById = async (
  groupId: number,
  config?: WooCommerceConfig
): Promise<B2BKingGroup> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log(`Fetching B2BKing group ${groupId}...`);
    return await fetchWooCommerceData<B2BKingGroup>(`b2bking/groups/${groupId}`, wooConfig);
  } catch (error) {
    console.error(`Error fetching B2BKing group ${groupId}:`, error);
    throw error;
  }
};

// Get all B2BKing users
export const getB2BKingUsers = async (
  config?: WooCommerceConfig
): Promise<B2BKingUser[]> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log('Fetching B2BKing users...');
    return await fetchWooCommerceData<B2BKingUser[]>('b2bking/users', wooConfig);
  } catch (error) {
    console.error('Error fetching B2BKing users:', error);
    throw error;
  }
};

// Get a single B2BKing user by ID
export const getB2BKingUserById = async (
  userId: number,
  config?: WooCommerceConfig
): Promise<B2BKingUser> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log(`Fetching B2BKing user ${userId}...`);
    return await fetchWooCommerceData<B2BKingUser>(`b2bking/users/${userId}`, wooConfig);
  } catch (error) {
    console.error(`Error fetching B2BKing user ${userId}:`, error);
    throw error;
  }
};

// Get all B2BKing rules
export const getB2BKingRules = async (
  config?: WooCommerceConfig
): Promise<B2BKingRule[]> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log('Fetching B2BKing rules...');
    return await fetchWooCommerceData<B2BKingRule[]>('b2bking/rules', wooConfig);
  } catch (error) {
    console.error('Error fetching B2BKing rules:', error);
    throw error;
  }
};

// Get B2BKing rules by type
export const getB2BKingRulesByType = async (
  type: string,
  config?: WooCommerceConfig
): Promise<B2BKingRule[]> => {
  const wooConfig = config || getWooCommerceConfig();
  if (!wooConfig) throw new Error('WooCommerce config not found');
  
  try {
    console.log(`Fetching B2BKing rules of type ${type}...`);
    return await fetchWooCommerceData<B2BKingRule[]>(`b2bking/rules?type=${type}`, wooConfig);
  } catch (error) {
    console.error(`Error fetching B2BKing rules of type ${type}:`, error);
    throw error;
  }
};
