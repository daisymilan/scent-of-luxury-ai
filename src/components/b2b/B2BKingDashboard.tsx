
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useB2BKingGroups, useB2BKingUsers, useB2BKingRules } from '@/utils/woocommerce';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon, ShieldIcon, BookOpenIcon, AlertTriangle } from 'lucide-react';
import { B2BKingGroup, B2BKingUser, B2BKingRule } from '@/utils/woocommerce/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const B2BKingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('groups');
  
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: groupsError
  } = useB2BKingGroups();
  
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError
  } = useB2BKingUsers();
  
  const {
    data: rules,
    isLoading: isLoadingRules,
    error: rulesError
  } = useB2BKingRules();
  
  const isLoading = isLoadingGroups || isLoadingUsers || isLoadingRules;
  const hasError = !!(groupsError || usersError || rulesError);
  const errorMessage = 
    groupsError?.message || 
    usersError?.message || 
    rulesError?.message || 
    'Failed to load B2BKing data';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>B2BKing Dashboard</CardTitle>
        <CardDescription>
          Manage your B2B customer groups, users, and rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasError ? (
          <div className="bg-red-50 border-red-200 border rounded-md p-4 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-800">{errorMessage}</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="groups" className="flex items-center gap-1">
                <UsersIcon className="h-4 w-4" />
                <span>Groups</span>
                {groups && <Badge variant="secondary" className="ml-1">{groups.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1">
                <ShieldIcon className="h-4 w-4" />
                <span>Users</span>
                {users && <Badge variant="secondary" className="ml-1">{users.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex items-center gap-1">
                <BookOpenIcon className="h-4 w-4" />
                <span>Rules</span>
                {rules && <Badge variant="secondary" className="ml-1">{rules.length}</Badge>}
              </TabsTrigger>
            </TabsList>
            
            {/* Groups Tab */}
            <TabsContent value="groups">
              <div className="rounded-md border">
                {isLoadingGroups ? (
                  <div className="p-4">
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-20 w-full mb-2" />
                    <Skeleton className="h-20 w-full mb-2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : groups && groups.length > 0 ? (
                  <div className="divide-y">
                    {groups.map((group) => (
                      <div key={group.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{group.name}</h3>
                            <p className="text-sm text-gray-500">{group.description}</p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline">
                                {group.user_count} {group.user_count === 1 ? 'member' : 'members'}
                              </Badge>
                              <Badge variant="outline">
                                {group.rules_count} {group.rules_count === 1 ? 'rule' : 'rules'}
                              </Badge>
                              <Badge 
                                variant={group.status === 'active' ? 'success' : 'secondary'}
                              >
                                {group.status}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <UsersIcon className="h-10 w-10 text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-900">No Groups Found</h3>
                    <p className="text-gray-500 max-w-sm mt-1">
                      There are no B2B customer groups configured in your WooCommerce store.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <div className="rounded-md border">
                {isLoadingUsers ? (
                  <div className="p-4">
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="divide-y">
                    {users.map((user) => (
                      <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback className="bg-primary text-white">
                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <span className="mr-2">{user.company}</span>
                                {user.position && <span>• {user.position}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant={user.approved ? 'success' : 'destructive'}>
                              {user.approved ? 'Approved' : 'Pending'}
                            </Badge>
                            <span className="text-xs text-gray-400 mt-1">
                              Registered: {new Date(user.registration_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <ShieldIcon className="h-10 w-10 text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-900">No B2B Users Found</h3>
                    <p className="text-gray-500 max-w-sm mt-1">
                      There are no B2B users registered in your WooCommerce store.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Rules Tab */}
            <TabsContent value="rules">
              <div className="rounded-md border">
                {isLoadingRules ? (
                  <div className="p-4">
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-24 w-full mb-2" />
                    <Skeleton className="h-24 w-full mb-2" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : rules && rules.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="divide-y">
                      {rules.map((rule) => (
                        <div key={rule.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{rule.name}</h3>
                              <div className="flex gap-2 mt-1">
                                <Badge>{rule.type}</Badge>
                                {rule.requires_approval && (
                                  <Badge variant="outline">Requires Approval</Badge>
                                )}
                                {rule.requires_login && (
                                  <Badge variant="outline">Requires Login</Badge>
                                )}
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                <p>Applies to: {typeof rule.who === 'string' ? rule.who : `${rule.who.length} group(s)`}</p>
                                {rule.discount_value && (
                                  <p>Discount: {rule.discount_value}%</p>
                                )}
                                {rule.minimum_order && (
                                  <p>Minimum order: ${rule.minimum_order}</p>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View Rule</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <BookOpenIcon className="h-10 w-10 text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-900">No Rules Found</h3>
                    <p className="text-gray-500 max-w-sm mt-1">
                      There are no B2BKing rules configured in your WooCommerce store.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default B2BKingDashboard;
