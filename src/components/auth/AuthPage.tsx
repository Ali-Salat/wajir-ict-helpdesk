
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
        title: 'Login Error',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login Successful',
        description: 'Welcome to the Wajir County IT Help Desk System',
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
        title: 'Account Creation Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created Successfully',
        description: 'Please check your email to activate your account',
      });
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = (email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/b82dd6de-7a50-48ff-884a-07b73a15eed4.png" 
              alt="Wajir County Logo"
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            IT Help Desk System
          </CardTitle>
          <p className="text-gray-600">Wajir County Government</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2 text-center">Demo Accounts:</p>
            <div className="text-xs space-y-1">
              <button 
                onClick={() => fillDemoCredentials('ahmad.administrator@wajir.go.ke')}
                className="block w-full text-left text-blue-600 hover:text-blue-800"
              >
                Admin: Ahmad Al-Rashid (ahmad.administrator@wajir.go.ke)
              </button>
              <button 
                onClick={() => fillDemoCredentials('ibrahim.technician@wajir.go.ke')}
                className="block w-full text-left text-blue-600 hover:text-blue-800"
              >
                Technician: Ibrahim Al-Hassan (ibrahim.technician@wajir.go.ke)
              </button>
              <button 
                onClick={() => fillDemoCredentials('mohammed.supervisor@wajir.go.ke')}
                className="block w-full text-left text-blue-600 hover:text-blue-800"
              >
                Supervisor: Mohammed Al-Mahmoud (mohammed.supervisor@wajir.go.ke)
              </button>
              <button 
                onClick={() => fillDemoCredentials('fatima.user@wajir.go.ke')}
                className="block w-full text-left text-blue-600 hover:text-blue-800"
              >
                User: Fatima Al-Zahra (fatima.user@wajir.go.ke)
              </button>
              <div className="font-medium text-center mt-2">Password: password123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
