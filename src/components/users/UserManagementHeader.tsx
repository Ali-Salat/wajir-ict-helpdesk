
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, RefreshCw, Download, Users as UsersIcon } from 'lucide-react';
import CreateUserForm from './CreateUserForm';
import { User } from '@/types';

interface UserManagementHeaderProps {
  users: User[];
  isFetching: boolean;
  onRefresh: () => void;
  onUserCreated: () => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  users,
  isFetching,
  onRefresh,
  onUserCreated,
  isCreateDialogOpen,
  setIsCreateDialogOpen
}) => {
  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status'],
      ...users.map(user => [
        user.name,
        user.email,
        user.role,
        user.department || '',
        user.isActive ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
              <p className="text-indigo-100 text-lg">Create and manage system users</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={exportUsers}
            disabled={users.length === 0}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isFetching}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-indigo-600 hover:bg-gray-50 shadow-lg font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <CreateUserForm 
                onClose={() => setIsCreateDialogOpen(false)} 
                onUserCreated={() => {
                  onUserCreated();
                  setIsCreateDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
