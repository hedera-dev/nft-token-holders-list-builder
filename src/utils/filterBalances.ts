import { BalancesWithNFT } from '@/types/balances-response';

export const filterBalances = (
  filteredNftData: BalancesWithNFT[],
  isAllConditionsRequired: boolean,
  responses: BalancesWithNFT[][],
): BalancesWithNFT[] => {
  return filteredNftData.filter((balance, index, self) => {
    const isUniqueAccount = self.findIndex((b) => b.account === balance.account) === index;
    const isPresentInAllResponses = responses.every((response) => response.some((b) => b.account === balance.account));
    return isUniqueAccount && (isAllConditionsRequired ? isPresentInAllResponses : true);
  });
};
