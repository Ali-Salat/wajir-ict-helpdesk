
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  BarChart3,
  Timer,
  Target
} from 'lucide-react';

interface TicketMetricsProps {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  avgResolutionTime: string;
  satisfactionScore: number;
}

const TicketMetrics = ({
  totalTickets,
  openTickets,
  resolvedTickets,
  overdueTickets,
  avgResolutionTime,
  satisfactionScore
}: TicketMetricsProps) => {
  const metrics = [
    {
      title: 'Total Tickets',
      value: totalTickets.toString(),
      icon: BarChart3,
      color: 'bg-blue-500',
      trend: '+12% vs last month'
    },
    {
      title: 'Open Tickets',
      value: openTickets.toString(),
      icon: AlertCircle,
      color: 'bg-orange-500',
      trend: overdueTickets > 0 ? `${overdueTickets} overdue` : 'All on track'
    },
    {
      title: 'Resolved Today',
      value: resolvedTickets.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: '+8% vs yesterday'
    },
    {
      title: 'Avg Resolution',
      value: avgResolutionTime,
      icon: Timer,
      color: 'bg-purple-500',
      trend: 'Within SLA target'
    },
    {
      title: 'First Response',
      value: '< 2h',
      icon: Clock,
      color: 'bg-indigo-500',
      trend: '98% SLA compliance'
    },
    {
      title: 'Satisfaction',
      value: `${satisfactionScore}%`,
      icon: Target,
      color: 'bg-emerald-500',
      trend: satisfactionScore >= 90 ? 'Excellent' : 'Good'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                {metric.title}
              </CardTitle>
              <div className={`${metric.color} p-2 rounded-lg`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{metric.value}</div>
              <p className="text-xs text-blue-600 mt-1">
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TicketMetrics;
