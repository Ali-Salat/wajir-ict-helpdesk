
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserService } from '@/hooks/useUserService';
import { Shield, User, Wrench, Users, UserPlus } from 'lucide-react';

interface CreateUserFormProps {
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserForm = ({ onClose, onUserCreated }: CreateUserFormProps) => {
  const { createUser, isCreating } = useUserService();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    department: '',
    title: '',
  });

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

  const roleDescriptions = {
    admin: {
      icon: Shield,
      title: 'System Administrator',
      description: 'Full system access, user management, system configuration'
    },
    approver: {
      icon: Users,
      title: 'Supervisor/Manager',
      description: 'Approve tickets, manage teams, view analytics'
    },
    technician: {
      icon: Wrench,
      title: 'IT Technician',
      description: 'Resolve tickets, technical support, field work'
    },
    requester: {
      icon: User,
      title: 'End User',
      description: 'Submit tickets, view own tickets, basic access'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.fullName || !formData.email || !formData.role || !formData.department) {
        throw new Error('Please fill in all required fields');
      }

      await createUser({
        email: formData.email,
        name: formData.fullName,
        role: formData.role as 'admin' | 'approver' | 'technician' | 'requester',
        department: formData.department,
        title: formData.title || undefined,
      });

      onUserCreated();
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-indigo-900 border-b border-indigo-200 pb-2">
            User Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                required
                className="border-indigo-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@wajir.go.ke"
                required
                className="border-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. IT Officer, Director"
              className="border-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Role & Access Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-indigo-900 border-b border-indigo-200 pb-2">
            Role & Access Level
          </h3>
          
          <div>
            <Label>System Role *</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, role: value })} value={formData.role} required>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleDescriptions).map(([role, info]) => {
                  const IconComponent = info.icon;
                  return (
                    <SelectItem key={role} value={role} className="py-3">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 mt-0.5 text-indigo-600" />
                        <div>
                          <div className="font-medium">{info.title}</div>
                          <div className="text-sm text-gray-600">{info.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Department *</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, department: value })} value={formData.department} required>
              <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {wajirDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Information Note */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-indigo-600">
              <UserPlus className="w-5 h-5 mt-0.5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-indigo-900">User Profile Creation</h4>
              <p className="text-sm text-indigo-700 mt-1">
                This creates a user profile in the system. The user will be able to access the system once they sign up with this email address.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isCreating} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 min-w-[120px]"
          >
            {isCreating ? 'Creating...' : 'Create User Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
