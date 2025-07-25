import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, LogIn, Users as UsersIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useMongoUserService } from '../hooks/useMongoUserService';
import EditUserForm from '../components/users/EditUserForm';
import DeleteUserDialog from '../components/users/DeleteUserDialog';
import UserStats from '../components/users/UserStats';
import BulkUserActions from '../components/users/BulkUserActions';
import { UserManagementHeader } from '../components/users/UserManagementHeader';
import { UserSearchAndFilters } from '../components/users/UserSearchAndFilters';
import { UserCard } from '../components/users/UserCard';
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
  } = useMongoUserService();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Check authentication first
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-12">
            <div className="p-4 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm inline-block mb-6">
              <UsersIcon className="h-16 w-16 text-indigo-600 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">User Management</h1>
            <p className="text-xl text-gray-600 mb-8">Please sign in to access user management</p>
          </div>

          <Card className="border-0 shadow-xl bg-yellow-50/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <LogIn className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-yellow-900">Authentication Required</h3>
                  <p className="text-yellow-700 mt-2">
                    You need to be signed in to access the user management section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check permissions
  if (!canManageUsers()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-12">
            <div className="p-4 bg-white/80 rounded-2xl shadow-xl backdrop-blur-sm inline-block mb-6">
              <UsersIcon className="h-16 w-16 text-red-600 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">User Management</h1>
            <p className="text-xl text-gray-600 mb-8">Access denied</p>
          </div>

          <Card className="border-0 shadow-xl bg-red-50/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900">Access Denied</h3>
                  <p className="text-red-700 mt-2">
                    You don't have permission to manage users. Please contact an administrator.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

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
        title: "Success",
        description: `Successfully processed ${users.length} user(s).`,
        className: 'bg-green-50 border-green-200',
      });
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Some operations may have failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    refetchUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <UserManagementHeader
          users={users}
          isFetching={isFetching}
          onRefresh={refetchUsers}
          onUserCreated={refetchUsers}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />

        {/* Error State with Improved Design */}
        {error && (
          <Card className="border-0 shadow-xl bg-red-50/90 backdrop-blur-sm border-red-200">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Users</h3>
                  <p className="text-red-700 mb-4">
                    {error?.message?.includes('policy')
                      ? 'Permission error. You may only have access to limited user data.'
                      : error?.message || 'Failed to load users. Please try again.'
                    }
                  </p>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleRetry}
                      disabled={isFetching}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Statistics - Only show if we have data */}
        {!error && <UserStats users={users} isLoading={isLoading} />}

        {/* Search and Filters - Only show if we have data or are loading */}
        {(!error || users.length > 0) && (
          <UserSearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            departmentFilter={departmentFilter}
            onDepartmentFilterChange={setDepartmentFilter}
          />
        )}

        {/* Bulk Actions - Only show if we have users */}
        {users.length > 0 && (
          <BulkUserActions
            selectedUsers={selectedUsers}
            onClearSelection={() => setSelectedUsers([])}
            onBulkAction={handleBulkAction}
          />
        )}

        {/* Users Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-14 w-14 bg-gray-200 rounded-xl"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !error && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={selectedUsers.some(u => u.id === user.id)}
                onSelect={(checked) => handleSelectUser(user, checked)}
                onEdit={() => handleEditUser(user)}
                onDelete={() => handleDeleteUser(user)}
                canDelete={!isProtectedUser(user.email) && isSuperUser}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        ) : !error && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <UsersIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {filteredUsers.length === 0 && users.length > 0
                  ? 'No users match your current search criteria.'
                  : 'No users have been created yet.'
                }
              </p>
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
                onUserUpdated={refetchUsers}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <DeleteUserDialog
          user={userToDelete}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onUserDeleted={refetchUsers}
          deleteUserFunction={deleteUser}
        />
      </div>
    </div>
  );
};

export default Users;
