import { Inject, Injectable, Logger } from '@nestjs/common';

import { PublicDatabaseService, SuiteDatabaseCore } from '@getgrowly/core';

@Injectable()
export class SuiteCoreService {
  private readonly logger = new Logger(SuiteCoreService.name);

  constructor(@Inject('GROWLY_SUITE_CORE') private readonly suiteCore: SuiteDatabaseCore) {}

  async call<T extends keyof Omit<SuiteDatabaseCore, 'db'>>(
    service: T,
    method: keyof Omit<SuiteDatabaseCore, 'db'>[T],
    args?: any[]
  ) {
    try {
      const fn = this.suiteCore[service][method];
      if (!fn || typeof fn !== 'function') {
        throw new Error(`Method ${String(method)} not found on service ${String(service)}`);
      }
      const boundFn = fn.bind(this.suiteCore[service]); // Bind the context of the function
      if (!args) {
        return boundFn();
      } else {
        return boundFn(...args);
      }
    } catch (error) {
      this.logger.error(`Error calling core service ${service}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async callDatabaseService<
    T extends keyof Omit<SuiteDatabaseCore['db'], 'client'>,
    M extends keyof PublicDatabaseService<T>,
  >(
    service: T,
    method: M,
    args: Parameters<PublicDatabaseService<T>[M]>
  ): Promise<ReturnType<PublicDatabaseService<T>[M]>> {
    try {
      const fn = this.suiteCore.db[service][method] as (
        ...args: Parameters<PublicDatabaseService<T>[M]>
      ) => ReturnType<PublicDatabaseService<T>[M]>;
      if (!fn || typeof fn !== 'function') {
        throw new Error(`Method ${String(method)} not found on service ${String(service)}`);
      }

      const boundFn = fn.bind(this.suiteCore.db[service]); // Bind the context of the function
      const data = await boundFn(...args);
      return data;
    } catch (error) {
      this.logger.error(
        `Error calling core service [${service}][${method}][${args}]: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
