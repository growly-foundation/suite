import { payload, UserDefinedStep } from '@getgrowly/core';

/**
 * Growly step element that can be used to define a step.
 */
export const GrowlyStep = ({
  children,
  ...stepProps
}: { children: React.ReactNode } & UserDefinedStep['payload']) => {
  return <div data-growly={payload({ type: 'step', payload: stepProps })}>{children}</div>;
};
