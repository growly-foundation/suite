'use client';

import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';

import { GrowlyComponent } from '@getgrowly/suite';

export default function TypingPromptInput() {
  const prompts = [
    'What tokens should I invest in for this Uniswap LP token?',
    'What are the best yield farming strategies for Well Protocol?',
    'What are the most profitable liquidity pools on Uniswap v3?',
    'What are the most underutilized lending markets with high supply APY on Base?',
    'What is the best way to manage my liquidity pool positions on Uniswap v3?',
    'What are the best low-risk looping strategies using Morpho on Base?',
    'What are the current best lending strategies on Morpho Blue on Base?',
    'What are the best yield farming strategies for Well Protocol?',
    'What are the top-yielding LP positions on Velodrome/Aerodrome today?',
  ];

  const [displayText, setDisplayText] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Controls the typing speed
  const typingSpeed = 100; // milliseconds per character
  const deletingSpeed = 30; // milliseconds per character
  const pauseBeforeDelete = 3000; // pause before deleting
  const pauseBeforeNextPrompt = 100; // pause before typing next prompt

  const handleSend = () => {
    console.log('Send clicked');
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      // Typing animation
      if (currentCharIndex < prompts[currentPromptIndex].length) {
        timeout = setTimeout(() => {
          setDisplayText(prompts[currentPromptIndex].substring(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
        }, typingSpeed);
      } else {
        // Finished typing, pause before deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseBeforeDelete);
      }
    } else {
      // Deleting animation
      if (currentCharIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(prompts[currentPromptIndex].substring(0, currentCharIndex - 1));
          setCurrentCharIndex(currentCharIndex - 1);
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next prompt
        timeout = setTimeout(() => {
          setCurrentPromptIndex((currentPromptIndex + 1) % prompts.length);
          setIsTyping(true);
        }, pauseBeforeNextPrompt);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, currentPromptIndex, isTyping, prompts]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Outer glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>

        <div className="relative">
          <Input
            className="pr-20 py-6 text-base rounded-xl backdrop-blur-md border-2 focus-visible:ring-0 focus-visible:ring-offset-0 
            dark:bg-background/20 dark:border-white/5 dark:text-white
            bg-white/80 border-primary/10 text-gray-800 shadow-[0_4px_20px_rgba(36,101,237,0.2)]"
            placeholder=""
            value={displayText}
            readOnly
          />
          <GrowlyComponent.Button
            withUserMessage
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 
            bg-primary/90 hover:bg-primary backdrop-blur-md shadow-md"
            aria-label="Send message"
            triggerMessage={displayText}
            onClick={handleSend}>
            <Send className="h-5 w-5" />
          </GrowlyComponent.Button>
        </div>
      </div>
    </div>
  );
}
