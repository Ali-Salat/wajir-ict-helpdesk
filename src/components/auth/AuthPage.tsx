
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-slate-800/95">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl p-4">
              <img 
                src="/lovable-uploads/37b18ab6-301e-4fea-860d-a70e3041499a.png" 
                alt="Wajir County Logo"
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ICT Help Desk
              </CardTitle>
              <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                WAJIR COUNTY GOVERNMENT
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Professional IT Support Platform
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-700">
                <TabsTrigger value="signin" onClick={clearForm} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">Sign In</TabsTrigger>
                <TabsTrigger value="signup" onClick={clearForm} className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      className="border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-slate-700 dark:text-slate-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="pr-10 border-slate-200 focus:border-blue-500 dark:border-slate-600"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      autoComplete="name"
                      className="border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      className="border-slate-200 focus:border-blue-500 dark:border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-700 dark:text-slate-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a strong password (min 6 characters)"
                        required
                        minLength={6}
                        className="pr-10 border-slate-200 focus:border-blue-500 dark:border-slate-600"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        className="pr-10 border-slate-200 focus:border-blue-500 dark:border-slate-600"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <p className="text-sm font-semibold mb-3 text-center text-slate-700 dark:text-slate-300">Demo Accounts:</p>
              <div className="text-xs space-y-2">
                <button 
                  onClick={() => fillDemoCredentials('ellisalat@gmail.com')}
                  className="block w-full text-left p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 font-semibold text-yellow-800 dark:text-yellow-200 transition-all duration-200"
                >
                  👑 System Super Administrator
                  <span className="block text-xs text-yellow-600 dark:text-yellow-300 mt-1">ellisalat@gmail.com - All System Rights</span>
                </button>
                <button 
                  onClick={() => fillDemoCredentials('admin@wajir.go.ke')}
                  className="block w-full text-left p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/20 transition-colors"
                >
                  👨‍💼 System Administrator
                </button>
                <button 
                  onClick={() => fillDemoCredentials('tech@wajir.go.ke')}
                  className="block w-full text-left p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/20 transition-colors"
                >
                  🔧 IT Technician
                </button>
                <button 
                  onClick={() => fillDemoCredentials('supervisor@wajir.go.ke')}
                  className="block w-full text-left p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/20 transition-colors"
                >
                  👤 IT Supervisor
                </button>
                <button 
                  onClick={() => fillDemoCredentials('user@wajir.go.ke')}
                  className="block w-full text-left p-2 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/20 transition-colors"
                >
                  👥 End User
                </button>
                <div className="font-semibold text-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  🔑 Password: Demo123!@#
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Professional Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/37b18ab6-301e-4fea-860d-a70e3041499a.png" 
                    alt="Wajir County Logo"
                    className="w-6 h-6 object-contain filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Wajir County Government</h3>
                  <p className="text-sm text-slate-400">ICT Department</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Professional IT support platform designed to streamline technical assistance and enhance service delivery across all county departments.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">IT Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Service Catalog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Knowledge Base</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">System Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Contact Info</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>📧 ict@wajir.go.ke</li>
                <li>📞 +254 xxx xxx xxx</li>
                <li>🕒 Mon - Fri: 8:00 AM - 5:00 PM</li>
                <li>📍 Wajir County Headquarters</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">
              © 2024 Wajir County Government. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
