
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Crown, User, Shield, Wrench, Users } from 'lucide-react';
import { User as UserType } from '@/types';

interface UserCardProps {
  user: UserType;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
  isDeleting: boolean;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Shield;
    case 'approver': return Users;
    case 'technician': return Wrench;
    default: return User;
  }
};

const getRoleColor = (role: string, email?: string) => {
  if (email === 'ellisalat@gmail.com') return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  switch (role) {
    case 'admin': return 'bg-gradient-to-r from-red-500 to-red-600';
    case 'approver': return 'bg-gradient-to-r from-blue-500 to-blue-600';
    case 'technician': return 'bg-gradient-to-r from-green-500 to-green-600';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

const getUserRole = (user: UserType) => {
  if (user.email === 'ellisalat@gmail.com') return 'Super Admin';
  return user.role.charAt(0).toUpperCase() + user.role.slice(1);
};

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

export const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  canDelete,
  isDeleting
}) => {
  const RoleIcon = getRoleIcon(user.role);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mt-1"
            />
            <div className="relative">
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center shadow-lg ${getRoleColor(user.role, user.email)}`}>
                <span className="text-lg font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <RoleIcon className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
              {user.email === 'ellisalat@gmail.com' && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`text-white shadow-sm ${getRoleColor(user.role, user.email)}`}>
              {getUserRole(user)}
            </Badge>
            <Badge
              variant={user.isActive ? 'default' : 'destructive'}
              className={user.isActive ? 'bg-green-100 text-green-800 border-green-200' : ''}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600 truncate" title={user.department}>
              {formatDepartment(user.department || '')}
            </p>
            {user.title && (
              <p className="text-xs text-gray-500 mt-1">{user.title}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
