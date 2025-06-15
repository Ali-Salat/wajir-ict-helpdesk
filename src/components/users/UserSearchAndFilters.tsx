
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface UserSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (value: string) => void;
}

export const UserSearchAndFilters: React.FC<UserSearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  departmentFilter,
  onDepartmentFilterChange
}) => {
  const departments = [
    'All Departments',
    'ICT, Trade, Investment and Industry',
    'Health Services',
    'Water Services',
    'Office of the Governor, Public Service and County Administration',
    'Agriculture, Livestock and Veterinary Services',
    'Finance and Economic Planning',
    'Education, Social Welfare and Family Affairs',
    'Roads and Transport',
    'Lands, Public Works and Urban Development',
    'Energy, Environment and Climate Change',
    'Wajir Municipality',
    'Wajiwasco (Wajir Water and Sewerage Company)',
  ];

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-12 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-inner"
            />
          </div>

          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-12 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-inner">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="approver">Approver</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
              <SelectItem value="requester">Requester</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={onDepartmentFilterChange}>
            <SelectTrigger className="h-12 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 shadow-inner">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by department" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept === 'All Departments' ? 'all' : dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
