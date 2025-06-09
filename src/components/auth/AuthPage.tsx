
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Shield, Users, Headphones, Clock, Award, Zap, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    clearForm();
    setShowForgotPassword(false);
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    setActiveTab('signin');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10" />
        
        <div className="relative flex min-h-screen items-center justify-center p-8">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl p-2">
                  <img 
                    src="/lovable-uploads/0235ab6a-0d67-467b-92bc-7a11d4edf9ec.png" 
                    alt="Wajir County Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">ICT Help Desk</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wajir County Government</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm onBack={handleBackToSignIn} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-gray-900 dark:text-white">
          <div className="max-w-lg">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl p-2">
                <img 
                  src="/lovable-uploads/0235ab6a-0d67-467b-92bc-7a11d4edf9ec.png" 
                  alt="Wajir County Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ICT Help Desk</h1>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">Wajir County Government</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Professional IT Support
              <span className="block text-blue-600 dark:text-blue-400">Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Streamline your IT operations with our comprehensive help desk solution. 
              Experience professional service delivery and intelligent automation.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Enterprise Security</h3>
                  <p className="text-gray-600 dark:text-gray-400">Advanced role-based access control & comprehensive audit trails</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Smart Automation</h3>
                  <p className="text-gray-600 dark:text-gray-400">Intelligent ticket routing & automated assignment</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">SLA Management</h3>
                  <p className="text-gray-600 dark:text-gray-400">Track performance metrics & meet service commitments</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">24/7 Operations</h3>
                  <p className="text-gray-600 dark:text-gray-400">Round-the-clock monitoring & support tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl p-2">
                  <img 
                    src="/lovable-uploads/0235ab6a-0d67-467b-92bc-7a11d4edf9ec.png" 
                    alt="Wajir County Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">ICT Help Desk</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wajir County Government</p>
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Access your professional IT support dashboard
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-lg font-semibold"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 rounded-lg font-semibold"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-700 dark:text-gray-300 font-semibold">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          autoComplete="email"
                          className="pl-12 h-14 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-xl text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-700 dark:text-gray-300 font-semibold">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="pl-12 pr-12 h-14 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-xl text-base"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        'Signing in...'
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-700 dark:text-gray-300 font-semibold">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                          autoComplete="name"
                          className="pl-12 h-14 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-xl text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 dark:text-gray-300 font-semibold">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          autoComplete="email"
                          className="pl-12 h-14 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-xl text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-700 dark:text-gray-300 font-semibold">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a strong password (min 6 characters)"
                          required
                          minLength={6}
                          className="pl-12 pr-12 h-14 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-xl text-base"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300 font-semibold">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          required
                          className="pl-12 pr-12 h-14 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-xl text-base"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        'Creating account...'
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
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
