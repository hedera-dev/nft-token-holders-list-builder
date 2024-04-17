/*-
 *
 * Hedera Token Holders List
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { TokenDetails } from '@/types/tokenDetails-response';
import { nodeUrl } from '@/utils/const';
import { changeDurationToDate } from './changeDurationToDate';
import { DurationType } from '@/components/HoldersForm';

export const createFetchUrl = (tokenId: string, minAmount: string, isNFT: boolean, tokenDetailsList: TokenDetails[]) => {
  if (!isNFT) {
    const currentTokenDetails = tokenDetailsList?.find((token: TokenDetails) => token.token_id === tokenId);

    // Move digits to the right to match the token's decimals
    const amount = Number(minAmount) * Math.pow(10, Number(currentTokenDetails?.decimals));
    return `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${amount}&limit=100`;
  }

  return `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${minAmount}&limit=100`;
};

export const createFetchUrlDurationSnapshot = (tokenId: string, minAmount: string, isNFT: boolean, tokenDetailsList: TokenDetails[], duration: string | Date, durationType: DurationType) => {
  const convertedDuration = changeDurationToDate(duration, durationType);
  const convertedDurationTimestamp = Math.floor(convertedDuration.getTime() / 1000);
  if (!isNFT) {
    const currentTokenDetails = tokenDetailsList?.find((token: TokenDetails) => token.token_id === tokenId);

    // Move digits to the right to match the token's decimals
    const amount = Number(minAmount) * Math.pow(10, Number(currentTokenDetails?.decimals));
    return `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${amount}&timestamp=${convertedDurationTimestamp}.000000000&limit=100`;
  }

  return `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${minAmount}&timestamp=${convertedDurationTimestamp}.000000000&limit=100`;
};
