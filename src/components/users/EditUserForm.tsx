
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { User } from '../../types';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/slices/usersSlice';
import { useToast } from '@/hooks/use-toast';

interface EditUserFormProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose, onUserUpdated }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department || '',
    skills: user.skills || [],
    isActive: user.isActive,
  });
  const [newSkill, setNewSkill] = useState('');

  const departments = [
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
    'Wajiwasco (Wajir Water and Sewerage Company)',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser: User = {
      ...user,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateUser(updatedUser));
    
    toast({
      title: "User Updated",
      description: `${formData.name} has been updated successfully.`,
    });

    onUserUpdated();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={user.email === 'ellisalat@gmail.com'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleInputChange('role', value)}
            disabled={user.email === 'ellisalat@gmail.com'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="approver">Approver</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
              <SelectItem value="requester">Requester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => handleInputChange('department', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skills/Expertise</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.isActive ? 'active' : 'inactive'}
          onValueChange={(value) => handleInputChange('isActive', value === 'active')}
          disabled={user.email === 'ellisalat@gmail.com'}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Update User
        </Button>
      </div>
    </form>
  );
};

export default EditUserForm;
