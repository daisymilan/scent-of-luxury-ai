
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
        return await getB2BKingGroups();
      } catch (error) {
        console.error('Error in useB2BKingGroups hook:', error);
        throw error;
      }
    }
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
        throw error;
      }
    },
    enabled: !!groupId
  });
};

// Hook to get all B2BKing users
export const useB2BKingUsers = () => {
  return useQuery({
    queryKey: ['b2bking', 'users'],
    queryFn: async () => {
      try {
        return await getB2BKingUsers();
      } catch (error) {
        console.error('Error in useB2BKingUsers hook:', error);
        throw error;
      }
    }
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
        throw error;
      }
    },
    enabled: !!userId
  });
};

// Hook to get all B2BKing rules
export const useB2BKingRules = () => {
  return useQuery({
    queryKey: ['b2bking', 'rules'],
    queryFn: async () => {
      try {
        return await getB2BKingRules();
      } catch (error) {
        console.error('Error in useB2BKingRules hook:', error);
        throw error;
      }
    }
  });
};

// Hook to get B2BKing rules by type
export const useB2BKingRulesByType = (type: string | null) => {
  return useQuery({
    queryKey: ['b2bking', 'rules', 'type', type],
    queryFn: async () => {
      if (!type) return [];
      try {
        return await getB2BKingRulesByType(type);
      } catch (error) {
        console.error(`Error in useB2BKingRulesByType hook for type ${type}:`, error);
        throw error;
      }
    },
    enabled: !!type
  });
};

