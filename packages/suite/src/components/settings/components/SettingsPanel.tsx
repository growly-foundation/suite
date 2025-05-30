import { ConnectWallet } from '@/components/chat/components/ConnectWallet';
import { PanelLayout } from '@/components/panel/components/PanelLayout';
import { Button } from '@/components/ui/button';
import { useSuiteSession } from '@/hooks/use-session';
import { Screen } from '@/types/screen';
import { ArrowLeft } from 'lucide-react';

export const SettingsPanel = () => {
  const { setScreen } = useSuiteSession();
  return (
    <PanelLayout>
      <div className="flex flex-col items-center justify-center h-full p-[50px] space-y-4">
        <ConnectWallet />
        <Button
          onClick={() => {
            setScreen(Screen.Home);
          }}>
          <ArrowLeft /> Back to Main Panel
        </Button>
      </div>
    </PanelLayout>
  );
};
