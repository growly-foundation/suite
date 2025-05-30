import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDashboardState } from '@/hooks/use-dashboard';
import { getNumberFromStr } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { Copy } from 'lucide-react';

export function UserDetailsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { logout } = usePrivy();
  const { admin: user } = useDashboardState();

  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="hidden md:block">{user?.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[450px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View and manage your account information.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-white/20 cursor-pointer">
              <AvatarImage
                src={`/agent-avatars/agent-avatar-${getNumberFromStr(user?.name || '', 7)}.webp`}
              />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{user?.name}</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Copy size="22" className="cursor-pointer" />
            <input
              type="text"
              value={user?.id}
              className="bg-transparent border-none focus:outline-none w-full"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="mt-4 flex flex-col gap-2">
          <Button
            variant="destructive"
            onClick={async () => {
              await logout();
              onOpenChange(false);
            }}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
