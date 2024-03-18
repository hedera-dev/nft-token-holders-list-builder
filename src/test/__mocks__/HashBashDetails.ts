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
export const HashBashDetails = {
  admin_key: {
    _type: 'ED25519',
    key: '2716d17cb5a4f25cc6d90e74b634316fb188c1dc4d286d2ffc62c29e5f6f52f3',
  },
  auto_renew_account: '0.0.915687',
  auto_renew_period: 7776000,
  created_timestamp: '1688648265.063006548',
  custom_fees: {
    created_timestamp: '1688648265.063006548',
    fixed_fees: [],
    royalty_fees: [
      {
        all_collectors_are_exempt: false,
        amount: {
          denominator: 100,
          numerator: 5,
        },
        collector_account_id: '0.0.3092385',
        fallback_fee: null,
      },
    ],
  },
  decimals: '0',
  deleted: false,
  expiry_timestamp: 1696424265063006548,
  fee_schedule_key: {
    _type: 'ED25519',
    key: '2716d17cb5a4f25cc6d90e74b634316fb188c1dc4d286d2ffc62c29e5f6f52f3',
  },
  freeze_default: false,
  freeze_key: null,
  initial_supply: '0',
  kyc_key: null,
  max_supply: '400',
  memo: '',
  modified_timestamp: '1688654864.046354869',
  name: 'HashBash vol. 1 - #HBARtoManila',
  pause_key: null,
  pause_status: 'NOT_APPLICABLE',
  supply_key: {
    _type: 'ED25519',
    key: '2716d17cb5a4f25cc6d90e74b634316fb188c1dc4d286d2ffc62c29e5f6f52f3',
  },
  supply_type: 'FINITE',
  symbol: 'HB1',
  token_id: '0.0.3103996',
  total_supply: '400',
  treasury_account_id: '0.0.3092513',
  type: 'NON_FUNGIBLE_UNIQUE',
  wipe_key: null,
};
