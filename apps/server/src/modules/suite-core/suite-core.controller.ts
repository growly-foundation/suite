// src/chat/chat.controller.ts
import { Body, Controller, Post } from '@nestjs/common';

import { PublicDatabaseService, SuiteDatabaseCore } from '@getgrowly/core';

import { SuiteCoreService } from './suite-core.service';

@Controller('core')
export class SuiteCoreController {
  constructor(private readonly suiteCoreService: SuiteCoreService) {}

  @Post('call')
  async call<T extends keyof Omit<SuiteDatabaseCore, 'db'>>(
    @Body('service') service: T,
    @Body('method') method: keyof Omit<SuiteDatabaseCore, 'db'>[T],
    @Body('args') args?: any[]
  ) {
    return this.suiteCoreService.call(service, method, args);
  }

  @Post('call-db')
  async callDatabaseService<
    T extends keyof Omit<SuiteDatabaseCore['db'], 'client'>,
    M extends keyof PublicDatabaseService<T>,
  >(
    @Body('service') service: T,
    @Body('method') method: M,
    @Body('args') args: Parameters<PublicDatabaseService<T>[M]>
  ) {
    return this.suiteCoreService.callDatabaseService(service, method, args);
  }
}
