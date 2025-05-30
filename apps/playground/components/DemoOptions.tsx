import { ComponentMode } from '@/components/form/component-mode';
import { ComponentTheme } from '@/components/form/component-theme';
import { SuiteComponent } from '@/types/suite';

import { ActiveComponent } from './form/active-component';
import { Chain } from './form/chain';
import { DisplayMode } from './form/display-mode';

const COMMON_OPTIONS = [ActiveComponent, ComponentMode, ComponentTheme];

const COMPONENT_CONFIG: Partial<Record<SuiteComponent, (() => React.JSX.Element)[]>> = {
  [SuiteComponent.ChatWidget]: [Chain, DisplayMode],
  [SuiteComponent.DemoChatWidget]: [Chain, DisplayMode],
};

export default function DemoOptions({ component }: { component?: SuiteComponent }) {
  const commonElements = COMMON_OPTIONS.map(Component => <Component key={Component.name} />);

  const specificElements = component
    ? (COMPONENT_CONFIG[component] || []).map(Component => <Component key={Component.name} />)
    : [];

  return (
    <>
      {commonElements}
      {specificElements}
    </>
  );
}
