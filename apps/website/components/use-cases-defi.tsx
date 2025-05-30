'use client';

import FrostedGlassIconDefi from '@/components/frosted-glass-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MatchingIcon,
  OnboardingIcon,
  TargetingIcon,
  UpgradeIcon,
} from '@/components/use-case-icons';
import { motion } from 'framer-motion';

import { GridBackground } from '@getgrowly/ui';

export default function UseCasesDefi() {
  const useCases = [
    {
      icon: <OnboardingIcon />,
      title: 'Onboarding for Innovative DeFi Protocols',
      description:
        'Ease the learning curve of the innovative DeFi solutions you bring to the world. Suite only needs to consume materials such as your whitepaper or documentation, then guides users to better understand your product.',
      idealFor: ['New protocols', 'Complex DeFi products'],
      accentColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
      icon: <UpgradeIcon />,
      title: 'Introduction of Product Upgrades',
      description:
        'When transitioning to updated versions or launching new features, Suite can organize your knowledge base and enable the AI assistant to search and retrieve information across all your sources.',
      idealFor: ['Version upgrades', 'Feature launches'],
      accentColor: 'rgba(132, 204, 22, 0.5)',
    },
    {
      icon: <MatchingIcon />,
      title: 'Directing Users to the Right Product',
      description:
        'For mature DApps offering multiple products, Suite can help match first-time users with the most suitable product based on their onchain profile and needs.',
      idealFor: ['Multi-product DApps', 'User matching'],
      accentColor: 'rgba(168, 85, 247, 0.5)',
    },
    {
      icon: <TargetingIcon />,
      title: 'Context-Aware Liquidity Incentive Campaigns',
      description:
        'Protocols launching incentive campaigns can now personalize campaign visibility for target users. For example, trading campaigns can be tailored and recommended specifically to high-risk, degen users visiting the app.',
      idealFor: ['Targeted campaigns', 'Personalized incentives'],
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
      id="use-cases"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      aria-labelledby="defi-use-cases-heading">
      <img
        src="/graphics/buster-mascot-3d-like.png"
        className="absolute object-cover w-[200px] h-[200px] right-[50px] top-[50px] rotate-[-15deg] hover:rotate-[-20deg] transition-all duration-300 cursor-pointer max-sm:hidden md:block"
      />
      <GridBackground />
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}>
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-2">
              DeFi Use Cases
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Enhancing DeFi Experiences
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our platform is designed to streamline DeFi adoption and improve user experiences.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}>
          {useCases.map((useCase, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-background/60 backdrop-blur-sm border transition-all duration-300 hover:shadow-lg dark:bg-background/80">
                <CardHeader className="pb-2">
                  <FrostedGlassIconDefi
                    icon={useCase.icon}
                    color={useCase.accentColor}
                    className="mb-4"
                  />
                  <CardTitle>{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6">
                    {useCase.description}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Ideal for:</span>
                    {useCase.idealFor.map((tag, i) => (
                      <span key={i} className="bg-muted px-2 py-1 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
