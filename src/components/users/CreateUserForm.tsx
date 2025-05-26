
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

  const availableSkills = ['الأجهزة', 'البرمجيات', 'الشبكات', 'البريد الإلكتروني', 'الهاتف', 'قواعد البيانات', 'الأمن السيبراني'];

  const islamicNames = [
    'أحمد محمد علي',
    'فاطمة عبد الله حسن',
    'محمد إبراهيم يوسف',
    'عائشة عمر محمود',
    'علي حسن أحمد',
    'خديجة محمد إبراهيم',
    'عبد الله يوسف محمد',
    'زينب علي حسن'
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
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: {
          full_name: formData.fullName,
        },
      });

      if (authError) throw authError;

      // Update profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            role: formData.role,
            department: formData.department || null,
            skills: formData.skills.length > 0 ? formData.skills : null,
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: 'تم إنشاء المستخدم بنجاح',
        description: `تم إضافة ${formData.fullName} إلى النظام`,
      });

      onUserCreated();
      onClose();
    } catch (error: any) {
      toast({
        title: 'خطأ في إنشاء المستخدم',
        description: error.message || 'يرجى المحاولة مرة أخرى',
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
          <Label htmlFor="fullName">الاسم الكامل</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="اختر من الأسماء الإسلامية"
            required
            className="text-right"
          />
          <div className="mt-2">
            <Label className="text-xs text-gray-500">أمثلة للأسماء الإسلامية:</Label>
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
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="البريد@wajir.go.ke"
            required
            className="text-right"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="كلمة مرور قوية"
            required
          />
        </div>

        <div>
          <Label>الدور</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="requester">طالب الخدمة</SelectItem>
              <SelectItem value="technician">فني</SelectItem>
              <SelectItem value="approver">مشرف</SelectItem>
              <SelectItem value="admin">مدير</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="department">القسم</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="اسم القسم"
          className="text-right"
        />
      </div>

      {formData.role === 'technician' && (
        <div>
          <Label>المهارات التقنية</Label>
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
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء مستخدم'}
        </Button>
      </div>
    </form>
  );
};

export default CreateUserForm;
