
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Settings, 
  Clock, 
  Users, 
  Mail, 
  Bell,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  executionCount: number;
  lastRun: string;
  type: 'assignment' | 'notification' | 'escalation' | 'sla';
}

const WorkflowAutomation = () => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-assign Hardware Issues',
      description: 'Automatically assign hardware tickets to available technicians',
      trigger: 'New ticket with category "Hardware"',
      action: 'Assign to technician with Hardware skills',
      isActive: true,
      executionCount: 45,
      lastRun: '2 hours ago',
      type: 'assignment'
    },
    {
      id: '2',
      name: 'Critical Priority Escalation',
      description: 'Escalate critical tickets after 1 hour without response',
      trigger: 'Critical ticket unassigned for > 1 hour',
      action: 'Notify supervisors and escalate',
      isActive: true,
      executionCount: 12,
      lastRun: '30 minutes ago',
      type: 'escalation'
    },
    {
      id: '3',
      name: 'SLA Breach Warning',
      description: 'Send warning notifications when tickets approach SLA deadline',
      trigger: 'Ticket 80% through SLA timeframe',
      action: 'Email assigned technician and supervisor',
      isActive: true,
      executionCount: 28,
      lastRun: '1 hour ago',
      type: 'sla'
    },
    {
      id: '4',
      name: 'Customer Update Notifications',
      description: 'Automatically notify customers of ticket progress',
      trigger: 'Ticket status changes',
      action: 'Send status update email to requester',
      isActive: false,
      executionCount: 156,
      lastRun: '3 days ago',
      type: 'notification'
    }
  ]);

  const toggleRule = (ruleId: string) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return Users;
      case 'notification': return Bell;
      case 'escalation': return Clock;
      case 'sla': return Zap;
      default: return Settings;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800';
      case 'notification': return 'bg-green-100 text-green-800';
      case 'escalation': return 'bg-red-100 text-red-800';
      case 'sla': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-900 flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-6 w-6 mr-2" />
            Workflow Automation
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {automationRules.map((rule) => {
            const TypeIcon = getTypeIcon(rule.type);
            return (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">{rule.name}</h3>
                    </div>
                    <Badge className={getTypeColor(rule.type)}>
                      {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {rule.isActive ? (
                        <Play className="h-4 w-4 text-green-600" />
                      ) : (
                        <Pause className="h-4 w-4 text-gray-400" />
                      )}
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{rule.description}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-blue-700">Trigger:</span>
                    <span className="text-gray-600">{rule.trigger}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-blue-700">Action:</span>
                    <span className="text-gray-600">{rule.action}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>Executed {rule.executionCount} times</span>
                  <span>Last run: {rule.lastRun}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowAutomation;
