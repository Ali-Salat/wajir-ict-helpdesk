import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Shield, Eye, EyeOff, Mail, Lock, ArrowRight, Zap, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot_password'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting sign in with:', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to your account',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in failed:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting sign up with:', email, fullName);
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Account created!',
        description: "We've sent a confirmation link to your email. Please check your inbox.",
      });

      setAuthMode('signin');
      
    } catch (error: any) {
      console.error('Sign up failed:', error);
      toast({
        title: 'Sign up failed',
        description: error.message || 'Could not create your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setAuthMode(prevMode => prevMode === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 px-8">
          <div className="space-y-6">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl shadow-2xl flex items-center justify-center border-2 border-white/20 backdrop-blur-sm">
                  <Building2 className="h-11 w-11 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-4xl font-black text-white tracking-wider">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-yellow-100 bg-clip-text text-transparent drop-shadow-lg">
                      WAJIR COUNTY GOVERNMENT
                    </span>
                  </h1>
                </div>
                <p className="text-xl font-bold text-blue-200 tracking-wide">
                  ICT HELP DESK
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                Streamlined IT Support
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Fast Resolution</h3>
                    <p className="text-blue-200 text-sm">Quick ticket processing and assignment</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Secure Access</h3>
                    <p className="text-blue-200 text-sm">Role-based permissions and security</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Department Integration</h3>
                    <p className="text-blue-200 text-sm">Seamless workflow across all departments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">WAJIR COUNTY GOVERNMENT</h1>
                  <p className="text-sm font-bold text-blue-600">ICT HELP DESK</p>
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {authMode === 'signin' ? 'Welcome Back' : authMode === 'signup' ? 'Create an Account' : 'Forgot Password'}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {authMode === 'signin' 
                    ? 'Sign in to access the ICT Help Desk' 
                    : authMode === 'signup'
                    ? 'Get started with the ICT Help Desk'
                    : "Enter your email and we'll send a link to reset your password."}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {authMode === 'forgot_password' ? (
                <ForgotPasswordForm onBack={() => setAuthMode('signin')} />
              ) : authMode === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@wajir.go.ke"
                          required
                          className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="text-right pt-1">
                        <button 
                          type="button"
                          onClick={() => setAuthMode('forgot_password')}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading || !email || !password}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl group"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-6">
                   <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@wajir.go.ke"
                          required
                          className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                          className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !email || !password || !fullName}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl group"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Sign Up</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>
              )}
              {authMode !== 'forgot_password' && (
                <div className="text-center space-y-4">
                  <div className="relative text-center my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
                    </div>
                    <span className="relative px-2 bg-white/95 dark:bg-gray-900/95 text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {authMode === 'signin' ? 'Or' : ''}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={toggleAuthMode} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      © 2025 Wajir County Government. All rights reserved.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
