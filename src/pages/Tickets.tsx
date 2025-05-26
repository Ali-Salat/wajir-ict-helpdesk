
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter } from 'lucide-react';
import { RootState } from '../store/store';
import { setFilters } from '../store/slices/ticketsSlice';
import { useAuth } from '../hooks/useAuth';
import CreateTicketForm from '../components/tickets/CreateTicketForm';

const Tickets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, canViewAllTickets } = useAuth();
  const { tickets, filters } = useSelector((state: RootState) => state.tickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTickets = tickets.filter(ticket => {
    // If user is requester, only show their tickets
    if (user?.role === 'requester' && ticket.requesterId !== user.id) {
      return false;
    }
    
    // If user is technician, show assigned tickets and unassigned ones
    if (user?.role === 'technician' && ticket.assignedTechnicianId && ticket.assignedTechnicianId !== user.id) {
      return false;
    }

    // Search filter
    if (searchTerm && !ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(ticket.status)) {
      return false;
    }

    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(ticket.category)) {
      return false;
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(ticket.priority)) {
      return false;
    }

    return true;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600">Manage and track support tickets</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <CreateTicketForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              onValueChange={(value) => 
                dispatch(setFilters({ status: value === 'all' ? [] : [value] }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => 
                dispatch(setFilters({ priority: value === 'all' ? [] : [value] }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => 
                dispatch(setFilters({ category: value === 'all' ? [] : [value] }))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>#{ticket.id}</span>
                    <span>By: {ticket.requesterName}</span>
                    {ticket.assignedTechnicianName && (
                      <span>Assigned to: {ticket.assignedTechnicianName}</span>
                    )}
                    <span>Category: {ticket.category}</span>
                    <span>
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredTickets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No tickets found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tickets;
