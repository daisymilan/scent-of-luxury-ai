
import { useQuery } from '@tanstack/react-query';
import { 
  getB2BKingGroups, 
  getB2BKingGroupById,
  getB2BKingUsers, 
  getB2BKingUserById,
  getB2BKingRules,
  getB2BKingRulesByType
} from './b2bkingApi';
import { B2BKingGroup, B2BKingUser, B2BKingRule } from './types';

// Hook to get all B2BKing groups
export const useB2BKingGroups = () => {
  return useQuery({
    queryKey: ['b2bking', 'groups'],
    queryFn: async () => {
      try {
        const groups = await getB2BKingGroups();
        return groups || [];
      } catch (error) {
        console.error('Error in useB2BKingGroups hook:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
    // Error handling is done in queryFn instead of using useErrorBoundary
  });
};

// Hook to get a specific B2BKing group
export const useB2BKingGroup = (groupId: number | null) => {
  return useQuery({
    queryKey: ['b2bking', 'group', groupId],
    queryFn: async () => {
      if (!groupId) return null;
      try {
        return await getB2BKingGroupById(groupId);
      } catch (error) {
        console.error(`Error in useB2BKingGroup hook for group ${groupId}:`, error);
        return null;
      }
    },
    enabled: !!groupId,
    retry: 1,
    retryDelay: 1000,
  });
};

// Hook to get all B2BKing users
export const useB2BKingUsers = () => {
  return useQuery({
    queryKey: ['b2bking', 'users'],
    queryFn: async () => {
      try {
        const users = await getB2BKingUsers();
        return users || [];
      } catch (error) {
        console.error('Error in useB2BKingUsers hook:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
};

// Hook to get a specific B2BKing user
export const useB2BKingUser = (userId: number | null) => {
  return useQuery({
    queryKey: ['b2bking', 'user', userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        return await getB2BKingUserById(userId);
      } catch (error) {
        console.error(`Error in useB2BKingUser hook for user ${userId}:`, error);
        return null;
      }
    },
    enabled: !!userId,
    retry: 1,
    retryDelay: 1000,
  });
};

// Hook to get all B2BKing rules
export const useB2BKingRules = () => {
  return useQuery({
    queryKey: ['b2bking', 'rules'],
    queryFn: async () => {
      try {
        const rules = await getB2BKingRules();
        return rules || [];
      } catch (error) {
        console.error('Error in useB2BKingRules hook:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
};

// Hook to get B2BKing rules by type
export const useB2BKingRulesByType = (type: string | null) => {
  return useQuery({
    queryKey: ['b2bking', 'rules', 'type', type],
    queryFn: async () => {
      if (!type) return [];
      try {
        const rules = await getB2BKingRulesByType(type);
        return rules || [];
      } catch (error) {
        console.error(`Error in useB2BKingRulesByType hook for type ${type}:`, error);
        return [];
      }
    },
    enabled: !!type,
    retry: 1,
    retryDelay: 1000,
  });
};
