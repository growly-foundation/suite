import axios from 'axios';

/**
 * Base URL for the DefiLlama API
 */
export const DEFILLAMA_BASE_URL = 'https://api.llama.fi';

export const getDefillamaRpcInstance = () =>
  axios.create({
    baseURL: DEFILLAMA_BASE_URL,
    headers: {
      Accept: 'application/json',
    },
  });
