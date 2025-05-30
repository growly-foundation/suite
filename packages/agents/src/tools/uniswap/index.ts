import { makeGenerateIntentTool } from './features/generate-intent';
import { makeLiquidityProviderTool } from './features/liquidity-provider';
import { makePortfolioAnalyzerTool } from './features/portfolio-analyzer';
import { makeRebalancePortfolioTool } from './features/rebalance';
import { makeSuggestSwapTool } from './features/suggest-swap';

export function makeUniswapTools() {
  const rebalancePortfolioTool = makeRebalancePortfolioTool();
  const portfolioAnalyzerTool = makePortfolioAnalyzerTool();
  const liquidityProviderTool = makeLiquidityProviderTool();
  const suggestSwapTool = makeSuggestSwapTool();
  const generateIntentTool = makeGenerateIntentTool();

  return {
    rebalancePortfolioTool,
    portfolioAnalyzerTool,
    liquidityProviderTool,
    suggestSwapTool,
    generateIntentTool,
  };
}
