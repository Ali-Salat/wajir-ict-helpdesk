import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Ticket, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp 
} from 'lucide-react';
import { RootState } from '../store/store';
import { setStats, setTickets } from '../store/slices/ticketsSlice';
import { useAuth } from '../hooks/useAuth';
import { TicketStats, Ticket as TicketType } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { tickets, stats } = useSelector((state: RootState) => state.tickets);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockTickets: TicketType[] = [
      {
        id: '1',
        title: 'Printer not working in Finance Department',
        description: 'The main printer in finance office is not responding to print jobs',
        category: 'hardware',
        priority: 'high',
        status: 'open',
        requesterId: '3',
        requesterName: 'Jane Requester',
        requesterDepartment: 'Finance Department',
        requesterOffice: 'Procurement Office',
        comments: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Email server configuration',
        description: 'Need to configure email for new employees',
        category: 'email',
        priority: 'medium',
        status: 'in_progress',
        requesterId: '3',
        requesterName: 'Jane Requester',
        requesterDepartment: 'ICT Department',
        requesterOffice: 'Systems Administration',
        assignedTechnicianId: '2',
        assignedTechnicianName: 'John Technician',
        comments: [],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'Network connectivity issues',
        description: 'Intermittent network connectivity in the main building',
        category: 'network',
        priority: 'critical',
        status: 'resolved',
        requesterId: '3',
        requesterName: 'Jane Requester',
        requesterDepartment: 'Health Department',
        requesterOffice: 'Medical Records',
        assignedTechnicianId: '2',
        assignedTechnicianName: 'John Technician',
        comments: [],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const mockStats: TicketStats = {
      total: 25,
      open: 8,
      inProgress: 5,
      resolved: 10,
      closed: 2,
      byCategory: {
        hardware: 8,
        software: 6,
        network: 5,
        email: 4,
        phone: 2,
      },
      byPriority: {
        critical: 3,
        high: 7,
        medium: 10,
        low: 5,
      },
      averageResolutionTime: 2.5,
      slaCompliance: 85,
    };

    dispatch(setTickets(mockTickets));
    dispatch(setStats(mockStats));
  }, [dispatch]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'default';
    }
  };

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of help desk operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.open || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
            <p className="text-xs text-muted-foreground">
              Being worked on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.slaCompliance || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Meeting service goals
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Tickets</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/tickets')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{ticket.title}</h4>
                    <p className="text-xs text-gray-600">
                      #{ticket.id} • {ticket.requesterName}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/tickets')}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Create New Ticket
              </Button>
              
              {hasRole(['admin', 'technician']) && (
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/tickets')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Assigned Tickets
                </Button>
              )}
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/knowledge-base')}
              >
                <Users className="mr-2 h-4 w-4" />
                Browse Knowledge Base
              </Button>
              
              {hasRole(['admin']) && (
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/analytics')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
