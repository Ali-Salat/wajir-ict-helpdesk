
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
  deleteUserFunction: (userId: string) => Promise<{ success: boolean }>;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ 
  user, 
  open, 
  onOpenChange, 
  onUserDeleted,
  deleteUserFunction
}) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    // Check if this is a protected super admin user
    if (user.email === 'ellisalat@gmail.com' || user.email === 'mshahid@wajir.go.ke') {
      toast({
        title: "Cannot Delete Super Admin",
        description: "This user is a protected super administrator and cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      console.log('Starting user deletion process for:', user.id);
      
      // Show immediate feedback that deletion has started
      toast({
        title: "Deletion Started",
        description: `Removing ${user.name} from the system...`,
        className: "bg-blue-50 border-blue-200",
      });
      
      const result = await deleteUserFunction(user.id);
      
      if (result.success) {
        toast({
          title: "User Deleted Successfully",
          description: `${user.name} has been permanently removed from the system.`,
          className: "bg-green-50 border-green-200",
        });
        
        // Close dialog and refresh data
        onUserDeleted();
        onOpenChange(false);
      } else {
        throw new Error('Deletion failed - please try again');
      }
    } catch (error: any) {
      console.error('Delete user error:', error);
      
      let errorMessage = 'An unexpected error occurred during deletion.';
      
      if (error.message?.includes('foreign key')) {
        errorMessage = 'Cannot delete user - they have associated records in the system.';
      } else if (error.message?.includes('permission')) {
        errorMessage = 'You do not have permission to delete this user.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error - please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Deletion Failed",
        description: `Failed to delete ${user.name}. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  // Check if this is a protected user
  const isProtectedUser = user.email === 'ellisalat@gmail.com' || user.email === 'mshahid@wajir.go.ke';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-gray-800 border-0 shadow-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
            <span>Delete User</span>
            {isProtectedUser && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Protected
              </span>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            {isProtectedUser ? (
              <div className="space-y-2">
                <p>
                  <strong className="text-yellow-600">{user.name}</strong> is a protected super administrator account and cannot be deleted.
                </p>
                <p className="text-sm">This account is essential for system administration and security.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  Are you sure you want to permanently delete <strong className="text-gray-900 dark:text-white">{user.name}</strong>?
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">⚠️ This action cannot be undone</p>
                  <ul className="text-xs text-red-600 dark:text-red-400 mt-1 space-y-1">
                    <li>• User profile will be permanently removed</li>
                    <li>• All associated tickets will need reassignment</li>
                    <li>• Login access will be immediately revoked</li>
                  </ul>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isProtectedUser ? 'Close' : 'Cancel'}
          </AlertDialogCancel>
          {!isProtectedUser && (
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Permanently'
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
