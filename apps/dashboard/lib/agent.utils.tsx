import { Bot } from 'lucide-react';

// Helper function to get model icon and color
export function getModelInfo(model: string) {
  switch (model.toLowerCase()) {
    case 'gpt-4':
      return { color: 'from-green-500 to-emerald-700', icon: <Bot className="h-5 w-5" /> };
    case 'gpt-3.5-turbo':
      return { color: 'from-green-500 to-emerald-700', icon: <Bot className="h-5 w-5" /> };
    case 'claude-3':
    case 'claude-2':
      return { color: 'from-purple-500 to-violet-700', icon: <Bot className="h-5 w-5" /> };
    case 'llama-3':
      return { color: 'from-yellow-500 to-amber-700', icon: <Bot className="h-5 w-5" /> };
    case 'mistral-large':
      return { color: 'from-blue-500 to-indigo-700', icon: <Bot className="h-5 w-5" /> };
    default:
      return { color: 'from-gray-500 to-gray-700', icon: <Bot className="h-5 w-5" /> };
  }
}
