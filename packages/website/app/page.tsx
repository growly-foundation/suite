'use client';

import IntentSuggestion from '@/components/defi/intent-suggestion';
import KnowYourDapp from '@/components/defi/kyd';
import Persona from '@/components/defi/persona';
import FeaturesSection from '@/components/features-section';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import StructuredData from '@/components/structured-data';
import TechStack from '@/components/tech-stack';
import TypingPromptInput from '@/components/typing-prompt-input';
import { Button } from '@/components/ui/button';
import UseCasesDefi from '@/components/use-cases-defi';
import { BusterState, GridBackground, FramerSpotlight } from '@getgrowly/ui';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const AnimatedBuster = dynamic(() => import('@getgrowly/ui').then(suite => suite.AnimatedBuster), {
  ssr: false,
});

export default function Home() {
  const [state, setState] = useState<BusterState>('idle');
  return (
    <>
      <StructuredData />
      <div className="flex min-h-screen flex-col">
        <Navbar />

        {/* Hero Section */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <GridBackground />
          <FramerSpotlight />
          <div className="container px-4 md:px-6 py-16 md:py-20">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <AnimatedBuster
                state={state}
                className="shadow-2xl cursor-pointer hover:scale-110 hover:rotate-6 transition-all duration-300 hover:animate-spin"
                style={{ borderRadius: '50%', width: '200px', height: '200px', marginBottom: 35 }}
              />
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-6">
                AI Solution for Web 3.0 Businesses
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
                Empower DeFi Adoption with AI-powered Engine
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl mb-12">
                Focus on shipping great products, we’ll handle the connection between your users and
                your app
              </p>

              <TypingPromptInput />

              <div className="flex flex-wrap justify-center gap-3 mt-16">
                <Button
                  onClick={() => (window.location.href = 'https://suite.getgrowly.app')}
                  className="flex items-center gap-3 px-5 py-6 h-[40px] bg-primary hover:bg-primary/90 text-white rounded-xl border-0 dark:bg-primary dark:hover:bg-primary/90 dark:shadow-[0_0_15px_rgba(36,101,237,0.5)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 dark:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  <ArrowRight />
                  <div className="flex flex-col items-start relative z-10">
                    <span
                      className="text-[15px] font-bold"
                      onMouseEnter={() => setState('hover')}
                      onMouseLeave={() => setState('idle')}>
                      Set up in minutes
                    </span>
                  </div>
                </Button>
                <Button className="px-5 py-6 h-[40px] rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[15px] font-medium text-foreground">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Built with your familiar tech stack */}
        <TechStack />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works */}
        <section className="py-20" id="how-it-works" aria-labelledby="how-it-works-heading">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <div className="space-y-2" style={{ marginBottom: 50 }}>
                <h2
                  id="how-it-works-heading"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Seamless dApps Integrations
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our platform is designed with user experience in mind, making it easy to integrate
                  with your dApps.
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 items-start">
              {[
                {
                  image: '/jumbotron/configure-agent.png',
                  title: 'Create Agents and Workflows',
                  description:
                    'Create custom agents and workflows to handle complex tasks and automate workflows.',
                },
                {
                  image: '/jumbotron/install-widget.png',
                  title: 'Integrate and Customize Widgets',
                  description: 'Integrate and customize widgets to match your needs.',
                },
                {
                  image: '/jumbotron/assign-workflow.png',
                  title: 'Provide Instructions for the Agents',
                  description:
                    'Provide clear instructions for the agents to onboard users based on their journey in the app.',
                },
              ].map(({ image, title, description }, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-[400px] w-full items-center justify-center rounded-full cursor-pointer hover:bg-primary transition-colors duration-300 text-primary-foreground">
                    <img src={image} alt={title} />
                  </div>
                  <div style={{ marginTop: 85 }}>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Feature Banner */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
          aria-labelledby="key-features-heading">
          <GridBackground />
          <FramerSpotlight />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <div className="space-y-2">
                <h2
                  id="key-features-heading"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Suite Dashboard for AI Agents Management
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Manage your AI agents and workflows in one place with our user-friendly interface.
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <img
                  src="/banners/dashboard-banner.png"
                  width={1280}
                  height={720}
                  alt="Suite dashboard"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        {/* DeFi Specialization */}
        <section
          className="py-20"
          id="defi-specialization"
          aria-labelledby="defi-specialization-heading">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <div className="space-y-2" style={{ marginBottom: 50 }}>
                <h2
                  id="defi-specialization-heading"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Unlock Web3 Insights
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Powerful tools to understand dApps, analyze on-chain activities, and get
                  personalized recommendations
                </p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 items-start">
              {[
                {
                  component: <KnowYourDapp />,
                  title: 'Know Your dApp (KYD)',
                  description:
                    'Feed the AI assistant with everything about the Dapp (GitHub, Gitbook, blogs) so it can easily explain your product to users.',
                },
                {
                  component: <Persona />,
                  title: 'Onchain Persona Analysis',
                  description:
                    'Aggregate multichain transaction data and cross-dApp activities to build a comprehensive risk profile of each user.',
                },
                {
                  component: <IntentSuggestion />,
                  title: 'Intent Suggestion',
                  description:
                    'Simplify DeFi access with data-informed user guidance, and plug-and-play widgets (OnchainKit).',
                },
              ].map(({ component, title, description }, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-[400px] w-full items-center justify-center rounded-full cursor-pointer hover:bg-primary transition-colors duration-300 text-primary-foreground">
                    {component}
                  </div>
                  <div style={{ marginTop: 85 }}>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DeFi Use Cases */}
        <UseCasesDefi />
        <Footer />
      </div>
    </>
  );
}
