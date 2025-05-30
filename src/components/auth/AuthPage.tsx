
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn, signUp } = useSupabaseAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    console.log('Attempting sign in with:', email);

    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Sign in failed:', error);
      let errorMessage = 'Invalid email or password';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      }
      
      toast({
        title: 'Login Error',
        description: errorMessage,
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
    
    if (!email || !password || !fullName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Sign up failed:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      }
      
      toast({
        title: 'Account Creation Error',
        description: errorMessage,
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

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo123!@#');
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center shadow-lg p-3 border-2 border-blue-100">
            <img 
              src="/lovable-uploads/78b5eeef-e936-4b28-ae8e-42ab51b52dfa.png" 
              alt="Wajir County Logo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-wajir-green">
            IT Help Desk System
          </CardTitle>
          <p className="text-lg text-wajir-blue">
            <span className="font-extrabold text-xl tracking-wide">WAJIR COUNTY GOVERNMENT</span>
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" onClick={clearForm}>Sign In</TabsTrigger>
              <TabsTrigger value="signup" onClick={clearForm}>Sign Up</TabsTrigger>
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
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-wajir-green hover:bg-wajir-green/90" disabled={isLoading}>
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
                    autoComplete="name"
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
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password (min 6 characters)"
                      required
                      minLength={6}
                      className="pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-wajir-blue hover:bg-wajir-blue/90" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium mb-3 text-center">Demo Accounts:</p>
            <div className="text-xs space-y-2">
              <button 
                onClick={() => fillDemoCredentials('superuser@wajir.go.ke')}
                className="block w-full text-left p-2 rounded text-wajir-green hover:text-wajir-green/80 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                📧 Super User
              </button>
              <button 
                onClick={() => fillDemoCredentials('admin@wajir.go.ke')}
                className="block w-full text-left p-2 rounded text-wajir-blue hover:text-wajir-blue/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                📧 Admin
              </button>
              <button 
                onClick={() => fillDemoCredentials('tech@wajir.go.ke')}
                className="block w-full text-left p-2 rounded text-wajir-blue hover:text-wajir-blue/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                📧 Technician
              </button>
              <button 
                onClick={() => fillDemoCredentials('supervisor@wajir.go.ke')}
                className="block w-full text-left p-2 rounded text-wajir-blue hover:text-wajir-blue/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                📧 Supervisor
              </button>
              <button 
                onClick={() => fillDemoCredentials('user@wajir.go.ke')}
                className="block w-full text-left p-2 rounded text-wajir-blue hover:text-wajir-blue/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                📧 User
              </button>
              <div className="font-medium text-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 text-wajir-green">
                🔑 Password: Demo123!@#
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
