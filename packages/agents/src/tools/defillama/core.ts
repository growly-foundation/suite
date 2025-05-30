import { ToolFn, ToolOutputValue } from '../../utils/tools';
import { getDefillamaRpcInstance } from './rpc';
import { ProtocolResponse } from './types';
import { excludeTimeSeriesFields } from './utils';

export const getProtocolToolFn: ToolFn =
  () =>
  async ({ protocolId }): Promise<ToolOutputValue[]> => {
    try {
      const response = await getDefillamaRpcInstance().get<ProtocolResponse>(
        `/protocol/${protocolId.toLowerCase()}`
      );
      const protocol = response.data;

      // Exclude time-series data to make the response more manageable
      const prunedData = excludeTimeSeriesFields(protocol);

      return [
        {
          type: 'text',
          content: JSON.stringify(prunedData, null, 2),
        },
      ];
    } catch (error: any) {
      return [
        {
          type: 'system:error',
          content: `Failed to fetch protocol data: ${error.message}`,
        },
      ];
    }
  };
