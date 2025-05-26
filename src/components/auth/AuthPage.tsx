
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useSupabaseAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في نظام المساعدة التقنية',
      });
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: 'خطأ في إنشاء الحساب',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/6e5b8a89-5ba8-4c1a-a94b-e1ae5b8b7c45.png" 
              alt="شعار مقاطعة واجير"
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            نظام المساعدة التقنية
          </CardTitle>
          <p className="text-gray-600">حكومة مقاطعة واجير</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ادخل بريدك الإلكتروني"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">كلمة المرور</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ادخل كلمة المرور"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">الاسم الكامل</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ادخل اسمك الكامل"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ادخل بريدك الإلكتروني"
                    required
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">كلمة المرور</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ادخل كلمة مرور قوية"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2 text-center">حسابات تجريبية:</p>
            <div className="text-xs space-y-1 text-center">
              <div>مدير: ahmad.administrator@wajir.go.ke</div>
              <div>تقني: ibrahim.technician@wajir.go.ke</div>
              <div>مشرف: mohammed.supervisor@wajir.go.ke</div>
              <div>مستخدم: fatima.user@wajir.go.ke</div>
              <div className="font-medium">كلمة المرور: password123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
