'use client';

import { UsersConversationSidebar } from '@/components/app-users/app-user-conversation-sidebar';
import { ConversationArea } from '@/components/conversations/conversation-area';
import { useAgentUsersEffect } from '@/hooks/use-agent-effect';
import { useDashboardState } from '@/hooks/use-dashboard';
import { Sidebar } from 'lucide-react';
import React from 'react';

import { AggregatedAgent } from '@getgrowly/core';
import { truncateAddress } from '@getgrowly/ui';

import { AnimatedLoadingSmall } from '../animated-components/animated-loading-small';
import { AppUserAvatarWithStatus } from '../app-users/app-user-avatar-with-status';
import { UserDetails } from '../app-users/app-user-details';
import { InteractableIcon } from '../ui/interactable-icon';
import { ResizableSheet } from '../ui/resizable-sheet';

export function AgentConversations({ agent }: { agent: AggregatedAgent }) {
  const { agentUserStatus: userStatus, setSelectedAgentUser: setSelectedUser } =
    useDashboardState();
  const { selectedUser, users } = useAgentUsersEffect(agent.id);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex w-full overflow-hidden h-[85.1vh]">
      {userStatus === 'loading' ? (
        <div className="flex w-full items-center justify-center h-full">
          <AnimatedLoadingSmall />
        </div>
      ) : users.length > 0 && selectedUser ? (
        <React.Fragment>
          <UsersConversationSidebar
            users={users}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center gap-3">
                <AppUserAvatarWithStatus user={selectedUser} size={35} />
                <div>
                  <p className="font-medium text-sm">
                    {selectedUser.ensName || truncateAddress(selectedUser.address, 10, 4)}
                  </p>
                </div>
              </div>
              <InteractableIcon
                iconComponent={props => (
                  <Sidebar
                    onClick={() => {
                      setOpen(true);
                    }}
                    {...props}
                  />
                )}
              />
            </div>
            <ConversationArea selectedUser={selectedUser} />
          </div>
          {/* User Details Drawer */}
          <ResizableSheet side="right" open={open} onOpenChange={setOpen}>
            {selectedUser && <UserDetails user={selectedUser} />}
          </ResizableSheet>
        </React.Fragment>
      ) : (
        <div className="flex w-full items-center justify-center h-full">
          <span className="text-muted-foreground">No conversations found.</span>
        </div>
      )}
    </div>
  );
}
