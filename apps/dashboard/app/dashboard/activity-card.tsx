import moment from 'moment';

export interface Activity {
  type: 'agent' | 'workflow' | 'team';
  title: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.color}`}>
        {activity.icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{moment(activity.timestamp).fromNow()}</p>
      </div>
    </div>
  );
};
