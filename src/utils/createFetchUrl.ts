import { TokenDetails } from '@/types/tokenDetails-response';
import { nodeUrl } from '@/utils/const';

export const createFetchUrl = (tokenId: string, minAmount: string, isNFT: boolean, tokenDetails: TokenDetails[]) => {
  if (!isNFT) {
    const currentTokenDetails = tokenDetails?.find((token: TokenDetails) => token.token_id === tokenId);

    // Move digits to the right to match the token's decimals
    const amount = Number(minAmount) * Math.pow(10, Number(currentTokenDetails?.decimals));
    return `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${amount}&limit=100`;
  }

  return `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${minAmount}&limit=100`;
};
