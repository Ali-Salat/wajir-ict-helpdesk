import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Edit, Trash2, Crown, Users as UsersIcon, Building2, RefreshCw, Download, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseUsersFixed } from '../hooks/useSupabaseUsersFixed';
import CreateUserForm from '../components/users/CreateUserForm';
import EditUserForm from '../components/users/EditUserForm';
import DeleteUserDialog from '../components/users/DeleteUserDialog';
import UserStats from '../components/users/UserStats';
import UserTableSkeleton from '../components/users/UserTableSkeleton';
import BulkUserActions from '../components/users/BulkUserActions';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const { canManageUsers, isSuperUser, isAuthenticated } = useAuth();
  const { 
    users, 
    isLoading, 
    isFetching, 
    error,
    refetchUsers, 
    deleteUser, 
    updateUser,
    isDeleting 
  } = useSupabaseUsersFixed();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Check authentication first
  if (!isAuthenticated) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <UsersIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Please sign in to access user management</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <LogIn className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Authentication Required</h3>
                <p className="text-yellow-700 dark:text-yellow-200">
                  You need to be signed in to access the user management section.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permissions
  if (!canManageUsers()) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <UsersIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Access denied</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Access Denied</h3>
                <p className="text-red-700 dark:text-red-200">
                  You don't have permission to manage users. Please contact an administrator.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if there's an error loading users
  if (error && !isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <UsersIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Error loading users</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Error Loading Users</h3>
                <p className="text-red-700 dark:text-red-200">
                  {error?.message || 'Failed to load users. Please try again.'}
                </p>
                <Button 
                  onClick={refetchUsers} 
                  variant="outline" 
                  className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDepartment = (department: string) => {
    if (department === 'ICT, Trade, Investment and Industry') {
      return 'ICT Department';
    }
    
    if (department.length > 40) {
      const words = department.split(' ');
      if (words.length > 3) {
        return words.slice(0, 3).join(' ') + '...';
      }
    }
    
    return department;
  };

  const getRoleColor = (role: string, email?: string) => {
    if (email === 'ellisalat@gmail.com') return 'default';
    switch (role) {
      case 'admin': return 'destructive';
      case 'approver': return 'default';
      case 'technician': return 'secondary';
      case 'requester': return 'outline';
      default: return 'outline';
    }
  };

  const getUserRole = (user: any) => {
    if (user.email === 'ellisalat@gmail.com') return 'Super Admin';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  const isProtectedUser = (email: string) => {
    return email === 'ellisalat@gmail.com' || email === 'mshahid@wajir.go.ke';
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleUserUpdated = () => {
    refetchUsers();
  };

  const handleUserDeleted = async () => {
    refetchUsers();
  };

  const handleSelectUser = (user: User, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, user]);
    } else {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = async (action: string, users: User[]) => {
    try {
      for (const user of users) {
        if (action === 'activate') {
          await updateUser({ ...user, isActive: true });
        } else if (action === 'deactivate') {
          await updateUser({ ...user, isActive: false });
        } else if (action === 'delete' && !isProtectedUser(user.email)) {
          await deleteUser(user.id);
        }
      }
      setSelectedUsers([]);
      toast({
        title: "Bulk Action Completed",
        description: `Successfully processed ${users.length} user(s).`,
      });
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Some operations may have failed. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <UsersIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Create and manage system users</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={exportUsers}
            disabled={users.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button
            variant="outline"
            onClick={refetchUsers}
            disabled={isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
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
                  refetchUsers();
                  setIsCreateDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Statistics */}
      <UserStats users={users} isLoading={isLoading} />

      {/* Search */}
      <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <BulkUserActions
        selectedUsers={selectedUsers}
        onClearSelection={() => setSelectedUsers([])}
        onBulkAction={handleBulkAction}
      />

      {/* Users Table */}
      {isLoading ? (
        <UserTableSkeleton />
      ) : (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="mr-3 h-6 w-6 text-blue-600" />
                System Users ({filteredUsers.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 dark:bg-gray-700/50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">User</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Role</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Department</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700">
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.some(u => u.id === user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-sm font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                              {user.email === 'ellisalat@gmail.com' && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(user.role, user.email)} className="font-medium shadow-sm">
                          {getUserRole(user)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm text-gray-900 dark:text-white truncate" title={user.department}>
                            {formatDepartment(user.department || '')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.isActive ? 'secondary' : 'destructive'}
                          className={user.isActive ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!isProtectedUser(user.email) && isSuperUser && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDeleteUser(user)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {filteredUsers.length === 0 && !isLoading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No users found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm 
              user={selectedUser}
              onClose={() => setIsEditDialogOpen(false)} 
              onUserUpdated={handleUserUpdated}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <DeleteUserDialog
        user={userToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onUserDeleted={handleUserDeleted}
        deleteUserFunction={deleteUser}
      />
    </div>
  );
};

export default Users;
