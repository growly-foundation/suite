import { AgentModel } from '@/constants/agents';

export const AgentModelCard = ({ model, iconOnly }: { model: AgentModel; iconOnly?: boolean }) => {
  return (
    <div className="flex items-center text-left">
      <img src={model.logo} alt={model.name} className="w-7 h-7 rounded-xl" />
      <span
        className="font-medium bg-primary text-primary-foreground px-2 py-1 text-xs rounded-xl whitespace-nowrap"
        style={{ margin: '0 10px' }}>
        {model.name}
      </span>
      {!iconOnly && (
        <span className="text-xs text-muted-foreground text-left">{model.description}</span>
      )}
    </div>
  );
};
