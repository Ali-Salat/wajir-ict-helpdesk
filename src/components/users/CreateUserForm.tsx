
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Shield, User, Wrench, Users } from 'lucide-react';

interface CreateUserFormProps {
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserForm = ({ onClose, onUserCreated }: CreateUserFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    department: '',
    skills: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSkills = [
    'Hardware Troubleshooting', 
    'Software Installation', 
    'Network Configuration', 
    'Email Systems', 
    'Phone Systems', 
    'Database Administration', 
    'Cybersecurity', 
    'Cloud Services',
    'Server Management',
    'Active Directory',
    'Backup & Recovery',
    'Mobile Device Management'
  ];

  const wajirDepartments = [
    'Office of the Governor',
    'Deputy Governor\'s Office', 
    'County Secretary',
    'County Assembly',
    'Health Services',
    'Education and ICT',
    'Agriculture and Livestock Development',
    'Water, Environment and Natural Resources',
    'Roads, Transport and Public Works',
    'Trade, Industry and Tourism',
    'Youth, Gender and Social Services',
    'Lands, Housing and Urban Development',
    'Finance and Economic Planning',
    'Public Service and Administration',
    'Emergency Services',
    'Legal Affairs',
    'Internal Audit',
    'Communications'
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

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    } else {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    }
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Creating user with data:', formData);

      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.password || !formData.role || !formData.department) {
        throw new Error('Please fill in all required fields');
      }

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('already registered')) {
          throw new Error('An account with this email already exists');
        }
        throw authError;
      }

      console.log('Auth user created:', authData);

      // Insert user data into the users table
      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: formData.fullName,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            title: formData.skills.length > 0 ? formData.skills.join(', ') : null,
          })
          .select()
          .single();

        if (userError) {
          console.error('User insert error:', userError);
          throw userError;
        }

        console.log('User data inserted:', userData);

        // Auto-confirm email for system users
        const systemEmails = [
          'yussuf@wajir.go.ke',
          'abdille@wajir.go.ke', 
          'mabdisalaam@wajir.go.ke',
          'mshahid@wajir.go.ke'
        ];

        if (systemEmails.includes(formData.email)) {
          try {
            const { error: confirmError } = await supabase.auth.admin.updateUserById(
              authData.user.id,
              { email_confirm: true }
            );
            if (confirmError) {
              console.warn('Could not auto-confirm email:', confirmError);
            }
          } catch (confirmError) {
            console.warn('Could not auto-confirm email:', confirmError);
          }
        }
      }

      toast({
        title: 'User created successfully',
        description: `${formData.fullName} has been added to the system`,
      });

      onUserCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error creating user',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2">
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
                className="border-blue-200 focus:border-blue-500"
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
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Strong password"
                required
                minLength={6}
                className="border-blue-200 focus:border-blue-500"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={generateSecurePassword}
                className="whitespace-nowrap"
              >
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Role & Access Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2">
            Role & Access Level
          </h3>
          
          <div>
            <Label>System Role *</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, role: value })} value={formData.role} required>
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleDescriptions).map(([role, info]) => {
                  const IconComponent = info.icon;
                  return (
                    <SelectItem key={role} value={role} className="py-3">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 mt-0.5 text-blue-600" />
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
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
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

        {/* Technical Skills Section */}
        {formData.role === 'technician' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2">
              Technical Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:bg-blue-50">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                  />
                  <Label htmlFor={skill} className="text-sm cursor-pointer flex-1">{skill}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
