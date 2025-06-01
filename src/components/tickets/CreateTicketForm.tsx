
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addTicket } from '../../store/slices/ticketsSlice';
import { useAuth } from '../../hooks/useAuth';
import { Ticket } from '../../types';
import { toast } from '@/hooks/use-toast';
import { RootState } from '../../store/store';

interface CreateTicketFormProps {
  onClose: () => void;
}

const CreateTicketForm = ({ onClose }: CreateTicketFormProps) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    requesterDepartment: user?.department || '',
    requesterOffice: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wajirDepartments = [
    'ICT Department',
    'Finance Department',
    'Human Resources Department',
    'Administration Department',
    'Health Department',
    'Education Department',
    'Agriculture Department',
    'Water Department',
    'Transport Department',
    'Trade Department',
    'Land & Physical Planning Department',
    'Environment Department',
    'Youth & Sports Department',
    'Gender & Social Services Department',
    'Public Service Board'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        priority: formData.priority as any,
        status: 'open',
        requesterId: user!.id,
        requesterName: user!.name,
        requesterDepartment: formData.requesterDepartment,
        requesterOffice: formData.requesterOffice,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addTicket(newTicket));
      
      toast({
        title: 'Ticket created successfully',
        description: `Ticket #${newTicket.id} has been created.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error creating ticket',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description of the issue"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed description of the issue"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Department</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, requesterDepartment: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {wajirDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="office">Office/Sub-Department</Label>
          <Input
            id="office"
            value={formData.requesterOffice}
            onChange={(e) => setFormData({ ...formData, requesterOffice: e.target.value })}
            placeholder="e.g., Procurement Office"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Priority</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
