
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Wrench, UserCheck, Building2 } from 'lucide-react';
import { User } from '@/types';

interface UserStatsProps {
  users: User[];
  isLoading: boolean;
}

const UserStats: React.FC<UserStatsProps> = ({ users, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const technicianCount = users.filter(u => u.role === 'technician').length;
  const approverCount = users.filter(u => u.role === 'approver').length;
  const activeUsers = users.filter(u => u.isActive).length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Administrators',
      value: adminCount,
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Technicians',
      value: technicianCount,
      icon: Wrench,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Approvers',
      value: approverCount,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserStats;
