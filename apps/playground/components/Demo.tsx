'use client';

import { AppContext } from '@/components/AppProvider';
import { cn } from '@/lib/utils';
import { SuiteComponent } from '@/types/suite';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContext, useEffect, useState } from 'react';

import DemoOptions from './DemoOptions';
import { ChatWidgetDemo } from './demo/ChatWidgetDemo';
import { DemoChatWidgetDemo } from './demo/DemoChatWidgetDemo';

const activeComponentMapping: Record<SuiteComponent, React.FC> = {
  [SuiteComponent.ChatWidget]: ChatWidgetDemo,
  [SuiteComponent.DemoChatWidget]: DemoChatWidgetDemo,
  [SuiteComponent.StaticWidget]: ChatWidgetDemo,
};

export default function Demo() {
  const { activeComponent } = useContext(AppContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    console.log('Playground.activeComponent:', activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const buttonStyles = `rounded border px-3 py-2 transition-colors ${
    isDarkMode
      ? 'border-gray-600 bg-gray-800 text-white hover:bg-gray-700'
      : 'border-gray-300 bg-white text-black hover:bg-gray-100'
  }`;

  const ActiveComponent = activeComponent ? activeComponentMapping[activeComponent] : null;

  return (
    <>
      <div
        className={cn(
          'absolute top-0 right-0 bottom-0 left-0 z-20 flex w-full min-w-80 max-w-[500px] flex-col border-r bg-background p-6 transition-[height] sm:static sm:z-0 sm:w-1/4'
        )}>
        <div className="flex justify-between" style={{ marginBottom: 30 }}>
          <div className="self-center font-semibold text-xl">Growly Suite Playground</div>
        </div>
        <button type="button" onClick={toggleDarkMode} className={buttonStyles}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <div className="mx-auto flex items-center justify-center pt-6 text-sm">
          <ConnectButton />
        </div>
        <form className="mt-4 grid gap-8">
          <DemoOptions component={activeComponent} />
        </form>
        <div className="mt-auto flex items-center justify-between pt-6 text-sm">
          <div>
            <a
              className="opacity-100 transition-opacity duration-200 hover:opacity-70"
              href="https://github.com/growly-foundation/suite"
              rel="noreferrer"
              target="_blank"
              title="View Suite on GitHub">
              Github ↗
            </a>
            <a
              className="pl-4 opacity-100 transition-opacity duration-200 hover:opacity-70"
              href="https://www.getgrowly.app/"
              rel="noreferrer"
              target="_blank"
              title="View Growly Suite">
              Growly Suite↗
            </a>
          </div>
        </div>
      </div>

      <div className="linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] flex flex-1 flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px), bg-[size:6rem_4rem]">
        <div className={'flex h-full w-full flex-col items-center'}>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </>
  );
}
