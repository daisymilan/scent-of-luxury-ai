// Add this file to your project: src/components/RoleDebugPanel.tsx
// This will help you diagnose role issues in real-time

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../contexts/AuthContext'; // Import UserRole type
import { X } from 'lucide-react';

const RoleDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const auth = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Check if auth context is available
  if (!auth) {
    return null;
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Extract role information from various sources
  const userRole = auth.userRole;
  const userRoleFromMetadata = auth.currentUser?.user_metadata?.role;
  const isCeoByFunction = typeof auth.isCEO === 'function' ? auth.isCEO() : 'function not available';
  const hasPermissionFunction = typeof auth.hasPermission === 'function';

  // Test permissions with hasPermission function
  const testPermission = (role: UserRole | UserRole[]) => {
    if (!hasPermissionFunction) return 'Function not available';
    
    try {
      return auth.hasPermission(role);
    } catch (e) {
      return `Error: ${e.message}`;
    }
  };

  return isVisible ? (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
      <div className="p-3 bg-blue-600 text-white flex justify-between items-center">
        <h3 className="font-semibold">Role Debug Panel</h3>
        <button onClick={() => setIsVisible(false)} className="text-white">
          <X size={18} />
        </button>
      </div>
      
      <div className="p-3 max-h-[70vh] overflow-y-auto">
        {/* User section */}
        <div className="mb-3">
          <button 
            className="w-full text-left font-medium py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
            onClick={() => toggleSection('user')}
          >
            User Info
            <span>{expandedSection === 'user' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'user' && (
            <div className="mt-2 pl-2 text-sm">
              <p><span className="font-medium">Email:</span> {auth.currentUser?.email || 'Not logged in'}</p>
              <p><span className="font-medium">ID:</span> {auth.currentUser?.id || 'N/A'}</p>
              <p><span className="font-medium">Is Authenticated:</span> {auth.isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
        
        {/* Role section */}
        <div className="mb-3">
          <button 
            className="w-full text-left font-medium py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
            onClick={() => toggleSection('role')}
          >
            Role Info
            <span>{expandedSection === 'role' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'role' && (
            <div className="mt-2 pl-2 text-sm">
              <p><span className="font-medium">User Role (context):</span> {userRole || 'None'}</p>
              <p><span className="font-medium">User Role (metadata):</span> {userRoleFromMetadata || 'None'}</p>
              <p><span className="font-medium">Is CEO (by function):</span> {String(isCeoByFunction)}</p>
              <p><span className="font-medium">Is CEO (by role):</span> {String(userRole === 'CEO')}</p>
              <p><span className="font-medium">hasPermission available:</span> {hasPermissionFunction ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
        
        {/* Permission tests */}
        <div className="mb-3">
          <button 
            className="w-full text-left font-medium py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
            onClick={() => toggleSection('permissions')}
          >
            Permission Tests
            <span>{expandedSection === 'permissions' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'permissions' && (
            <div className="mt-2 pl-2 text-sm">
              <p><span className="font-medium">hasPermission('CEO'):</span> {String(testPermission('CEO' as UserRole))}</p>
              <p><span className="font-medium">hasPermission(['CEO']):</span> {String(testPermission(['CEO' as UserRole]))}</p>
              <p><span className="font-medium">hasPermission(['CEO', 'CCO']):</span> {String(testPermission(['CEO' as UserRole, 'CCO' as UserRole]))}</p>
              <p><span className="font-medium">hasPermission('CCO'):</span> {String(testPermission('CCO' as UserRole))}</p>
              <p><span className="font-medium">hasPermission('Marketing Manager'):</span> {String(testPermission('Marketing Manager' as UserRole))}</p>
            </div>
          )}
        </div>
        
        {/* Voice Auth section */}
        <div className="mb-3">
          <button 
            className="w-full text-left font-medium py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
            onClick={() => toggleSection('voice')}
          >
            Voice Authentication
            <span>{expandedSection === 'voice' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'voice' && (
            <div className="mt-2 pl-2 text-sm">
              <p><span className="font-medium">Voice Enrolled:</span> {auth.isVoiceEnrolled ? 'Yes' : 'No'}</p>
              <p><span className="font-medium">Voice Authenticated:</span> {auth.isVoiceAuthenticated ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-xs text-center">
        Double-check database for correct role values if issues persist
      </div>
    </div>
  ) : (
    <button 
      onClick={() => setIsVisible(true)}
      className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50"
    >
      👑
    </button>
  );
};

export default RoleDebugPanel;