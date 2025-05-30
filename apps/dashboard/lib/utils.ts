import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateId() {
  return `id-${Math.random().toString(36).substring(2, 9)}`;
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

export const truncateString = (str: string, maxLength: number): string =>
  `${str.slice(0, maxLength)}${str.length > maxLength ? '...' : ''}`;
