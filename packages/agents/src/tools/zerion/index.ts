import { makeGetFungiblePositionsTool } from './features/get-fungible-positions';
import { makePortfolioOverviewTool } from './features/get-portfolio';

export function makeZerionTools() {
  return {
    getPortfolioOverviewTool: makePortfolioOverviewTool(),
    getFungiblePositionsTool: makeGetFungiblePositionsTool(),
  };
}
