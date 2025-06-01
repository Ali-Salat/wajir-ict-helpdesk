
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseUsers } from '../hooks/useSupabaseUsers';
import CreateUserForm from '../components/users/CreateUserForm';

const Users = () => {
  const { canManageUsers, isSuperUser } = useAuth();
  const { users, isLoading, refetchUsers } = useSupabaseUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (!canManageUsers()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to manage users.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'approver': return 'default';
      case 'technician': return 'secondary';
      case 'requester': return 'outline';
      default: return 'outline';
    }
  };

  const wajirDepartments = [
    'ICT', 'Finance', 'Human Resources', 'Administration', 'Health', 
    'Education', 'Agriculture', 'Water', 'Transport', 'Trade', 
    'Land & Physical Planning', 'Environment', 'Youth & Sports',
    'Gender & Social Services', 'Public Service Board'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-900">System Users</h1>
          <p className="text-green-700">Manage Wajir County ICT Help Desk users and permissions</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
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

      {/* Search */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg text-green-900">{user.name}</CardTitle>
                    {user.email === 'ellisalat@gmail.com' && (
                      <Shield className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-green-600">{user.email}</p>
                  {user.email === 'superuser@wajir.go.ke' && (
                    <p className="text-xs text-green-600 font-medium">Director ICT</p>
                  )}
                  {user.email === 'ellisalat@gmail.com' && (
                    <p className="text-xs text-yellow-600 font-medium">Super Administrator</p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {user.email !== 'ellisalat@gmail.com' && isSuperUser && (
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Role:</span>
                  <Badge variant={getRoleColor(user.role)} className="bg-green-100 text-green-800">
                    {user.role}
                  </Badge>
                </div>
                
                {user.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Department:</span>
                    <span className="text-sm font-medium text-green-900">{user.department}</span>
                  </div>
                )}
                
                {user.skills && user.skills.length > 0 && (
                  <div>
                    <span className="text-sm text-green-700">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Status:</span>
                  <Badge variant={user.isActive ? 'secondary' : 'destructive'} className="bg-green-100 text-green-800">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="text-xs text-green-500">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <Card className="border-green-200">
          <CardContent className="p-12 text-center">
            <p className="text-green-500">No users found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;
