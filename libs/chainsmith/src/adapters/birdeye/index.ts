import { Logger } from 'tslog';

import type { IAdapter } from '../../types';

export class BirdEyeAdapter implements IAdapter {
  name = 'BirdEyeAdapter';
  logger = new Logger({ name: this.name });
}
