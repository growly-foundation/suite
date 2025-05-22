import { ConfigService } from '@nestjs/config';
import { makeRebalancePortfolioTool } from './rebalance';
import { makePortfolioAnalyzerTool } from './portfolio-analyzer';
import { makeLiquidityProviderTool } from './liquidity-provider';
import { makeSuggestSwapTool } from './suggest-swap';

export function makeUniswapTools(configService: ConfigService) {
  const rebalancePortfolioTool = makeRebalancePortfolioTool(configService);
  const portfolioAnalyzerTool = makePortfolioAnalyzerTool(configService);
  const liquidityProviderTool = makeLiquidityProviderTool(configService);
  const suggestSwapTool = makeSuggestSwapTool(configService);

  return {
    rebalancePortfolioTool,
    portfolioAnalyzerTool,
    liquidityProviderTool,
    suggestSwapTool,
  };
}
