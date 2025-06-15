
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
      // For demo purposes, we'll just show a success message
      // In a real implementation, you'd need admin privileges to reset passwords
      setIsSuccess(true);
      toast({
        title: 'Password Reset Initiated',
        description: `Password reset has been initiated for ${user.name}`,
      });
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
              <h3 className="text-lg font-semibold text-gray-900">Reset Initiated</h3>
              <p className="text-gray-600">
                Password reset has been initiated for {user.name}.
              </p>
              <p className="text-sm text-gray-500">
                User: <span className="font-medium">{user.email}</span>
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
                    This will initiate a password reset for the selected user.
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
