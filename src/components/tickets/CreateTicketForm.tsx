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
  const { user, supabaseUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    requesterDepartment: user?.department || 'ICT, Trade, Investment and Industry',
    requesterOffice: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wajirDepartments = [
    'Health Services',
    'Water Services',
    'Office of the Governor, Public Service and County Administration',
    'Agriculture, Livestock and Veterinary Services',
    'ICT, Trade, Investment and Industry',
    'Finance and Economic Planning',
    'Education, Social Welfare and Family Affairs',
    'Roads and Transport',
    'Lands, Public Works and Urban Development',
    'Energy, Environment and Climate Change',
    'Wajir Municipality',
    'Wajiwasco (Wajir Water and Sewerage Company)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!supabaseUser) {
        throw new Error('User not authenticated');
      }

      const userName = supabaseUser.email === 'ellisalat@gmail.com' 
        ? 'Ellis A. Lat' 
        : supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Unknown User';

      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        priority: formData.priority as any,
        status: 'open',
        requesterId: supabaseUser.id,
        requesterName: userName,
        requesterDepartment: formData.requesterDepartment,
        requesterOffice: formData.requesterOffice,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addTicket(newTicket));
      
      toast({
        title: 'Ticket created successfully',
        description: `Ticket #${newTicket.id} has been created and assigned for review.`,
      });

      onClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
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
        <Label htmlFor="title">Issue Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description of the issue"
          required
          className="focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <Label htmlFor="description">Detailed Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Provide detailed information about the issue, including steps to reproduce if applicable"
          rows={4}
          required
          className="focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Department *</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, requesterDepartment: value })} defaultValue={formData.requesterDepartment}>
            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select your department" />
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
            placeholder="e.g., Procurement Office, Registry"
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Issue Category *</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hardware">Hardware Issues</SelectItem>
              <SelectItem value="software">Software Issues</SelectItem>
              <SelectItem value="network">Network & Connectivity</SelectItem>
              <SelectItem value="email">Email & Communication</SelectItem>
              <SelectItem value="phone">Phone Systems</SelectItem>
              <SelectItem value="other">Other IT Issues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Priority Level *</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Minor inconvenience</SelectItem>
              <SelectItem value="medium">Medium - Moderate impact</SelectItem>
              <SelectItem value="high">High - Significant impact</SelectItem>
              <SelectItem value="critical">Critical - System down</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.title || !formData.description || !formData.category || !formData.priority}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
