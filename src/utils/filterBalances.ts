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

export const filterBalances = (
  filteredNftData: BalancesWithNFT[],
  isAllConditionsRequired: boolean,
  responses: BalancesWithNFT[][],
): BalancesWithNFT[] => {
  return filteredNftData.filter((balance, index, self) => {
    const isUniqueAccount = self.findIndex((b) => b.account === balance.account) === index;
    const isPresentInAllResponses = responses?.every((response) => response.some((b) => b.account === balance.account));
    return isUniqueAccount && (isAllConditionsRequired ? isPresentInAllResponses : true);
  });
};
