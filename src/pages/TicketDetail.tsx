
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Clock, MessageSquare } from 'lucide-react';
import { RootState } from '../store/store';
import { setCurrentTicket, updateTicket } from '../store/slices/ticketsSlice';
import { useAuth } from '../hooks/useAuth';
import { Comment } from '../types';
import { toast } from '@/hooks/use-toast';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, supabaseUser, canAssignTickets } = useAuth();
  const { tickets, currentTicket } = useSelector((state: RootState) => state.tickets);
  const { technicians } = useSelector((state: RootState) => state.users);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const ticket = tickets.find(t => t.id === id);
    dispatch(setCurrentTicket(ticket || null));
  }, [id, tickets, dispatch]);

  if (!currentTicket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ticket not found</p>
        <Button onClick={() => navigate('/tickets')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    const updatedTicket = {
      ...currentTicket,
      status: newStatus as any,
      updatedAt: new Date().toISOString(),
      resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : currentTicket.resolvedAt,
    };
    dispatch(updateTicket(updatedTicket));
    toast({
      title: 'Status updated',
      description: `Ticket status changed to ${newStatus.replace('_', ' ')}`,
    });
  };

  const handleAssignTechnician = (technicianId: string) => {
    if (!technicianId || technicianId === 'unassign') {
      const updatedTicket = {
        ...currentTicket,
        assignedTechnicianId: undefined,
        assignedTechnicianName: undefined,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateTicket(updatedTicket));
      toast({
        title: 'Technician unassigned',
        description: 'Ticket has been unassigned',
      });
      return;
    }

    const technician = technicians.find(t => t.id === technicianId);
    if (!technician) {
      toast({
        title: 'Error',
        description: 'Technician not found',
        variant: 'destructive',
      });
      return;
    }

    const updatedTicket = {
      ...currentTicket,
      assignedTechnicianId: technicianId,
      assignedTechnicianName: technician.name,
      status: 'in_progress' as any,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateTicket(updatedTicket));
    toast({
      title: 'Technician assigned',
      description: `Ticket assigned to ${technician.name}`,
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please enter a comment before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (!user && !supabaseUser) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to add comments.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingComment(true);
    try {
      const authorId = user?.id || supabaseUser?.id || 'unknown';
      const authorName = user?.name || supabaseUser?.user_metadata?.full_name || supabaseUser?.email?.split('@')[0] || 'Unknown User';

      const comment: Comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ticketId: currentTicket.id,
        authorId,
        authorName,
        content: newComment.trim(),
        isInternal: false,
        createdAt: new Date().toISOString(),
      };

      const updatedTicket = {
        ...currentTicket,
        comments: [...(currentTicket.comments || []), comment],
        updatedAt: new Date().toISOString(),
      };

      dispatch(updateTicket(updatedTicket));
      setNewComment('');
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been added to the ticket.',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error adding comment',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/tickets')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket #{currentTicket.id}</h1>
          <p className="text-gray-600">{currentTicket.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ticket Details</CardTitle>
                <div className="flex space-x-2">
                  <Badge variant={getPriorityColor(currentTicket.priority)}>
                    {currentTicket.priority}
                  </Badge>
                  <Badge variant={getStatusColor(currentTicket.status)}>
                    {currentTicket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-600 mt-1">{currentTicket.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {currentTicket.category}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(currentTicket.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Requester:</span> {currentTicket.requesterName}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(currentTicket.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comments ({(currentTicket.comments || []).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(currentTicket.comments || []).map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{comment.authorName}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
                
                {(!currentTicket.comments || currentTicket.comments.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                )}
                
                {/* Add Comment */}
                <div className="border-t pt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="mt-2"
                  >
                    {isSubmittingComment ? 'Adding...' : 'Add Comment'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={currentTicket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {canAssignTickets && (
                <div>
                  <label className="text-sm font-medium">Assign Technician</label>
                  <Select 
                    value={currentTicket.assignedTechnicianId || ''} 
                    onValueChange={handleAssignTechnician}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassign">Unassign</SelectItem>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket ID:</span>
                <span>#{currentTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <Badge variant={getPriorityColor(currentTicket.priority)}>
                  {currentTicket.priority}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="capitalize">{currentTicket.category}</span>
              </div>
              {currentTicket.assignedTechnicianName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned to:</span>
                  <span>{currentTicket.assignedTechnicianName}</span>
                </div>
              )}
              {currentTicket.resolvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolved:</span>
                  <span>{new Date(currentTicket.resolvedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
