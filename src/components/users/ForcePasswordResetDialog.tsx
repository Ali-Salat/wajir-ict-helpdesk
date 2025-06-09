
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface ForcePasswordResetDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForcePasswordResetDialog = ({ user, open, onOpenChange }: ForcePasswordResetDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleForceReset = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // First, force password reset requirement
      const { error: forceError } = await supabase.rpc('force_password_reset', {
        target_user_id: user.id
      });

      if (forceError) {
        console.error('Force password reset error:', forceError);
        toast({
          title: 'Reset Failed',
          description: forceError.message || 'Failed to force password reset',
          variant: 'destructive',
        });
        return;
      }

      // Then send password reset email
      const { error: emailError } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (emailError) {
        console.error('Password reset email error:', emailError);
        toast({
          title: 'Email Send Failed',
          description: 'Password reset policy applied but email failed to send',
          variant: 'destructive',
        });
      } else {
        setIsSuccess(true);
        toast({
          title: 'Password Reset Enforced',
          description: `${user.name} must change their password on next login`,
        });
      }
    } catch (error) {
      console.error('Password reset exception:', error);
      toast({
        title: 'Reset Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-orange-600" />
            <span>Force Password Reset</span>
          </DialogTitle>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Password Reset Enforced</h3>
              <p className="text-gray-600">
                {user.name} will be required to change their password on next login.
              </p>
              <p className="text-sm text-gray-500">
                A reset email has also been sent to: <span className="font-medium">{user.email}</span>
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-800">
                    Force Password Reset
                  </p>
                  <p className="text-sm text-orange-700">
                    This will require the user to change their password on next login. 
                    A password reset email will also be sent immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User:</span>
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleForceReset}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Force Reset'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForcePasswordResetDialog;
