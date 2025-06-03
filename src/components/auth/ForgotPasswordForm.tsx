
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await resetPassword(email);
    
    if (error) {
      console.error('Password reset failed:', error);
      toast({
        title: 'Reset Failed',
        description: error.message || 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } else {
      setIsEmailSent(true);
      toast({
        title: 'Reset Email Sent',
        description: 'Please check your email for password reset instructions',
      });
    }
    setIsLoading(false);
  };

  if (isEmailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Check Your Email</h3>
          <p className="text-gray-600">
            We've sent password reset instructions to <span className="font-medium">{email}</span>
          </p>
        </div>
        <Button onClick={onBack} variant="outline" className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
        <p className="text-gray-600">
          Enter your email address and we'll send you instructions to reset your password
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email" className="text-gray-700 font-medium">Email Address</Label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            autoComplete="email"
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 h-12"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 h-12 text-lg" 
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Instructions'}
        </Button>
      </form>
      
      <Button onClick={onBack} variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sign In
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;
