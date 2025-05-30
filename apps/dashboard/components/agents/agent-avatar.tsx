import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNumberFromStr } from '@/lib/utils';

export const AgentAvatar = ({
  value,
  width = 40,
  height = 40,
}: {
  value: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Avatar style={{ width, height }}>
      <AvatarImage src={`/agent-avatars/agent-avatar-${getNumberFromStr(value, 7)}.webp`} />
      <AvatarFallback>{value}</AvatarFallback>
    </Avatar>
  );
};
