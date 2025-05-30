import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNumberFromStr = (str: string, max: number): number => {
  const num =
    (str
      .split('')
      .map(v => v.charCodeAt(0))
      .reduce((p, c) => p + c, 0) %
      max) +
    1;
  return num;
};
