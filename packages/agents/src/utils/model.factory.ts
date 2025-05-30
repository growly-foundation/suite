import { ChatAnthropic } from '@langchain/anthropic';
import { ChatBedrockConverse } from '@langchain/aws';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

export type ChatProvider = 'openai' | 'anthropic' | 'bedrock';

interface ChatModelOptions {
  provider: ChatProvider;
  temperature?: number;
  modelName?: string;
  verbose?: boolean;
}

export class ChatModelFactory {
  static create(options: ChatModelOptions): BaseChatModel {
    const { provider, temperature = 0.7, modelName, verbose = false } = options;

    switch (provider) {
      case 'openai':
        return new ChatOpenAI({
          modelName: modelName ?? 'gpt-4o-mini',
          temperature,
          streaming: true,
          openAIApiKey: process.env.OPENAI_API_KEY!,
          verbose,
        }) as any;

      case 'anthropic':
        return new ChatAnthropic({
          modelName: modelName ?? 'claude-3-5-sonnet-20240620',
          temperature,
          anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
          verbose,
        });

      case 'bedrock':
        return new ChatBedrockConverse({
          model: modelName ?? 'us.meta.llama3-3-70b-instruct-v1:0',
          region: process.env.BEDROCK_AWS_REGION || 'us-east-1',
          credentials: {
            accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
          },
          verbose,
        });

      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
