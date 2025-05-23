import { SuiteConfig } from '@/components/providers/SuiteProvider.types';

export const defaultTheme: SuiteConfig['theme'] = {
  primary: '#0052ff',
  headerBackground: '#0052ff',
  headerText: 'white',
  secondary: '#3c79fd',
  text: 'white',
  textForeground: 'black',
  background: 'white',
  backgroundForeground: 'white',
};

export const monoTheme: SuiteConfig['theme'] = {
  primary: '#0052ff',
  headerBackground: 'white',
  headerText: 'black',
  secondary: '#0052ff',
  text: 'white',
  textForeground: 'black',
  background: 'white',
  backgroundForeground: 'white',
};

export const defaultDarkTheme: SuiteConfig['theme'] = {
  primary: '#0052ff',
  headerBackground: 'black',
  headerText: 'white',
  secondary: 'white',
  text: 'black',
  textForeground: 'white',
  background: 'black',
  backgroundForeground: '#0052ff',
};
