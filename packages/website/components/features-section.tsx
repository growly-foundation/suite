import FeatureCard from '@/components/feature-card';
import { BotIcon, SparklesIcon, DatabaseIcon, ServerIcon } from '@/components/feature-icons';
import { BoxIcon, WavesIcon } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <SparklesIcon />,
      title: 'Customizable Agents',
      description:
        'Use our built-in agents or create your own to automate complex workflows and tasks.',
      accentColor: 'rgba(236, 72, 153, 0.5)',
    },
    {
      icon: <BoxIcon />,
      title: 'Widget as a Service',
      description:
        'Embed our agents into your website or application with our widget-based integration.',
      accentColor: 'rgba(0, 255, 179, 0.84)',
    },
    {
      icon: <WavesIcon />,
      title: 'Workflow Engine',
      description:
        'Create complex workflows with our workflow engine, including custom triggers, conditions, and actions.',
      accentColor: 'rgba(249, 115, 22, 0.5)',
    },
    {
      icon: <BotIcon />,
      title: 'Advanced LLM Conversations',
      description:
        'Switch between different language models to find the perfect fit for your specific use case with built-in performance analytics.',
      accentColor: 'rgba(36, 101, 237, 0.5)',
    },
    {
      icon: <DatabaseIcon />,
      title: 'Protocol-specific Knowledge Base',
      description:
        'Store and manage protocol-specific knowledge in a secure and accessible manner, including smart contracts, documentations, and more.',
      accentColor: 'rgba(34, 211, 238, 0.5)',
    },
    {
      icon: <ServerIcon />,
      title: 'External Context Providers',
      description:
        'Integrate external context providers to provide additional context to the agents. Support MCP Servers, A2A protocols, LangChain tools and more.',
      accentColor: 'rgba(168, 85, 247, 0.5)',
    },
  ];

  return (
    <section
      className="py-20 bg-muted/50 dark:bg-muted/10"
      id="features"
      aria-labelledby="features-heading">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-2">
              Key Features
            </div>
            <h2
              id="features-heading"
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Web 3.0 Agentic Platform
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Designed specifically for organizations to customize AI agents with powerful
              workflows, with UX-first design.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
