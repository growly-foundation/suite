import { API_URL } from '@/constants';
import { PublicDatabaseService, SuiteDatabaseCore } from '@getgrowly/core';
import axios from 'axios';

export class CoreService {
  constructor() {}

  /**
   * Call a service method
   * @param service Suite service name
   * @param method Service method name
   * @param args Method arguments
   * @returns
   */
  async call<T extends keyof Omit<SuiteDatabaseCore, 'db'>, R>(
    service: T,
    method: keyof Omit<SuiteDatabaseCore, 'db'>[T],
    args?: any[]
  ): Promise<R> {
    try {
      const response = await axios.post(
        `${API_URL}/core/call`,
        {
          service,
          method,
          args,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async callDatabaseService<
    T extends keyof Omit<SuiteDatabaseCore['db'], 'client'>,
    M extends keyof PublicDatabaseService<T>,
    R extends ReturnType<PublicDatabaseService<T>[M]>,
  >(service: T, method: M, args?: Parameters<PublicDatabaseService<T>[M]>): Promise<R> {
    try {
      const response = await axios.post(
        `${API_URL}/core/call-db`,
        {
          service,
          method,
          args,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const suiteCoreService = new CoreService();
