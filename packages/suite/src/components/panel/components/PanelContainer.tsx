import { MobileNavigation } from '@/components/MobileNavigation';
import { ChatPanel } from '@/components/chat/components/ChatPanel';
import { HomePanel } from '@/components/home/HomePanel';
import { SettingsPanel } from '@/components/settings/components/SettingsPanel';
import { useSuiteSession } from '@/hooks/use-session';
import { useSuite } from '@/hooks/use-suite';
import { useThemeStyles } from '@/hooks/use-theme-styles';
import { cn } from '@/lib/utils';
import { border } from '@/styles/theme';
import { Screen } from '@/types/screen';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { PanelHeader } from './PanelHeader';

export function PanelContainer() {
  const { config } = useSuite();
  const { panelOpen, screen } = useSuiteSession();
  const styles = useThemeStyles();

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'fixed rounded-tl-2xl bottom-0 right-0 w-full max-w-[500px] sm:w-[500px] shadow-3xl z-[9999] flex flex-col overflow-hidden',
            border.default,
            config?.display === 'fullView' ? 'h-[90vh]' : 'h-[90vh] md:h-[80vh]'
          )}
          style={styles.panel.container}>
          {/* Header */}
          <div className={'p-4 border-b'} style={styles.panel.header}>
            <PanelHeader />
          </div>
          {screen === Screen.Home ? (
            <HomePanel />
          ) : (
            <React.Fragment>
              {screen === Screen.Chat && <ChatPanel />}
              {screen === Screen.Settings && <SettingsPanel />}
              <MobileNavigation />
            </React.Fragment>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
