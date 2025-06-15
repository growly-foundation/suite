'use client';

import { formatNumber } from '@/lib/string.utils';
import { cn } from '@/lib/utils';
import { Check, EyeOff, Filter, MoreHorizontal, Settings, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ParsedUser } from '@getgrowly/core';
import { WalletAddress } from '@getgrowly/ui';

import { ActivityIcon } from '../transactions/activity-icon';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ResizableSheet } from '../ui/resizable-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AppUserAvatarWithStatus } from './app-user-avatar-with-status';
import { UserBadges } from './app-user-badges';
import { UserDetails } from './app-user-details';

// Define column types
type ColumnType = 'string' | 'number' | 'array' | 'object' | 'date';
type OperatorType =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'startsWith'
  | 'endsWith';

// Define field-to-type mapping
const FIELD_TYPES: Record<string, ColumnType> = {
  id: 'string',
  address: 'string',
  ensName: 'string',
  tokens: 'array',
  portfolioValue: 'number',
  recentActivity: 'array',
  reputation: 'object',
};

// Define operators based on column types
const OPERATORS_BY_TYPE: Record<ColumnType, OperatorType[]> = {
  string: ['eq', 'neq', 'contains', 'startsWith', 'endsWith'],
  number: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte'],
  array: ['contains'],
  object: [],
  date: ['eq', 'neq', 'gt', 'lt', 'gte', 'lte'],
};

// Operator labels for UI
const OPERATOR_LABELS: Record<OperatorType, string> = {
  eq: 'Equals',
  neq: 'Not equals',
  contains: 'Contains',
  gt: 'Greater than',
  lt: 'Less than',
  gte: 'Greater than or equal',
  lte: 'Less than or equal',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
};

// Define column config
interface ColumnConfig {
  id: string;
  label: string;
  type: ColumnType;
  visible: boolean;
  accessor: (user: ParsedUser) => any;
  width?: string;
  freeze?: boolean;
}

type Filter = {
  field: string;
  operator: OperatorType;
  value: string | number;
};

// Initial column setup
const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    id: 'select',
    label: '',
    type: 'object',
    visible: true,
    accessor: () => null,
    width: '40px',
    freeze: true,
  },
  {
    id: 'user',
    label: 'User',
    type: 'object',
    visible: true,
    accessor: (user: ParsedUser) => ({ address: user.address, ensName: user.ensName }),
    width: '200px',
    freeze: true,
  },
  {
    id: 'portfolioValue',
    label: 'Portfolio Value',
    type: 'number',
    visible: true,
    accessor: (user: ParsedUser) => user.tokens.reduce((acc, token) => acc + token.value, 0),
    width: '120px',
  },
  {
    id: 'activity',
    label: 'Activity',
    type: 'object',
    visible: true,
    accessor: (user: ParsedUser) => user.recentActivity[0],
    width: '200px',
  },
  {
    id: 'badges',
    label: 'Badges',
    type: 'array',
    visible: true,
    accessor: (user: ParsedUser) => user.reputation.badges,
    width: '150px',
  },
  {
    id: 'tokens',
    label: 'Tokens',
    type: 'array',
    visible: true,
    accessor: (user: ParsedUser) => user.tokens,
    width: '200px',
  },
  {
    id: 'actions',
    label: 'Actions',
    type: 'object',
    visible: true,
    accessor: () => null,
    width: '80px',
  },
];

const ItemsPerPageOptions = [10, 15, 25, 50, 100];

// Helper to apply filters
const applyFilters = (users: ParsedUser[], filters: Filter[]): ParsedUser[] => {
  if (!filters.length) return users;

  return users.filter(user => {
    return filters.every(filter => {
      // Get column config for this filter
      const column = DEFAULT_COLUMNS.find(col => col.id === filter.field);
      if (!column) return true;

      const value = column.accessor(user);

      switch (filter.operator) {
        case 'eq':
          return String(value) === String(filter.value);
        case 'neq':
          return String(value) !== String(filter.value);
        case 'contains':
          if (Array.isArray(value)) {
            return value.some(item =>
              JSON.stringify(item).toLowerCase().includes(String(filter.value).toLowerCase())
            );
          }
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'gt':
          return Number(value) > Number(filter.value);
        case 'lt':
          return Number(value) < Number(filter.value);
        case 'gte':
          return Number(value) >= Number(filter.value);
        case 'lte':
          return Number(value) <= Number(filter.value);
        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
        default:
          return true;
      }
    });
  });
};

