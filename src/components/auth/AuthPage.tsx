
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Shield, Users, Headphones, Clock, Award, Zap } from 'lucide-react';
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

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Main Content */}
      <div className="relative flex min-h-screen">
        {/* Left Panel - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-lg">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <img 
                  src="/lovable-uploads/0235ab6a-0d67-467b-92bc-7a11d4edf9ec.png" 
                  alt="Wajir County Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">ICT Help Desk</h1>
                <p className="text-blue-200 font-medium">Wajir County Government</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Enterprise-Grade IT Support Platform
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Streamline your IT operations with our comprehensive help desk solution. 
              Professional service delivery, advanced ticketing, and intelligent automation.
            </p>
            
            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Enterprise Security</h3>
                  <p className="text-blue-200 text-sm">Role-based access control & audit trails</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Intelligent Automation</h3>
                  <p className="text-blue-200 text-sm">Smart routing & auto-assignment</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">SLA Management</h3>
                  <p className="text-blue-200 text-sm">Track performance & meet commitments</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">24/7 Availability</h3>
                  <p className="text-blue-200 text-sm">Round-the-clock support tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/0235ab6a-0d67-467b-92bc-7a11d4edf9ec.png" 
                    alt="Wajir County Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ICT Help Desk</h1>
                  <p className="text-sm text-gray-600">Wajir County Government</p>
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-600">
                  Sign in to access your professional IT support dashboard
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                  <TabsTrigger value="signin" onClick={clearForm} className="data-[state=active]:bg-white">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" onClick={clearForm} className="data-[state=active]:bg-white">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email Address</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        autoComplete="name"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email Address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter a strong password (min 6 characters)"
                          required
                          minLength={6}
                          className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          required
                          className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
