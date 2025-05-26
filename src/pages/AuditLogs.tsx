
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuditLog } from '../types';

const AuditLogs = () => {
  const { canAccessAdminPanel } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');

  useEffect(() => {
    // Mock audit logs - replace with actual API call
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Admin User',
        action: 'CREATE',
        resource: 'TICKET',
        resourceId: '123',
        details: 'Created ticket "Printer not working"',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId: '2',
        userName: 'John Technician',
        action: 'UPDATE',
        resource: 'TICKET',
        resourceId: '123',
        details: 'Assigned ticket to John Technician',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        userId: '1',
        userName: 'Admin User',
        action: 'CREATE',
        resource: 'USER',
        resourceId: '456',
        details: 'Created new user account for Jane Doe',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        userId: '3',
        userName: 'Jane Requester',
        action: 'LOGIN',
        resource: 'SYSTEM',
        resourceId: 'AUTH',
        details: 'User logged into the system',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ];

    setLogs(mockLogs);
  }, []);

  if (!canAccessAdminPanel()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to view audit logs.</p>
      </div>
    );
  }

  const filteredLogs = logs.filter(log => {
    if (searchTerm && !log.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.details.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (actionFilter && log.action !== actionFilter) {
      return false;
    }

    if (resourceFilter && log.resource !== resourceFilter) {
      return false;
    }

    return true;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'secondary';
      case 'UPDATE': return 'default';
      case 'DELETE': return 'destructive';
      case 'LOGIN': return 'outline';
      case 'LOGOUT': return 'outline';
      default: return 'default';
    }
  };

  const handleExportLogs = () => {
    // Mock export functionality
    console.log('Exporting audit logs...');
    // In a real app, this would trigger a CSV/PDF download
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">System activity and user actions tracking</p>
        </div>
        
        <Button onClick={handleExportLogs}>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Resources</SelectItem>
                <SelectItem value="TICKET">Ticket</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="SYSTEM">System</SelectItem>
                <SelectItem value="KNOWLEDGE">Knowledge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Activity Log ({filteredLogs.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline">
                        {log.resource}
                      </Badge>
                      <span className="text-sm text-gray-600">#{log.resourceId}</span>
                    </div>
                    
                    <p className="text-gray-900 mb-2">{log.details}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">User:</span> {log.userName}
                      </div>
                      <div>
                        <span className="font-medium">IP:</span> {log.ipAddress}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2 truncate">
                      <span className="font-medium">User Agent:</span> {log.userAgent}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No audit logs found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
