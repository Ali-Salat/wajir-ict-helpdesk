
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

  const islamicNames = [
    'Ahmad Hassan',
    'Fatima Omar',
    'Mohammed Ali',
    'Aisha Ibrahim',
    'Ali Ahmed',
    'Khadija Yusuf',
    'Abdullah Omar',
    'Zainab Ahmad'
  ];

  const wajirDepartments = [
    'Office of the Governor',
    'Deputy Governor\'s Office',
    'County Assembly',
    'County Secretary',
    'Health Services',
    'Education and ICT',
    'Agriculture and Livestock',
    'Water and Sanitation',
    'Roads and Public Works',
    'Trade and Industry',
    'Youth and Sports',
    'Gender and Social Services',
    'Lands and Urban Planning',
    'Finance and Economic Planning',
    'Public Service Management'
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
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      // Insert user data into the users table
      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: formData.fullName,
            email: formData.email,
            role: formData.role,
            department: formData.department || 'General',
            title: formData.skills.length > 0 ? formData.skills.join(', ') : null,
          });

        if (userError) {
          console.error('User insert error:', userError);
          throw userError;
        }
      }

      toast({
        title: 'User created successfully',
        description: `${formData.fullName} has been added to the system`,
      });

      onUserCreated();
      onClose();
    } catch (error: any) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Choose from Islamic names"
            required
          />
          <div className="mt-2">
            <Label className="text-xs text-gray-500">Islamic name examples:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {islamicNames.slice(0, 3).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({ ...formData, fullName: name })}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
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
          />
        </div>

        <div>
          <Label>Role</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
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
        <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
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
