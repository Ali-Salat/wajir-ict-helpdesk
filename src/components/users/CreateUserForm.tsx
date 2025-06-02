
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  const availableSkills = ['Hardware', 'Software', 'Network', 'Email', 'Phone', 'Database', 'Security'];

  const systemUsers = [
    { name: 'Yussuf Abdullahi', email: 'yussuf@wajir.go.ke', role: 'technician' },
    { name: 'Abdille Osman', email: 'abdille@wajir.go.ke', role: 'approver' },
    { name: 'Mohamed Abdisalaam', email: 'mabdisalaam@wajir.go.ke', role: 'technician' },
    { name: 'Mohamed Shahid', email: 'mshahid@wajir.go.ke', role: 'admin' }
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

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    } else {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Creating user with data:', formData);

      // Check if this is a system user that shouldn't require email verification
      const isSystemUser = systemUsers.some(user => user.email === formData.email);

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: isSystemUser ? undefined : `${window.location.origin}/`,
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
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
            department: formData.department || 'General',
            title: formData.skills.length > 0 ? formData.skills.join(', ') : null,
          })
          .select()
          .single();

        if (userError) {
          console.error('User insert error:', userError);
          throw userError;
        }

        console.log('User data inserted:', userData);

        // If this is a system user, automatically confirm their email
        if (isSystemUser) {
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
        description: `${formData.fullName} has been added to the system${isSystemUser ? ' (No email verification required)' : ''}`,
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

  const fillSystemUser = (user: any) => {
    setFormData({
      ...formData,
      fullName: user.name,
      email: user.email,
      role: user.role,
      department: 'Education and ICT',
      skills: user.role === 'technician' ? ['Hardware', 'Software', 'Network'] : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Label className="text-sm font-medium text-blue-800 mb-2 block">Quick Fill System Users:</Label>
        <div className="grid grid-cols-2 gap-2">
          {systemUsers.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => fillSystemUser(user)}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-left"
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
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
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@wajir.go.ke"
            required
            className="border-blue-200 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password</Label>
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
        </div>

        <div>
          <Label>Role</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, role: value })} value={formData.role} required>
            <SelectTrigger className="border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="requester">Requester</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
              <SelectItem value="approver">Supervisor</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Department</Label>
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

      {formData.role === 'technician' && (
        <div>
          <Label>Technical Skills</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={formData.skills.includes(skill)}
                  onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                />
                <Label htmlFor={skill} className="text-sm">{skill}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default CreateUserForm;
