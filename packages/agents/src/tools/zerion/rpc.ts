import axios from 'axios';

import { ZERION_V1_BASE_URL } from './constants';

export const getZerionAxiosInstance = () => {
  let headers: Record<string, string> = {
    Accept: 'application/json',
  };
  const apiKey = process.env.ZERION_API_KEY;
  if (apiKey) {
    headers = {
      ...headers,
      Authorization: `Basic ${getEncodedKey(apiKey)}`,
    };
  }
  return axios.create({
    baseURL: ZERION_V1_BASE_URL,
    headers,
  });
};

// Factory function to get encoded key using ConfigService
export function getEncodedKey(apiKey: string): string {
  if (!apiKey) {
    throw new Error('ZERION_API_KEY is not configured.');
  }
  return Buffer.from(`${apiKey}:`).toString('base64');
}