// Column Filter Component
function ColumnFilterPopover({
  column,
  addFilter,
}: {
  column: ColumnConfig;
  addFilter: (filter: Filter) => void;
}) {
  const [operator, setOperator] = useState<OperatorType>('eq');
  const [value, setValue] = useState<string>('');

  // Get applicable operators for this column type
  const operators = OPERATORS_BY_TYPE[column.type] || [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Filter className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter {column.label}</h4>
            <div className="border-b pb-2">
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium">Operator</label>
                  <select
                    className="w-full rounded-md border p-2 text-sm"
                    value={operator}
                    onChange={e => setOperator(e.target.value as OperatorType)}>
                    {operators.map(op => (
                      <option key={op} value={op}>
                        {OPERATOR_LABELS[op]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium">Value</label>
                  <Input
                    className="w-full"
                    value={value}
                    type={column.type === 'number' ? 'number' : 'text'}
                    onChange={e => setValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setValue('');
                  setOperator('eq');
                }}>
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (value.trim() === '') return;

                  addFilter({
                    field: column.id,
                    operator,
                    value: column.type === 'number' ? Number(value) : value,
                  });

                  setValue('');
                }}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Column Selection Component
function ColumnSelector({
  columns,
  toggleColumnVisibility,
}: {
  columns: ColumnConfig[];
  toggleColumnVisibility: (columnId: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Settings className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <div className="space-y-3">
          <h4 className="font-medium">Toggle Columns</h4>
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {columns
              .filter(col => !col.freeze) // Don't allow toggling frozen columns
              .map(column => (
                <div key={column.id} className="flex items-center justify-between py-1">
                  <span className="text-sm">{column.label}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleColumnVisibility(column.id)}
                    className={cn(
                      'h-6 w-6',
                      column.visible ? 'text-primary' : 'text-muted-foreground'
                    )}>
                    {column.visible ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Active Filters Component
function ActiveFilters({
  filters,
  removeFilter,
  clearAllFilters,
}: {
  filters: Filter[];
  removeFilter: (index: number) => void;
  clearAllFilters: () => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 mb-2">
      <span className="text-sm font-medium">Active filters:</span>
      {filters.map((filter, index) => {
        const column = DEFAULT_COLUMNS.find(col => col.id === filter.field);
        if (!column) return null;

        return (
          <div
            key={index}
            className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-xs">
            <span>
              {column.label} {OPERATOR_LABELS[filter.operator]} {filter.value}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => removeFilter(index)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}

      {filters.length > 1 && (
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-6">
          Clear all
        </Button>
      )}
    </div>
  );
}

// The main enhanced users table component
export function EnhancedUsersTable({ users }: { users: ParsedUser[] }) {
  // State management
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ParsedUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>({});

  // Apply filters and pagination
  const filteredUsers = useMemo(() => {
    return applyFilters(users, filters);
  }, [users, filters]);

  // Calculate pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev =>
      prev.map(col => (col.id === columnId ? { ...col, visible: !col.visible } : col))
    );
  };

  // Handle filters
  const addFilter = (filter: Filter) => {
    setFilters([...filters, filter]);
    setCurrentPage(1); // Reset to first page when adding a filter
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  // Handle user selection
  const handleUserClick = (user: ParsedUser) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  // Only show visible columns
  const visibleColumns = columns.filter(col => col.visible);
  const frozenColumns = visibleColumns.filter(col => col.freeze);
  const scrollableColumns = visibleColumns.filter(col => !col.freeze);

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b p-2">
        <div>
          <span className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'user' : 'users'}
          </span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            {/* Column selector */}
            <ColumnSelector columns={columns} toggleColumnVisibility={toggleColumnVisibility} />

            {/* Items per page selector */}
            <div className="flex items-center ml-4">
              <span className="text-sm mr-2">Show:</span>
              <select
                className="rounded-md border p-1 text-sm w-16"
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page
                }}>
                {ItemsPerPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />

      {/* Enhanced Table */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* Frozen columns (always visible) */}
                {frozenColumns.map(column => (
                  <TableHead
                    key={column.id}
                    className="bg-muted sticky left-0 z-10"
                    style={{ width: column.width || 'auto' }}>
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {column.id !== 'select' && column.type !== 'object' && (
                        <ColumnFilterPopover column={column} addFilter={addFilter} />
                      )}
                    </div>
                  </TableHead>
                ))}

                {/* Scrollable columns */}
                {scrollableColumns.map(column => (
                  <TableHead key={column.id} style={{ width: column.width || 'auto' }}>
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {column.type !== 'object' && (
                        <ColumnFilterPopover column={column} addFilter={addFilter} />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map(user => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    {/* Frozen columns */}
                    {frozenColumns.map(column => {
                      if (column.id === 'select') {
                        return (
                          <TableCell
                            key={column.id}
                            className="sticky left-0 bg-white z-10"
                            onClick={e => {
                              e.stopPropagation();
                              const newValue = !selectedUsers[user.id];
                              setSelectedUsers({
                                ...selectedUsers,
                                [user.id]: newValue,
                              });
                            }}>
                            <Checkbox
                              className="border-gray-450"
                              checked={selectedUsers[user.id] || false}
                              onCheckedChange={checked => {
                                setSelectedUsers({
                                  ...selectedUsers,
                                  [user.id]: !!checked,
                                });
                              }}
                            />
                          </TableCell>
                        );
                      }

                      if (column.id === 'user') {
                        return (
                          <TableCell key={column.id} className="sticky left-[40px] bg-white z-10">
                            <div className="flex items-center text-sm space-x-3">
                              <AppUserAvatarWithStatus user={user} size={30} />
                              <WalletAddress
                                className="text-xs hover:underline"
                                truncate
                                truncateLength={{ startLength: 12, endLength: 4 }}
                                address={user.address}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleUserClick(user);
                                }}
                              />
                            </div>
                          </TableCell>
                        );
                      }

                      return null; // Should never reach here
                    })}

                    {/* Scrollable columns */}
                    {scrollableColumns.map(column => {
                      const value = column.accessor(user);

                      switch (column.id) {
                        case 'portfolioValue':
                          return (
                            <TableCell key={column.id}>
                              <span className="text-xs">${formatNumber(value)}</span>
                            </TableCell>
                          );

                        case 'activity':
                          return (
                            <TableCell key={column.id}>
                              {value ? (
                                <div className="flex items-center gap-2">
                                  <ActivityIcon type={value.type} />
                                  <span className="text-sm line-clamp-1">{value.description}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">No activity</span>
                              )}
                            </TableCell>
                          );

                        case 'badges':
                          return (
                            <TableCell key={column.id}>
                              <UserBadges badges={value} />
                            </TableCell>
                          );

                        case 'tokens':
                          return (
                            <TableCell key={column.id}>
                              <div className="flex items-center gap-1">
                                {value.slice(0, 2).map((token: any, i: number) => (
                                  <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    {token.symbol}
                                  </span>
                                ))}
                                {value.length > 2 && (
                                  <div className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    +{value.length - 2}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          );

                        case 'actions':
                          return (
                            <TableCell key={column.id} className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleUserClick(user);
                                }}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          );

                        default:
                          return <TableCell key={column.id}>{String(value || '')}</TableCell>;
                      }
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-2 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of{' '}
            {totalItems}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Details Drawer */}
      <ResizableSheet side="right" open={open} onOpenChange={closeUserDetails}>
        {selectedUser && <UserDetails user={selectedUser} />}
      </ResizableSheet>
    </div>
  );
}
