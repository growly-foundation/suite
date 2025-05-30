export interface AgentModel {
  id: string;
  name: string;
  description: string;
  logo?: string;
}

// Available models for the agent
export const availableModels: AgentModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: "OpenAI's most advanced model",
    logo: '/logos/llm/chatgpt.webp',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    logo: '/logos/llm/chatgpt.webp',
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: "Anthropic's latest model with enhanced reasoning",
    logo: '/logos/llm/claude.png',
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    description: 'Balanced performance and efficiency',
    logo: '/logos/llm/claude.png',
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    description: "Meta's open model with strong capabilities",
    logo: '/logos/llm/llama3.webp',
  },
];

export const agentModelMap: Record<string, AgentModel> = availableModels.reduce(
  (acc, model) => {
    acc[model.id] = model;
    return acc;
  },
  {} as Record<string, AgentModel>
);
