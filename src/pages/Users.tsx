
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { RootState } from '../store/store';
import { setUsers } from '../store/slices/usersSlice';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import CreateUserForm from '../components/users/CreateUserForm';

const Users = () => {
  const dispatch = useDispatch();
  const { canManageUsers } = useAuth();
  const { users } = useSelector((state: RootState) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const fetchUsers = () => {
    // Mock users data with Islamic names in English
    const mockUsers: User[] = [
      {
        id: '0',
        email: 'superuser@wajir.go.ke',
        name: 'Mohamed Shahid',
        role: 'admin',
        department: 'ICT',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '1',
        email: 'admin@wajir.go.ke',
        name: 'Ahmad',
        role: 'admin',
        department: 'ICT',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'tech@wajir.go.ke',
        name: 'Ibrahim',
        role: 'technician',
        department: 'ICT',
        skills: ['Hardware', 'Network', 'Software'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'user@wajir.go.ke',
        name: 'Fatima',
        role: 'requester',
        department: 'Finance',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        email: 'supervisor@wajir.go.ke',
        name: 'Mohammed',
        role: 'approver',
        department: 'ICT',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    dispatch(setUsers(mockUsers));
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to manage users.</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system users and permissions</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
              onUserCreated={fetchUsers}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  {user.email === 'superuser@wajir.go.ke' && (
                    <p className="text-xs text-wajir-green font-medium">Director ICT</p>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                  <Badge variant={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                
                {user.department && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Department:</span>
                    <span className="text-sm">{user.department}</span>
                  </div>
                )}
                
                {user.skills && user.skills.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant={user.isActive ? 'secondary' : 'destructive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-500">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No users found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;
