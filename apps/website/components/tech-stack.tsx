'use client';

import FrostedGlassIcon from '@/components/frosted-glass-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import React from 'react';

import { BotIcon, ZapIcon } from './feature-icons';

export default function TechStack() {
  const technologies = [
    {
      icon: <BotIcon />,
      type: 'single',
      title: 'AgentKit & OnchainKit',
      description:
        'Our AI infrastructure is built on top of the Coinbase AgentKit to provide functionalities for onchain actions on Base.',
      accentColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
      icon: <ZapIcon />,
      type: 'single',
      title: 'x402 Protocol',
      description:
        'Growly Suite is powered by the x402 Protocol — a borderless payment system that allows us to seamlessly charge for our services.',
      accentColor: 'rgba(139, 92, 246, 0.5)',
    },
    {
      icon: (
        <div className="flex -space-x-4">
          {[
            <img
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="/icons/zerion-icon.png"
              alt="Zerion"
            />,
            <img
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="/icons/base-icon.png"
              alt="Base"
            />,
            <img
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="/icons/defillama-icon.png"
              alt="Defillama"
            />,
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-sm font-semibold">
              5+
            </div>,
          ].map((icon, index) => (
            <FrostedGlassIcon
              key={`data-provider-${index}`}
              icon={icon}
              color="rgba(59, 130, 246, 0.5)"
            />
          ))}
        </div>
      ),
      type: 'multiple',
      title: 'Onchain Data Providers',
      description:
        'Knowledge base of the agents is empowered by multiple onchain data providers like Zerion and DeFi Llama.',
      accentColor: 'rgba(245, 158, 11, 0.5)',
    },
    {
      icon: (
        <div className="flex -space-x-4">
          {[
            <div className="w-10 h-10 rounded-full text-gray-200 flex items-center justify-center text-3xl font-semibold">
              🔥
            </div>,
            <img
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="/icons/perplexity-icon.png"
              alt="Perplexity"
            />,
            <img
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="/icons/openai-icon.png"
              alt="OpenAI"
            />,
            <img
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src="/icons/athropic-icon.png"
              alt="Anthropic"
            />,
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-sm font-semibold">
              2+
            </div>,
          ].map((icon, index) => (
            <FrostedGlassIcon
              key={`data-provider-${index}`}
              icon={icon}
              color="rgba(59, 130, 246, 0.5)"
            />
          ))}
        </div>
      ),
      type: 'multiple',
      title: 'MCP Servers',
      description:
        'MCP Servers are used to communicate with external agents and provide additional context.',
      accentColor: 'rgba(239, 68, 68, 0.5)',
    },
  ];

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="solutions"
      className="py-20 bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/10">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}>
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-2">
              Technologies
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Built with your familiar tech stack
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our AI platform is designed to meet the unique challenges of various sectors.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}>
          {technologies.map((technology, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-background/60 backdrop-blur-sm border transition-all duration-300 hover:shadow-lg dark:bg-background/80">
                <CardHeader className="pb-2">
                  {technology.type === 'single' ? (
                    <FrostedGlassIcon
                      icon={technology.icon}
                      color={technology.accentColor}
                      className="mb-4"
                    />
                  ) : (
                    <div className="mb-4">{technology.icon}</div>
                  )}
                  <CardTitle>{technology.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{technology.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
