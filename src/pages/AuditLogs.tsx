
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuditLogs = () => {
  const { hasRole } = useAuth();

  if (!hasRole(['admin'])) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to view audit logs.</p>
      </div>
    );
  }

  // Mock audit log data
  const auditLogs = [
    {
      id: '1',
      action: 'User Login',
      user: 'John Technician',
      timestamp: new Date().toISOString(),
      details: 'Successful login from 192.168.1.100',
      type: 'authentication',
    },
    {
      id: '2',
      action: 'Ticket Created',
      user: 'Jane Requester',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      details: 'Created ticket #123 - Printer Issue',
      type: 'ticket',
    },
    {
      id: '3',
      action: 'User Role Updated',
      user: 'Admin User',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      details: 'Changed user role from requester to technician',
      type: 'user_management',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'authentication': return 'secondary';
      case 'ticket': return 'default';
      case 'user_management': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600">System activity and security logs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {log.type === 'authentication' && <User className="h-4 w-4" />}
                    {log.type === 'ticket' && <Settings className="h-4 w-4" />}
                    {log.type === 'user_management' && <User className="h-4 w-4" />}
                    <div>
                      <h4 className="font-medium">{log.action}</h4>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">by {log.user}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={getTypeColor(log.type)}>
                  {log.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
