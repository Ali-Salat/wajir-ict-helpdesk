
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const TicketFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  departmentFilter,
  onDepartmentChange,
  onClearFilters,
  activeFiltersCount
}: TicketFiltersProps) => {
  return (
    <div className="bg-white rounded-lg border border-blue-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Advanced Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="border-blue-200 focus:border-blue-500">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="border-blue-200 focus:border-blue-500">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="border-blue-200 focus:border-blue-500">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="hardware">Hardware</SelectItem>
            <SelectItem value="software">Software</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="account">Account Access</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select value={departmentFilter} onValueChange={onDepartmentChange}>
          <SelectTrigger className="border-blue-200 focus:border-blue-500">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Health Services">Health Services</SelectItem>
            <SelectItem value="Water Services">Water Services</SelectItem>
            <SelectItem value="Office of the Governor, Public Service and County Administration">Office of the Governor, Public Service and County Administration</SelectItem>
            <SelectItem value="Agriculture, Livestock and Veterinary Services">Agriculture, Livestock and Veterinary Services</SelectItem>
            <SelectItem value="ICT, Trade, Investment and Industry">ICT, Trade, Investment and Industry</SelectItem>
            <SelectItem value="Finance and Economic Planning">Finance and Economic Planning</SelectItem>
            <SelectItem value="Education, Social Welfare and Family Affairs">Education, Social Welfare and Family Affairs</SelectItem>
            <SelectItem value="Roads and Transport">Roads and Transport</SelectItem>
            <SelectItem value="Lands, Public Works and Urban Development">Lands, Public Works and Urban Development</SelectItem>
            <SelectItem value="Energy, Environment and Climate Change">Energy, Environment and Climate Change</SelectItem>
            <SelectItem value="Wajir Municipality">Wajir Municipality</SelectItem>
            <SelectItem value="Wajiwasco (Wajir Water and Sewerage Company)">Wajiwasco (Wajir Water and Sewerage Company)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TicketFilters;
