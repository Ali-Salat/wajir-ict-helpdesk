
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setUsers } from '../../store/slices/usersSlice';
import { useToast } from '@/hooks/use-toast';

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ 
  user, 
  open, 
  onOpenChange, 
  onUserDeleted 
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { users } = useSelector((state: RootState) => state.users);

  const handleDelete = () => {
    if (!user) return;

    const updatedUsers = users.filter(u => u.id !== user.id);
    dispatch(setUsers(updatedUsers));
    
    toast({
      title: "User Deleted",
      description: `${user.name} has been removed from the system.`,
      variant: "destructive",
    });

    onUserDeleted();
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
            All tickets assigned to this user will need to be reassigned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
