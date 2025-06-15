'use client';

import { AnimatedLoadingSmall } from '@/components/animated-components/animated-loading-small';
import { EnhancedUsersTable } from '@/components/app-users/enhanced-users-table';
import { PrimaryButton } from '@/components/buttons/primary-button';
import { SearchInput } from '@/components/inputs/search-input';
import { generateMockUsers } from '@/constants/mockUsers';
import { useSelectedOrganizationUsersEffect } from '@/hooks/use-organization-effect';
import React, { useState } from 'react';

import { ParsedUser } from '@getgrowly/core';

export function UserDirectoryLayout({ users, loading }: { users: ParsedUser[]; loading: boolean }) {
  const [viewDemo, setViewDemo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users
  const filteredUsers = users.filter(
    user =>
      user.ensName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const _users = viewDemo ? generateMockUsers(100) : filteredUsers;
  return (
    <React.Fragment>
      {loading ? (
        <AnimatedLoadingSmall />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-slate-200 p-2 px-4">
            <span className="text-sm text-muted-foreground">
              {_users.length} {_users.length === 1 ? 'user' : 'users'} available
            </span>
            <div className="flex items-center gap-2">
              <SearchInput
                className="p-2"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Quick search by ENS or address..."
              />
              <PrimaryButton onClick={() => setViewDemo(true)}>View demo</PrimaryButton>
            </div>
          </div>
          <EnhancedUsersTable users={_users} />
        </div>
      )}
    </React.Fragment>
  );
}

export function UsersInner() {
  const { organizationUsers, organizationUserStatus } = useSelectedOrganizationUsersEffect();
  return (
    <UserDirectoryLayout users={organizationUsers} loading={organizationUserStatus === 'loading'} />
  );
}
