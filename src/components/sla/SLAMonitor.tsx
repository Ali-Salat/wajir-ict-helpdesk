
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface SLATarget {
  id: string;
  name: string;
  target: string;
  current: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

const SLAMonitor = () => {
  const slaTargets: SLATarget[] = [
    {
      id: 'first_response',
      name: 'First Response Time',
      target: '< 2 hours',
      current: 98,
      status: 'excellent',
      description: 'Time to first response on new tickets'
    },
    {
      id: 'resolution_time',
      name: 'Resolution Time',
      target: '< 24 hours (Priority 1-2)',
      current: 87,
      status: 'good',
      description: 'Average time to resolve high priority tickets'
    },
    {
      id: 'customer_satisfaction',
      name: 'Customer Satisfaction',
      target: '> 90%',
      current: 94,
      status: 'excellent',
      description: 'Overall satisfaction score from surveys'
    },
    {
      id: 'availability',
      name: 'System Availability',
      target: '99.9% uptime',
      current: 99.8,
      status: 'good',
      description: 'IT systems and services availability'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'good': return Target;
      case 'warning': return Clock;
      case 'critical': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-900 flex items-center">
          <Target className="h-6 w-6 mr-2" />
          Service Level Agreement (SLA) Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slaTargets.map((sla) => {
            const StatusIcon = getStatusIcon(sla.status);
            return (
              <div key={sla.id} className="space-y-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">{sla.name}</h3>
                  </div>
                  <Badge className={getStatusColor(sla.status)}>
                    {sla.status.charAt(0).toUpperCase() + sla.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target: {sla.target}</span>
                    <span className="font-medium text-blue-900">{sla.current}%</span>
                  </div>
                  <Progress 
                    value={sla.current} 
                    className="h-2"
                    style={{
                      background: 'rgb(229 231 235)',
                    }}
                  />
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${sla.current}%`,
                      backgroundColor: getProgressColor(sla.status).replace('bg-', ''),
                      marginTop: '-8px',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                </div>
                
                <p className="text-sm text-gray-600">{sla.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SLAMonitor;
