
import { Mail, Smartphone, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const RecoveryAutomations = () => {
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="font-medium mb-4">Recovery Automations</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary">
                <Mail size={20} />
              </div>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">Active</div>
            </div>
            <h4 className="font-medium mb-1">Email Sequence</h4>
            <p className="text-sm text-gray-600 mb-4">3-step sequence with personalized offers</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Open Rate</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="flex justify-between">
                <span>Recovery Rate</span>
                <span className="font-medium">18%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary">
                <Smartphone size={20} />
              </div>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md">Active</div>
            </div>
            <h4 className="font-medium mb-1">SMS Reminders</h4>
            <p className="text-sm text-gray-600 mb-4">Gentle reminders with direct checkout links</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Click Rate</span>
                <span className="font-medium">36%</span>
              </div>
              <div className="flex justify-between">
                <span>Recovery Rate</span>
                <span className="font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-dashed border-2 flex items-center justify-center">
          <CardContent className="p-4 text-center">
            <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-3">
              <Plus size={20} />
            </div>
            <h4 className="font-medium mb-1">Add Automation</h4>
            <p className="text-sm text-gray-500">Create a new recovery workflow</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecoveryAutomations;
