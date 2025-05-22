'use client';

import IntentSuggestion from '@/components/defi/intent-suggestion';
import KnowYourDapp from '@/components/defi/kyd';
import Persona from '@/components/defi/persona';
import FeaturesSection from '@/components/features-section';
import DemoInstallationSection from '@/components/widget-installation-section';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import StructuredData from '@/components/structured-data';
import TechStack from '@/components/tech-stack';
import TypingPromptInput from '@/components/typing-prompt-input';
import { Button } from '@/components/ui/button';
import UseCasesDefi from '@/components/use-cases-defi';
import { GrowlyComponent } from '@getgrowly/suite';
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
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-lg mb-6">
                Suite is in Beta and open for feedback
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
                  className="flex items-center gap-3 px-5 py-6 h-[60px] bg-primary hover:bg-primary/90 text-white rounded-xl border-0 dark:bg-primary dark:hover:bg-primary/90 dark:shadow-[0_0_15px_rgba(36,101,237,0.5)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 dark:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  <ArrowRight />
                  <div className="flex flex-col items-start relative z-10">
                    <span
                      className="text-[20px] font-bold"
                      onMouseEnter={() => setState('hover')}
                      onMouseLeave={() => setState('idle')}>
                      Set up in minutes
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Built with your familiar tech stack */}
        <TechStack />

        {/* Features Section */}
        <FeaturesSection />

        {/* Installation Section */}
        <DemoInstallationSection />

        {/* Key Feature Banner */}
        <section
          id="features"
          className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
          aria-labelledby="features-heading">
          <GridBackground />
          <FramerSpotlight />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
              <div className="space-y-2">
                <h2
                  id="features-heading"
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
              <img
                src="/graphics/buster-mascot-3d.png"
                className="max-sm:hidden absolute object-cover w-[140px] h-[140px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] left-[-30px] md:left-[-50px] lg:left-[-80px] bottom-[-40px] md:bottom-[-60px] lg:bottom-[-80px] rotate-[15deg] hover:rotate-[-10deg] transition-all duration-300 cursor-pointer"
              />
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <video
                  src="/videos/workflow-guide.mp4"
                  width={1480}
                  height={720}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
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
                <GrowlyComponent.Div
                  key={index}
                  withUserMessage={false}
                  triggerMessage={`Explain about ${title} feature in Growly Suite: ${description}`}
                  className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-[400px] w-full items-center justify-center rounded-full cursor-pointer hover:bg-primary transition-colors duration-300 text-primary-foreground">
                    {component}
                  </div>
                  <div style={{ marginTop: 85 }}>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </GrowlyComponent.Div>
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
