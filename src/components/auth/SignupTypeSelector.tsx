
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserPlus } from 'lucide-react';

interface SignupTypeSelectorProps {
  value: 'standard' | 'executive';
  onChange: (value: 'standard' | 'executive') => void;
}

export const SignupTypeSelector = ({ value, onChange }: SignupTypeSelectorProps) => {
  return (
    <Tabs 
      defaultValue={value} 
      className="w-full" 
      onValueChange={(val) => onChange(val as 'standard' | 'executive')}
    >
      <TabsList className="grid w-full grid-cols-2 bg-gray-800">
        <TabsTrigger value="standard" className="data-[state=active]:bg-gray-700">
          <User className="mr-2 h-4 w-4" />
          Standard
        </TabsTrigger>
        <TabsTrigger value="executive" className="data-[state=active]:bg-gray-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Executive
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
