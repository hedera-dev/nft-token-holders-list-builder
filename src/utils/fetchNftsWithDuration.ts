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
import { BalancesWithNFT } from '@/types/balances-response';
import { nodeUrl } from '@/utils/const';
import { NftsResponseType } from '@/types/nfts-response';
import { getHolderAndDuration } from 'nft-utilities/src/getHolderAndDuration/index';
import { changeDurationToDate } from '@/utils/changeDurationToDate';

export const fetchNftsWithDuration = async (nftBalances: BalancesWithNFT[]): Promise<BalancesWithNFT[]> => {
  for (const nftBalance of nftBalances) {
    // Skip if the NFT doesn't have a duration. Duration is not required
    if (!nftBalance.duration) continue;

    let countSuccessfullyNfts = 0;
    let nextLink: string = `${nodeUrl}/api/v1/tokens/${nftBalance.tokenId}/nfts?account.id=${nftBalance.account}`;

    do {
      // Break the loop if the count of successfully fetched NFTs is greater than or equal to the minAmount
      if (countSuccessfullyNfts >= Number(nftBalance.minAmount)) {
        break;
      }
      const response = await fetch(nextLink);
      const data: NftsResponseType = await response.json();

      for (const nft of data.nfts) {
        const result = await getHolderAndDuration({ tokenId: nftBalance.tokenId, serialNumber: nft.serial_number, network: 'mainnet' });
        if (!result) continue;

        const holderSinceDate: Date = new Date(result?.holderSince);

        // If the NFT is held for longer than the duration, increment the count
        if (changeDurationToDate(nftBalance.duration, nftBalance.durationType) > holderSinceDate) {
          countSuccessfullyNfts++;
        }
      }

      nextLink = data.links.next ? `${nodeUrl}${data.links.next}` : '';
    } while (nextLink);
    // Remove account from nftBalances if it doesn't meet the condition
    if (countSuccessfullyNfts < Number(nftBalance.minAmount)) {
      nftBalances = nftBalances.filter((item) => item.account !== nftBalance.account);
    }
  }

  return nftBalances;
};
