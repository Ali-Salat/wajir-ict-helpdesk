
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

    setIsDeleting(true);
    
    try {
      await deleteUserFunction(user.id);
      
      toast({
        title: "User Deleted",
        description: `${user.name} has been successfully removed from the system.`,
        variant: "destructive",
      });
      
      onUserDeleted();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Delete user error:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete ${user.name}. ${error.message || 'An unexpected error occurred.'}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-gray-800 border-0 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-white">Delete User</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{user.name}</strong>? This action cannot be undone.
            All tickets assigned to this user will need to be reassigned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
