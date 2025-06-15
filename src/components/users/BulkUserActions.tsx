
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, UserX, UserCheck, Trash2 } from 'lucide-react';
import { User } from '@/types';

interface BulkUserActionsProps {
  selectedUsers: User[];
  onClearSelection: () => void;
  onBulkAction: (action: string, users: User[]) => void;
}

const BulkUserActions: React.FC<BulkUserActionsProps> = ({
  selectedUsers,
  onClearSelection,
  onBulkAction,
}) => {
  const [bulkAction, setBulkAction] = useState<string>('');

  if (selectedUsers.length === 0) return null;

  const handleBulkAction = () => {
    if (bulkAction && selectedUsers.length > 0) {
      onBulkAction(bulkAction, selectedUsers);
      setBulkAction('');
    }
  };

  const protectedUsers = selectedUsers.filter(u => 
    u.email === 'ellisalat@gmail.com' || u.email === 'mshahid@wajir.go.ke'
  );

  return (
    <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {selectedUsers.length} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {protectedUsers.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {protectedUsers.length} protected user(s) selected
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span>Activate Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="deactivate">
                  <div className="flex items-center space-x-2">
                    <UserX className="h-4 w-4 text-yellow-600" />
                    <span>Deactivate Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="delete" disabled={protectedUsers.length > 0}>
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span>Delete Users</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={handleBulkAction}
              disabled={!bulkAction}
              variant="default"
              size="sm"
            >
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUserActions;
